document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.querySelector('.message-input');
    const sendButton = document.querySelector('.send-button');
    const chatMessages = document.querySelector('.chat-messages');

    // Function to add a new message
    function addMessage(text, isSent = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Send message when clicking the send button
    sendButton.addEventListener('click', function() {
        const message = messageInput.value.trim();
        if (message) {
            addMessage(message, true);
            messageInput.value = '';
            
            // Simulate a reply after 1 second
            setTimeout(() => {
                const replies = [
                    "Vâng, tôi hiểu rồi!",
                    "Để tôi suy nghĩ một chút...",
                    "Thật thú vị! Bạn có thể kể thêm không?",
                    "Tôi đang lắng nghe bạn đây!",
                    "Cảm ơn bạn đã chia sẻ!",
                    "Tôi rất vui khi được trò chuyện với bạn!",
                    "Bạn nói rất hay!",
                    "Tôi đồng ý với bạn!",
                    "Để tôi giúp bạn nhé!",
                    "Bạn có cần tôi giải thích thêm không?"
                ];
                const randomReply = replies[Math.floor(Math.random() * replies.length)];
                addMessage(randomReply, false);
            }, 1000);
        }
    });

    // Send message when pressing Enter
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
});
