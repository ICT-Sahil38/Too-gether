function comment(comment_user,comment_post){
    let for_retrun = false;
    data = {
        c_username : comment_user,
        c_post : comment_post,
        email:localStorage.getItem("Email"),
        username:localStorage.getItem("Username"),
        password:localStorage.getItem("Password")
    }
    fetch('/comment',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json())
        .then(data => {
            s=``;
            if(data){
                for_retrun = true;
                console.log(data.success);
                s+=`<div class="modal fade comments" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="d-flex">
                            <div>
                                <img src="../static/img/${data.postname}" height="500px">
                            </div>
                            <div class="flex-grow-1">
                                <img src="../static/img/initial_profile_page_icon.png" height="25px" width="25px" style="border-radius: 50%;" class="me-2">
                                <b>${data.postusername}</b><hr>`
                                for(var i=0 ;i<data.postcomments.length;i++){
                                    s+=`<div class="comment_scroll">
                                        <div>
                                            <img src="../static/img/initial_profile_image.png" height="25px" width="25px" style="border-radius: 50%;" class="me-2">
                                            <b>${data.postcomments.username[i]}</b>
                                            <span>${data.postcomments.comment[i]}</span>
                                        </div>
                                    </div>`
                                }
                                s+=`<input type="text" placeholder="Post the comment" class="comment-model-input">
                                <button type="button" class="btn btn-primary ms-2">Post</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
            }
            document.getElementById("dalo").innerHTML = s;
        })
        .catch(e => {
            console.log("Error: ",e);
        })
    return data.success;
}