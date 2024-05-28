function like_me(like_username, like_postname, like_id) {
    let username = like_username;
    let postname = like_postname;
    const cls = document.getElementById(`like_${like_id}`);

    data = {
        other_user: username,
        other_post: postname,
        my_username: localStorage.getItem("Username"),
        my_email: localStorage.getItem("Email"),
        my_password: localStorage.getItem("Password"),
        like_status: cls.classList.contains("bi-heart"),
    };

    fetch('/like', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json())
        .then(data => {
            if (data.like_success) {
                cls.classList.toggle("bi-heart-fill", data.like_status);
                cls.classList.toggle("bi-heart", !data.like_status);
            } else {
                cls.classList.toggle("bi-heart-fill", !data.like_status);
                cls.classList.toggle("bi-heart", data.like_status);
            }
            // Update any other UI elements or perform additional actions as needed
        })
        .catch(e => {
            console.log("Error: ", e);
        });
}
