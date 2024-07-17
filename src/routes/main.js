const express = require('express');
const app = express();
const routes = express.Router();
const bodyparser = require("body-parser");
var jsonparser = bodyparser.json();
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient(process.env.URL);
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/img/')
    },
    filename:(req,file,cb)=>{
        let ext = file.originalname
        cb(null,ext)
    }
})

let upload = multer({
    storage: storage,
})


routes.get('/',async (req,res)=>{
    res.render('login');
});

routes.get('/care',async (req,res)=>{
    res.render('care');
});

routes.post('/login_check', jsonparser , async (req,res)=>{
    let login_success = false;
    success_data = {
        username:null,
        email:null,
        password:null
    }
    // console.log("Hello World");
    try{
        await client.connect();
        // console.log("Hello World");
        if(req.body.email){
            const item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).findOne({ email : req.body.email });
            // console.log("This is item ",item);
            if(req.body.password === item.password){
                login_success = true;
                success_data.username = item.user;
                success_data.email = item.email;
                success_data.password = item.password;

                req.session.username = item.user;
                req.session.email = item.email;
                req.session.password = item.password;
            }
        }
    }
    catch(err){
        console.log("This is error from try catch ",err)
    }
    finally{
        await client.close();
    }
    data={
        message:"Message from login check backend",
        success:login_success,
        email:success_data.email,
        password:success_data.password,
        username:success_data.username
    }
    // console.log(data);
    res.send(data);
})

routes.get('/register',async (req,res)=>{
    res.render('register');
})

routes.post('/registration_check',jsonparser,async (req,res)=>{
    let registration_success = false;
    const register_user = {
        user:req.body.username,
        email:req.body.email,
        password:req.body.password
    }
    try{
        await client.connect();
        if(req.body.username){
            // console.log("User added ", req.body.username);
            const item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).insertOne(register_user);
            if(item.acknowledged){
                const insert_profile = {
                    email:req.body.email,
                    username:req.body.username,
                    following:[],
                    followers:[],
                    display_profile:"initial_profile_image.png",
                    bio:"This is my bio",
                    name:"This is my name",
                    occupation:"This is my occupation"
                }
                const status = await client.db(process.env.DB_NAME).collection(req.body.email).insertOne(insert_profile);
                if(status.acknowledged){
                    // console.log(item.acknowledged)
                    registration_success = item.acknowledged;
                    req.session.email = req.body.email;
                    req.session.username = req.body.username;
                    req.session.password = req.body.password;
                }
            }
        }
    }
    catch(error){
        console.log("This is error from try catch ",error);
    }
    finally{
        await client.close();
    }
    data = {
        message: "msg from Registration check",
        success: registration_success,
        email: register_user.email,
        password: register_user.password,
        username: register_user.user
    };
    // console.log(data);
    res.send(data);
})

// function contains(array, value) {
//     return array && array.includes(value);
// }

routes.get('/home',async (req,res)=>{
    let req_for_home = false;
    let username = null;
    let initial_profile_image = null;
    let followers = null;
    let following = null;
    let image = null;
    let total_images = null;
    try{
        await client.connect();
        if(req.session.email){
            item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).findOne({email:req.session.email});
            if(req.session.password == item.password){
                req_for_home=true;
                username = item.user;
                const details = await client.db(process.env.DB_NAME).collection(req.session.email).findOne({username:req.session.username});
                initial_profile_image = details.display_profile
                followers = details.followers.length;
                following = details.following.length;
                const posts = await client.db(process.env.DB_NAME).collection(process.env.POST_COLLECTION).find({}).toArray();
                image=posts;
                const posts_acc = await client.db(process.env.DB_NAME).collection(process.env.POST_COLLECTION).find({email:req.session.email}).toArray();
                total_images = posts_acc.length;

                const savedPosts = await client.db(process.env.DB_NAME).collection('saved_posts').find({ user_email: req.session.email }).toArray();
                const savedPostIds = new Set(savedPosts.map(sp => sp.post_id.toString()));

                for(const post of image){
                    post.liked = post.likes.includes(req.session.username);
                    post.saved = savedPostIds.has(post._id.toString());
                }
                // for (const post of image) {
                //     const savedMails = post.saved.map(savedItem => savedItem.mail);
                //     post.saved = savedMails.includes(req.session.email);
                //     console.log(post.saved);
                // }
                

            }
        }
    }
    catch(error){
        console.log(error);
    }
    finally{
        await client.close();
    }
    res.render('home',{total_images:total_images,username:username, profile_pic:initial_profile_image, following:following, followers:followers, posts:image});
})

