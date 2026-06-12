/**
 * 🤖 Servicio de Chat GPT
 */

const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const tokensBadge = document.getElementById('tokensBadge');

const GPT_CONFIG = {
  endpoint: '', // Tu endpoint de OpenAI en Azure
  key: '', // Tu API key
  deployment: '', // Nombre del deployment
  version: '2025-04-01-preview'
};

let chatHistory = [];
let totalTokens = 0;

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
    if (!GPT_CONFIG.endpoint || !GPT_CONFIG.key || !GPT_CONFIG.deployment) {
      loadingMsg.remove();
      addMessage('❌ Error: Configura tus credenciales de Azure OpenAI en el archivo config', 'bot');
      return;
    }

    const url = `${GPT_CONFIG.endpoint}/openai/deployments/${GPT_CONFIG.deployment}/chat/completions?api-version=${GPT_CONFIG.version}`;

    const body = {
      messages: [
        { role: 'system', content: 'Eres un asistente útil e inteligente' },
        ...chatHistory,
        { role: 'user', content: message }
      ],
      max_completion_tokens: 800,
      temperature: 0.7
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': GPT_CONFIG.key
      },
      body: JSON.stringify(body)
    });

    loadingMsg.remove();

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const respuesta = data.choices[0].message.content;

    // Actualizar historial
    chatHistory.push({ role: 'user', content: message });
    chatHistory.push({ role: 'assistant', content: respuesta });

    // Actualizar tokens
    if (data.usage) {
      totalTokens += data.usage.total_tokens;
      tokensBadge.textContent = `Tokens: ${totalTokens}`;
    }

    addMessage(respuesta, 'bot');

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
