const express = require("express");
const hbs = require("hbs");
// const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const crypto = require('crypto');
require("dotenv").config();
const { MongoClient, ObjectId, Timestamp } = require('mongodb');
const client = new MongoClient(process.env.URL);
const app = express();
const http = require('http').Server(app)

hbs.registerHelper('contains', function (array, element) {
  return array.some((el) => el.luid === element);
});


// Generate a random session secret
const generateSessionSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};
const sessionSecret = generateSessionSecret();

hbs.registerHelper('eq', function (a, b, options) {
  if (a === b) {
    return true;
  } else {
    return false;
  }
});

hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.SESSION_STORE,
    ttl: 3600,
    autoRemove: 'interval',
    autoRemoveInterval: 60,
  })
}));
const routes = require("./routes/main");


app.use('/static', express.static('public'));
app.use("",routes);
// app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));


// template engine
app.set('view engine', 'hbs');
app.set("views", "views");
hbs.registerPartials("views/partials");

const io = require("socket.io")(http);
var usp = io.of('/too-gether');
usp.on('connection',async function(socket) {
    var my_online_status = socket.handshake.auth.token;
  try {
    await client.connect();
    await client.db(process.env.DB_NAME).collection(process.env.CHAT_COLLECTION).updateOne(
      { _id:new ObjectId(my_online_status) },
      { $set: { is_online: '1' } }
    );
     await socket.broadcast.emit('getOnlineUser',{user_id:my_online_status});

  } catch (error) {
    console.error("Database Error:", error);
  }
  socket.on('disconnect',async function() {
    var my_online_status = socket.handshake.auth.token;
    try {
      await client.connect();
      await client.db(process.env.DB_NAME).collection(process.env.CHAT_COLLECTION).updateOne(
        { _id:new ObjectId(my_online_status) },
        { $set: { is_online: '0' } }
      );
      await socket.broadcast.emit('getOfflineUser',{user_id:my_online_status});

    } catch (error) {
      console.error("Database Error:", error);
    }
  });

  socket.on('newChat',function(data){
    socket.broadcast.emit('loadNewChat',data);
  })

  //Load Old Chats
  socket.on('existChat',async function(data){
    try{
      await client.connect();
      var chats = await client.db(process.env.DB_NAME).collection(process.env.DM_COLLECTION).find({$or:[{sender_id:data.sender_id,receiver_id:data.receiver_id},
        {sender_id:data.receiver_id,receiver_id:data.sender_id}
      ]}).toArray();
      await socket.emit('loadChats',{ chats: chats})
    }catch(error){
      console.log("This is eror",error.message);
    }
  })

  socket.on('error', (err) => {
    console.error("Socket Error:", err);
  });
});



http.listen(process.env.PORT || 4001, ()=>{
    console.log(`Server Started At localhost:${process.env.PORT || 4001}`);
});