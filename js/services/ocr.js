/**
 * 📖 Servicio de OCR
 */

const VISION_CONFIG = {
  key: '', // Tu API key de Vision
  endpoint: '' // Tu endpoint de Vision
};

async function analyzeOCR() {
  const imageUrl = document.getElementById('imageUrl').value.trim();
  const analyzeBtn = document.getElementById('analyzeBtn');
  const resultSection = document.getElementById('resultSection');

  if (!imageUrl) {
    setStatus('statusBar', 'error', 'Ingresa la URL de una imagen');
    return;
  }

  if (!isValidUrl(imageUrl)) {
    setStatus('statusBar', 'error', 'La URL no es válida');
    return;
  }

  analyzeBtn.disabled = true;
  hideResults('resultSection');
  setStatus('statusBar', 'running', 'Enviando imagen a Azure...', true);

  try {
    // Validar credenciales
    if (!VISION_CONFIG.endpoint || !VISION_CONFIG.key) {
      setStatus('statusBar', 'error', 'Configura tus credenciales de Vision');
      return;
    }

    const url = `${VISION_CONFIG.endpoint}/vision/v3.2/read/analyze`;

    // Paso 1: Enviar imagen
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': VISION_CONFIG.key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: imageUrl })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const operationLocation = response.headers.get('operation-location');
    if (!operationLocation) throw new Error('No operation location returned');

    setStatus('statusBar', 'running', 'Procesando... esperando resultados', true);

    // Paso 2: Polling hasta que se complete
    let result = null;
    for (let attempt = 0; attempt < 30; attempt++) {
      await new Promise(r => setTimeout(r, 1000));

      const checkResponse = await fetch(operationLocation, {
        headers: { 'Ocp-Apim-Subscription-Key': VISION_CONFIG.key }
      });

      result = await checkResponse.json();

      if (result.status === 'succeeded') break;
      if (result.status === 'failed') throw new Error('Azure no pudo procesar la imagen');
    }

    // Paso 3: Mostrar resultados
    const pages = result.analyzeResult.readResults;
    const container = document.getElementById('pagesContainer');
    container.innerHTML = '';

    pages.forEach((page, idx) => {
      const text = page.lines.map(l => l.text).join('\n');
      const pageDiv = document.createElement('div');
      pageDiv.style.marginBottom = idx < pages.length - 1 ? '20px' : '0';
      pageDiv.innerHTML = `
        <div class="meta-row">
          <span class="meta-label">Texto detectado</span>
          <div style="display:flex;align-items:center;gap:10px;">
            ${pages.length > 1 ? `<span class="page-badge">Página ${idx + 1}</span>` : ''}
            <button class="copy-btn" onclick="copyText(this, ${idx})">📋 Copiar</button>
          </div>
        </div>
        <div class="result-box" id="result-${idx}">${escapeHtml(text)}</div>
      `;
      container.appendChild(pageDiv);
    });

    document.getElementById('previewImg').src = imageUrl;
    showResults('resultSection');
    const totalLines = pages.reduce((s, p) => s + p.lines.length, 0);
    setStatus('statusBar', 'success', `✓ Listo — ${totalLines} líneas detectadas`);

  } catch (error) {
    setStatus('statusBar', 'error', `Error: ${error.message}`);
  } finally {
    analyzeBtn.disabled = false;
  }
}

function copyText(btn, idx) {
  const text = document.getElementById(`result-${idx}`).textContent;
  copyToClipboard(text, btn);
}
