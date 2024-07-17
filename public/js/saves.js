$(document).ready(function () {
    $('.post-save-container').on('click', function () {
        const postId = $(this).data('post-id');
        console.log(postId);
        const isSaved = $(this).find('i').hasClass('bi-bookmark-fill');
        console.log(isSaved);
        const url = isSaved ? '/unsave' : '/save';
        console.log(url);


        $.ajax({
            url: url,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ postId: postId }),
            success: function (response) {
                if (response.save_success) {
                    const saveIcon = $(`#save_${postId}`);
                    saveIcon.toggleClass('bi-bookmark bi-bookmark-fill');
                    toastr.success(isSaved ? 'Post unsaved successfully!' : 'Post saved successfully!');
                } else {
                    toastr.error('Failed to save the post. Please try again.');
                }
            },
            error: function () {
                toastr.error('An error occurred. Please try again.');
            }
        });
    });
});
