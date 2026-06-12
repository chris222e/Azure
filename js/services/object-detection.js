/**
 * 🔍 Servicio de Detección de Objetos
 */

const COLORS = ['#4a90e2', '#e25c4a', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e74c3c'];

const VISION_CONFIG = {
  key: '', // Tu API key de Vision
  endpoint: '' // Tu endpoint de Vision
};

function drawCanvas(imgEl, objects) {
  const canvas = document.getElementById('overlay');
  const ctx = canvas.getContext('2d');

  canvas.width = imgEl.naturalWidth;
  canvas.height = imgEl.naturalHeight;

  objects.forEach((obj, idx) => {
    const color = COLORS[idx % COLORS.length];
    const { x, y, w, h } = obj.rectangle;

    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(2, canvas.width * 0.003);
    ctx.strokeRect(x, y, w, h);

    const label = `${obj.object} ${(obj.confidence * 100).toFixed(0)}%`;
    const fontSize = Math.max(12, canvas.width * 0.018);
    ctx.font = `bold ${fontSize}px Arial`;

    const textW = ctx.measureText(label).width;
    const padding = 6;

    ctx.fillStyle = color;
    ctx.fillRect(x, y - fontSize - padding * 2, textW + padding * 2, fontSize + padding * 2);

    ctx.fillStyle = '#fff';
    ctx.fillText(label, x + padding, y - padding);
  });
}

async function detectObjects() {
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
  setStatus('statusBar', 'running', 'Detectando objetos...', true);

  try {
    if (!VISION_CONFIG.endpoint || !VISION_CONFIG.key) {
      setStatus('statusBar', 'error', 'Configura tus credenciales de Vision');
      return;
    }

    const url = `${VISION_CONFIG.endpoint}/vision/v3.2/analyze?visualFeatures=Objects`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': VISION_CONFIG.key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: imageUrl })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const objects = data.objects;

    if (!objects || objects.length === 0) {
      setStatus('statusBar', 'success', '✓ No se detectaron objetos en la imagen');
      analyzeBtn.disabled = false;
      return;
    }

    // Mostrar imagen y dibujar canvas
    const img = document.getElementById('previewImg');
    img.src = imageUrl;
    img.onload = () => drawCanvas(img, objects);

    // Lista de objetos
    const list = document.getElementById('objectList');
    list.innerHTML = '';

    objects.forEach((obj, idx) => {
      const color = COLORS[idx % COLORS.length];
      const confianza = (obj.confidence * 100).toFixed(2);
      const { x, y, w, h } = obj.rectangle;

      const item = document.createElement('div');
      item.className = 'object-item';
      item.innerHTML = `
        <div class="object-header">
          <div class="object-dot" style="background:${color}"></div>
          <span class="object-name">${obj.object}</span>
          <span class="object-confidence">${confianza}%</span>
        </div>
        <div class="object-coords">
          <span><i class="ph ph-map-pin"></i> Inicio: ${x}px, ${y}px</span>
          <span><i class="ph ph-ruler"></i> Tamaño: ${w} × ${h} px</span>
        </div>
      `;
      list.appendChild(item);
    });

    showResults('resultSection');
    setStatus('statusBar', 'success', `✓ ${objects.length} objeto${objects.length > 1 ? 's' : ''} detectado${objects.length > 1 ? 's' : ''}`);

  } catch (error) {
    setStatus('statusBar', 'error', `Error: ${error.message}`);
  } finally {
    analyzeBtn.disabled = false;
  }
}
