$(document).ready(function () {
    // Function to open the comment modal and load comments
    $('i.bi-chat-dots, a[data-target=".comments"]').on('click', function () {
        const postId = $(this).closest('[data-post-id]').data('post-id');
        const postImageSrc = $(this).closest('[data-post-image]').data('post-image');
        const postUsername = $(this).closest('[data-post-username]').data('post-username');

        // Update modal with post details
        $('.post-image').attr('src', postImageSrc);
        $('.post-username').text(postUsername);

        // Update the post ID in the comment button
        $('.comment-model-button').data('post-id', postId);

        // Clear previous comments
        $('.comments-list').empty();

        // Load comments from the server
        $.ajax({
            url: `/get-comments/${postId}`,
            type: 'GET',
            success: function (response) {
                if (response.success) {
                    response.comments.forEach(comment => {
                        const commentHtml = `
                            <div class="d-flex align-items-center mb-2">
                                <img src="../static/img/${comment.dp}" height="25px" width="25px" style="border-radius: 50%;" class="me-2">
                                <b>${comment.username}</b>
                                <span class="ms-2">${comment.text}</span>
                            </div>`;
                        $('.comments-list').append(commentHtml);
                    });
                } else {
                    toastr.error('Failed to load comments.');
                }
            },
            error: function () {
                toastr.error('An error occurred while loading comments.');
            }
        });

        // Show the modal
        $('.comments').modal('show');
    });

    // Function to post a new comment
    $('.comment-model-button').on('click', function () {
        const postId = $(this).data('post-id');
        const commentText = $('.comment-model-input').val();

        if (commentText) {
            $.ajax({
                url: '/comment',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    postId: postId,
                    commentText: commentText
                }),
                success: function (response) {
                    if (response.success) {
                        const commentHtml = `
                            <div class="d-flex align-items-center mb-2">
                                <img src="../static/img/initial_profile_image.png" height="25px" width="25px" style="border-radius: 50%;" class="me-2">
                                <b>${response.username}</b>
                                <span class="ms-2">${commentText}</span>
                            </div>`;
                        $('.comments-list').append(commentHtml);
                        $('.comment-model-input').val(''); // Clear input
                        toastr.success('Comment added successfully!');
                    } else {
                        toastr.error('Failed to add comment.');
                    }
                },
                error: function () {
                    toastr.error('An error occurred while adding the comment.');
                }
            });
        } else {
            toastr.warning('Comment text cannot be empty.');
        }
    });
});