routes.post('/upload_image',jsonparser, upload.single('postImage'),async (req,res)=>{
    let upload_success = false;
    // console.log("This is upload ",upload.single('postimage'))
    // console.log("This is req.body ",req.body)
    // console.log("This is req.file ",req.file)
    // console.log("This is req.file ",req.file.filename)
    const upload_image = {
        email:req.session.email,
        username:req.session.username,
        post : req.file.filename,
        comments:[],
        likes:[],
        caption:"This is caption",
        dp:"initial_profile_image.png"
    }
    try{
        await client.connect();
        if(req.session.email){
            const item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).findOne({email:req.session.email});
            if(item.password === req.session.password){
                const dp = await client.db(process.env.DB_NAME).collection(req.session.email).findOne({email:req.session.email});
                console.log(dp);
                const display_profile = dp.display_profile;
                upload_image.dp = display_profile;
                const status = await client.db(process.env.DB_NAME).collection(process.env.POST_COLLECTION).insertOne(upload_image);
                upload_success=true;
            }
        }
    }
    catch(err){
        console.log(err);
    }
    finally{
        await client.close();
    }
    res.send({ success : upload_success });
})


// main.js

routes.post('/like', jsonparser, async (req, res) => {
    let like_success = false;
    const { postId, postUsername } = req.body;

    try {
        await client.connect();
        const collection = client.db(process.env.DB_NAME).collection(process.env.POST_COLLECTION);

        const post = await collection.findOne({ _id: new ObjectId(postId) });

        if (post) {
            const isLiked = post.likes.includes(req.session.username);

            let update;
            if (isLiked) {
                update = { $pull: { likes: req.session.username } };
            } else {
                update = { $addToSet: { likes: req.session.username } };
            }

            const result = await collection.updateOne({ _id: new ObjectId(postId) }, update);
            like_success = result.modifiedCount > 0;
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }

    res.send({ like_success });
});


routes.post('/save', async (req, res) => {
    let save_success = false;
    const postId = req.body;

    try {
        await client.connect();
        const collection = client.db(process.env.DB_NAME).collection('saved_posts');

        const saveDoc = {
            user_email: req.session.email,
            post_id: new ObjectId(postId)
        };

        const result = await collection.updateOne(
            saveDoc,
            { $setOnInsert: saveDoc },
            { upsert: true }
        );

        save_success = result.upsertedCount > 0 || result.matchedCount > 0;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }

    res.send({ save_success });
});



routes.post('/unsave', async (req, res) => {
    let save_success = false;
    const postId = req.body;

    try {
        await client.connect();
        const collection = client.db(process.env.DB_NAME).collection('saved_posts');

        const result = await collection.deleteOne({
            user_email: req.session.email,
            post_id: new ObjectId(postId)
        });

        save_success = result.deletedCount > 0;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }

    res.send({ save_success });
});





routes.post('/comment', jsonparser, async (req, res) => {
    let comment_success = false;
    const { postId, commentText } = req.body;

    try {
        await client.connect();
        const collection = client.db(process.env.DB_NAME).collection(process.env.POST_COLLECTION);
        const usersCollection = client.db(process.env.DB_NAME).collection(req.session.email);

        const user = await usersCollection.findOne({ username: req.session.username }, { projection: { display_profile: 1 } });
        if (!user) {
            throw new Error('User not found');
        }

        const comment = {
            username: req.session.username,
            text: commentText,
            date: new Date(),
            dp:user.display_profile
        };

        const result = await collection.updateOne(
            { _id: new ObjectId(postId) },
            { $push: { comments: comment } }
        );

        comment_success = result.modifiedCount > 0;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }

    res.send({ success: comment_success });
});


routes.get('/get-comments/:postId', async (req, res) => {
    const postId = req.params.postId;
    let response = { success: false, comments: [] };

    try {
        await client.connect();
        const collection = client.db(process.env.DB_NAME).collection(process.env.POST_COLLECTION);
        const post = await collection.findOne({ _id: new ObjectId(postId) }, { projection: { comments: 1, dp : 1 } });

        if (post) {
            response = { success: true, comments: post.comments, dp:post.dp };
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
    res.send(response);
});


routes.get('/profile', async (req,res)=>{
    let profile_image = null;
    let posts = null;
    let profile_name = null;
    let total_images = null;
    let followers = null;
    let following = null;
    let name = null;
    let bio = null;
    let occupation = null;
    try{
        await client.connect();
        const item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).findOne({email:req.session.email});
        if(item.password === req.session.password){
            const status = await client.db(process.env.DB_NAME).collection(req.session.email).findOne({email:req.session.email});
            // console.log("++++",status.display_profile);
            profile_image = status.display_profile;
            profile_name = status.username;
            followers = status.followers.length;
            following = status.following.length;
            name = status.name;
            bio = status.bio;
            occupation = status.occupation;
            const posts_acc = await client.db(process.env.DB_NAME).collection(process.env.POST_COLLECTION).find({email:req.session.email}).toArray();
            posts = posts_acc;
            total_images = posts_acc.length;
        }
    }catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    // res.send(data);
    res.render('profile',{profile_image:profile_image, profile_name:profile_name,total_images:total_images, followers:followers, following:following, name:name, bio:bio, occupation:occupation,posts:posts});
})

routes.post('/editprofile',jsonparser,async(req,res)=>{
    let data = {
        success:false
    };
    try{
        await client.connect();
        const item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).findOne({email:req.session.email});
        if(item.password === req.session.password){
            const filter = {email:req.session.email};
            const edit = {
                $set: {
                    name: req.body.nickname,
                    bio: req.body.bio,
                    occupation: req.body.occupation
                }
            };
            const update = await client.db(process.env.DB_NAME).collection(req.session.email).updateOne(filter,edit);
            data.success = true;
        }
    }
    catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    res.send(data);
})

routes.post('/edit_profile_image',jsonparser, upload.single('editProfileImage'),async (req,res)=>{
    let edit_success = false;
    try{
        await client.connect();
        if(req.session.email){
            const item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).findOne({email:req.session.email});
            if(item.password === req.session.password){
                const filter = {email:req.session.email};
                const edit = {
                    $set : {
                        display_profile : req.file.filename
                    }
                }
                const edit2 = {
                    $set : {
                        dp : req.file.filename
                    }
                }
                const status = await client.db(process.env.DB_NAME).collection(req.session.email).updateOne(filter,edit);
                const status2 = await client.db(process.env.DB_NAME).collection(process.env.POST_COLLECTION).updateMany(filter,edit2);
                edit_success=true;
            }
        }
    }
    catch(err){
        console.log(err);
    }
    finally{
        await client.close();
    }
    res.send({ success : edit_success });
})

routes.post('/care_check',jsonparser,async(req,res)=>{
    let success=false;
    let feedback = {
        name:req.body.names,
        email:req.body.emails,
        phone:req.body.phones,
        message:req.body.messages,
        ogacc:req.session.email
    }
    console.log(feedback);
    try{
        await client.connect();
        const item = await client.db(process.env.DB_NAME).collection(process.env.AUTH_COLLECTION).findOne({email:req.session.email});
        if(item.password === req.session.password){
            const update = await client.db(process.env.DB_NAME).collection(process.env.CONTACT_COLLECTION).insertOne(feedback);
            console.log(update);
            success = true;
        }
    }
    catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

    res.send({ success : success });
})


routes.post('/logout', jsonparser, async (req,res)=>{
    let logout_success = false;
    try{
        req.session.destroy();
        logout_success = true;
    }
    catch (e) {
        console.error(e);
        logout_success = false;
    } finally {
        await client.close();
    }
    data = {
        logout_success: logout_success
    }
    res.send(data);
})

module.exports = routes ;