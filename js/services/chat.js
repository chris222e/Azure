/**
 * 💬 Servicio de Chat Phi-4
 */

const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Aquí van tus credenciales (mejor en backend)
const PHI4_CONFIG = {
  endpoint: '', // Tu endpoint de Azure
  key: '' // Tu API key
};

function addMessage(text, sender = 'bot') {
  const div = document.createElement('div');
  div.classList.add('message', sender);
  div.innerHTML = `<span>${escapeHtml(text)}</span>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // Mostrar mensaje del usuario
  addMessage(message, 'user');
  userInput.value = '';
  sendBtn.disabled = true;

  // Mostrar indicador de carga
  const loadingMsg = addMessage('Escribiendo...', 'loading');

  try {
    // Validar credenciales
    if (!PHI4_CONFIG.endpoint || !PHI4_CONFIG.key) {
      loadingMsg.remove();
      addMessage('❌ Error: Configura tus credenciales de Phi-4 en el archivo config', 'bot');
      return;
    }

    // Aquí iría la llamada a la API de Phi-4
    // Por ahora, mostramos un mensaje de ejemplo
    loadingMsg.remove();
    addMessage('Respuesta de demostración. Configura tus credenciales para usar el servicio real.', 'bot');

  } catch (error) {
    loadingMsg.remove();
    addMessage(`❌ Error: ${error.message}`, 'bot');
  } finally {
    sendBtn.disabled = false;
    userInput.focus();
  }
}

function handleKeyPress(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}