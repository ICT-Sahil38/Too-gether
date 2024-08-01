// function like_me(like_email,like_id) {
//     let email = like_email;
//     // let postname = like_postname;
//     const cls = document.getElementById(`like_${like_id}`);

//     data = {
//         // other_user: username,
//         // other_post: postname,
//         other_email: email,
//         my_username: localStorage.getItem("Username"),
//         my_email: localStorage.getItem("Email"),
//         my_password: localStorage.getItem("Password"),
//         like_status: cls.classList.contains("bi-heart"),
//     };
//     console.log(data);

//     fetch('/like', {
//         method: 'POST',
//         headers: { 'Content-type': 'application/json' },
//         body: JSON.stringify(data)
//     }).then(response => response.json())
//         .then(data => {
//             if (data.like_success) {
//                 cls.classList.toggle("bi-heart-fill", data.like_status);
//                 cls.classList.toggle("bi-heart", !data.like_status);
//             } else {
//                 cls.classList.toggle("bi-heart-fill", !data.like_status);
//                 cls.classList.toggle("bi-heart", data.like_status);
//             }
//             // Update any other UI elements or perform additional actions as needed
//         })
//         .catch(e => {
//             console.log("Error: ", e);
//         });
// }


// likes.js

$(document).ready(function () {
    $('.post-like-container').on('click', function () {
        const postId = $(this).data('post-id');
        const postUsername = $(this).data('post-username');
        var audio = new Audio('static/audio/success.mp3');

        $.ajax({
            url: '/like',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ postId: postId, postUsername: postUsername }),
            success: function (response) {
                if (response.like_success) {
                    const likeIcon = $(`#like_${postId}`);
                    likeIcon.toggleClass('bi-heart bi-heart-fill');
                    // console.log(document.getElementById(`like_${postId}`).classList);
                    if(document.getElementById(`like_${postId}`).classList.contains('bi-heart-fill')){
                        audio.play();
                    }
                    setTimeout(() => window.location.reload(),1000);
                } else {
                    toastr.error('Failed to like the post. Please try again.');
                    setTimeout(() => window.location.reload(),1000);
                }
            },
            error: function () {
                toastr.error('An error occurred. Please try again.');
            }
        });
    });
});
