document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatWindow = document.getElementById('chat-window');

    // Function to append a message to the chat UI
    function appendMessage(sender, text, isUser) {
        const row = document.createElement('div');
        row.classList.add('message-row', isUser ? 'user-row' : 'bot-row');

        if (isUser) {
            row.innerHTML = `
                <span class="sender-name">You</span>
                <div class="bubble user-bubble">${escapeHTML(text)}</div>
            `;
        } else {
            row.innerHTML = `
                <div class="bot-avatar">🤖</div>
                <div class="bubble bot-bubble">${escapeHTML(text)}</div>
            `;
        }

        chatWindow.appendChild(row);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // Function to handle sending a message to the backend
    async function sendMessage() {
        const messageText = chatInput.value.trim();
        
        if (messageText === '') return;

        // 1. Display user message immediately
        appendMessage('You', messageText, true);
        chatInput.value = '';

        // 2. Send the message to the Node.js backend
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: messageText })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // 3. Display the bot's reply from the backend
            appendMessage('DORA', data.reply, false);

        } catch (error) {
            console.error('Error communicating with backend:', error);
            appendMessage('DORA', "Sorry, I am having trouble connecting to the server right now. Please try again later.", false);
        }
    }

    // Utility function to prevent XSS (Cross-Site Scripting)
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag])
        );
    }

    // Event listeners
    sendBtn.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});