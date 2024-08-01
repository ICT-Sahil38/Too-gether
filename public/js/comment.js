// comment.js

function addComment(postId, commentText) {
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
                toastr.success('Comment added successfully!');
                setTimeout(() => window.location.reload(),1000);
                // Optionally, update the UI to show the new comment without refreshing the page
            } else {
                toastr.error('Failed to add comment.');
            }
        },
        error: function () {
            toastr.error('An error occurred while adding the comment.');
        }
    });
}

// Attach event listener to the comment button
$(document).ready(function () {
    $('.comment-button').on('click', function () {
        const postId = $(this).data('post-id');
        const commentText = $(this).siblings('.comment-input').val();
        if (commentText) {
            addComment(postId, commentText);
        } else {
            toastr.warning('Comment text cannot be empty.');
        }
    });
});
