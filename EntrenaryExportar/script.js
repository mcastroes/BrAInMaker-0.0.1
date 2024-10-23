const API_KEY = 'AIzaSyA8nxYLp4xGRdTsFS7bHzpyleVNpWb0C8M'; 
 
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
 
const chatMessages = document.getElementById('chat-messages');
 
const userInput = document.getElementById('user-input');
 
const sendButton = document.getElementById('send-button');
 
async function generateResponseFromBot(prompt) {
    const modifiedPrompt = `${prompt}, referente al entrenamiento de IA, explicado para gente que no sepa del tema, límite 100 palabras.`;
 
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: modifiedPrompt }] }]
            })
        });
 
        if (!response.ok) {
            throw new Error('Failed to generate response');
        }
 
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Unable to fetch response from the API.');
    }
}
 
function appendMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');
 
    const profileImage = document.createElement('img');
    profileImage.className = 'profile-image';
    profileImage.src = isUser ? 'user.png' : 'bot.png';
    profileImage.alt = isUser ? 'User' : 'Bot';
 
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = message;
 
    messageElement.append(profileImage, messageContent);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
 
async function handleUserInput() {
    const userMessage = userInput.value.trim();
 
    if (!userMessage) return; 
 
    appendMessage(userMessage, true);
    userInput.value = '';
 
    toggleInputState(true); 
 
    try {
        const botMessage = await generateResponseFromBot(userMessage);
        appendMessage(botMessage, false);
    } catch {
        appendMessage('Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.', false);
    } finally {
        toggleInputState(false); 
        userInput.focus();
    }
}
 
function toggleInputState(isDisabled) {
    sendButton.disabled = isDisabled;
    userInput.disabled = isDisabled;
}
 
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
});