// Clave API del chatbot
const API_KEY = 'AIzaSyA8nxYLp4xGRdTsFS7bHzpyleVNpWb0C8M'; 
// URL del endpoint de la API, para generar contenido con Gemini
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
 
// Elemento donde se mostrarán los mensajes del chat, tanto del usuario como del bot
const chatMessages = document.getElementById('chat-messages');
// Entrada de texto donde el usuario escribe el mensaje que quiere enviar al bot
const userInput = document.getElementById('user-input');
// Botón para enviar el mensaje del usuario al chatbot
const sendButton = document.getElementById('send-button');
 
// Función para generar la respuesta del bot
async function generateResponseFromBot(prompt) {
    // Modifica el mensaje enviado por el usuario añadiendo el contexto de este caso en específico
    const modifiedPrompt = `${prompt}, referente al entrenamiento de IA, explicado para gente que no sepa del tema, límite 60 palabras.`;
 
    try {
        // Envía una solicitud a la API con el mensaje
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST', // Método HTTP POST
            headers: { 'Content-Type': 'application/json' }, // Cabecera indicando que el contenido es JSON
            body: JSON.stringify({
                contents: [{ parts: [{ text: modifiedPrompt }] }] // Cuerpo de la solicitud
            })
        });
 
        // Verifica que la respuesta de la API fue existosa
        if (!response.ok) {
            throw new Error('Failed to generate response'); // Si no, lanza error
        }
 
        const data = await response.json(); // Convierte la respuesta en formato JSON

        // Devuelve el texto de la respuesta generada por la API
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        // Si detecta un error, se lanza una excepción y se imprime en pantalla
        console.error('Error:', error);
        throw new Error('Unable to fetch response from the API.');
    }
}
 
// Función para añadir un mensaje al chat de manera gráfica, tanto por parte de usuario como bot
function appendMessage(message, isUser) {
    const messageElement = document.createElement('div'); // Crea un contenedor para el mensaje
    messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message'); // Se filtra el tipo de mensaje, si es de usuario o de bot
 
    const profileImage = document.createElement('img'); // Crea una imagen de perfil para el mensaje
    profileImage.className = 'profile-image'; // Clase para la imagen de perfil
    profileImage.src = isUser ? 'user.png' : 'bot.png'; // Se asigna la imagen en función de si el emisor es el usuario o el bot
    profileImage.alt = isUser ? 'User' : 'Bot'; // Se asigna el texto del mensaje
 
    const messageContent = document.createElement('div'); // Crea un div para el contenido del mesnaje
    messageContent.className = 'message-content'; // Clase para el contenido del mensaje
    messageContent.textContent = message; // Se asigna el texto del mensaje
 
    messageElement.append(profileImage, messageContent); // Se añade la foto de perfil y el contenido del mensaje al contenedor del mensaje
    chatMessages.appendChild(messageElement); // Añade el mensaje al chat
    chatMessages.scrollTop = chatMessages.scrollHeight; // Hace scroll hasta el mensaje más reciente para mostrarlo
}
 
// Función para manejar la entrada del usuario
async function handleUserInput() {
    const userMessage = userInput.value.trim(); // Obtiene el mensaje ingresado por el usuario y elimina los espacios en blanco
 
    if (!userMessage) return; // Si no hay nada, se sale de la función
 
    appendMessage(userMessage, true); // Se añade el mensaje del usuario al chat
    userInput.value = ''; // Se vacía el contenido del input de texto
 
    // Se invoca a la función para deshabilitar la funcionalidad del input de texto y el botón de envío
    toggleInputState(true);
 
    try {
        // Se llama a la API esperando a recibir respuesta por el bot
        const botMessage = await generateResponseFromBot(userMessage);
        appendMessage(botMessage, false); // Añade la respuesta del bot al chat
    } catch {
        // Si ocurre error, se muestra el texto del mismo
        appendMessage('Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.', false);
    } finally {
        // Se invoca a la función para rehabilitar la funcionalidad de la interfaz
        toggleInputState(false); 
        userInput.focus(); // Coloca el cursor en el input de texto para que el usuario pueda seguir mandando mensajes
    }
}
 
// Función para manejar la disponibilidad de los elementos de interfaz en función del parámetro
function toggleInputState(isDisabled) {
    sendButton.disabled = isDisabled; // Activa o desactiva el botón de enviar
    userInput.disabled = isDisabled; // Activa o desactiva el campo de entrada
}
 
// Evento para llamar a la función de manejo de input del usuario al pulsar el botón de envío
sendButton.addEventListener('click', handleUserInput);

// Evento para llamar a la función de manejo de input del usuario al pulsar Enter en el teclado
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
});