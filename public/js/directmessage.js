$(document).ready(function() {
    var myuserId = $('.my_profile').data('profile-id');
    var userId;

    var socket = io('/too-gether', {
        auth: {
            token: myuserId
        }
    });


    socket.on('getOnlineUser', function(data) {
        var userElement = $('#' + data.user_id + '-status');
        userElement.removeClass('offline-status').addClass('online-status');
    });

    socket.on('getOfflineUser', function(data) {
        var userElement = $('#' + data.user_id + '-status');
        userElement.removeClass('online-status').addClass('offline-status');
    });

    $('.userList').click(function() {
        userId = $(this).data('post-id');
        $('.initial').hide();
        $('.chatBody').show();
        $.ajax({
            url:'/getName',
            method: 'POST',
            contentType: 'application/json',
            data:JSON.stringify({userId:userId}),
            success:function(data){
                if(data.success){
                    let namehtm = `<img src="../static/img/${data.chatName.dp_image}" class="ms-2 me-1 mt-1" height="30px" width="30px" style="border-radius: 50%;">
                                       <h3>${data.chatName.name}</h3>`;
                        $('.chatName').html(namehtm);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        })
        socket.emit('existChat',{ sender_id: myuserId, receiver_id:userId })
    });

    $('.chat-form').submit(function(event) {
        event.preventDefault();
        var message = $('.message').val();

        $.ajax({
            url: '/savechat',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                sender_id: myuserId,
                receiver_id: userId,
                message: message
            }),
            success: function(response) {
                if (response.success) {
                    $('.message').val("");
                    let chat = response.data.message;
                    let chatTime = new Date(response.data.lastModified).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    let html = `
                    <div class="current-user-chat">
                        ${chat}
                        <div class="chat-time">${chatTime}</div>
                    </div>`;
                    $('.chatsBody').append(html);

                    socket.emit('newChat',response.data)
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    });
    

    socket.on('loadNewChat',function(data){
        if(myuserId === data.receiver_id && userId === data.sender_id){
            let chatTime = new Date(data.lastModified).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            let html = `
            <div class="distance-user-chat">
                ${data.message}
                <div class="chat-time">${chatTime}</div>
            </div>`;
            $('.chatsBody').append(html);
            scrollToBottom();
        }
    });

    //load old chats

    socket.on('loadChats', function(data) {
        $('.chatsBody').html('');
        var chats = data.chats;
        let html = '';
        for (let i = 0; i < chats.length; i++) {
            let addClass = '';
            if (chats[i]['sender_id'] == myuserId) addClass = 'current-user-chat';
            else addClass = 'distance-user-chat';
    
            let time = new Date(chats[i]['lastModified']).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
            html += `<div class="${addClass}">
                ${chats[i]['message']}
                <div class="chat-time">${time}</div>
            </div>`;
        }
        $('.chatsBody').append(html);
        scrollToBottom();
    });  
    function scrollToBottom() {
        $('.chatsBody').scrollTop($('.chatsBody')[0].scrollHeight);
    }  
});
