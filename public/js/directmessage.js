$(document).ready(function() {
    var myuserId = $('.my_profile').data('profile-id');
    var socket = io('/too-gether', {
        auth: {
            token: myuserId
        }
    });

    socket.on('getOnlineUser', function(data) {
        console.log("Received online user data:", data);
        var userElement = $('#' + data.user_id + '-status');
        console.log("Element to update:", userElement);
        userElement.removeClass('offline-status').addClass('online-status');
    });

    socket.on('getOfflineUser', function(data) {
        console.log("Received offline user data:", data);
        var userElement = $('#' + data.user_id + '-status');
        console.log("Element to update:", userElement);
        userElement.removeClass('online-status').addClass('offline-status');
    });

    $('.userList').click(function() {
        var userId = $(this).data('post-id');
        $('.initial').hide();
        $('.chatBody').show();
    });
});
