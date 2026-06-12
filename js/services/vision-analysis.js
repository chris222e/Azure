/**
 * 🖼️ Servicio de Análisis de Imágenes
 */

const VISION_CONFIG = {
  key: '', // Tu API key de Vision
  endpoint: '' // Tu endpoint de Vision
};

async function analyzeImage() {
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
  setStatus('statusBar', 'running', 'Analizando imagen...', true);

  try {
    if (!VISION_CONFIG.endpoint || !VISION_CONFIG.key) {
      setStatus('statusBar', 'error', 'Configura tus credenciales de Vision');
      return;
    }

    const url = `${VISION_CONFIG.endpoint}/vision/v3.2/analyze?visualFeatures=Categories,Description,Color`;

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

    const data = await response.json();
    const confianza = (data.description.captions[0].confidence * 100).toFixed(2);
    const descripcion = data.description.captions[0].text;
    const etiquetas = data.description.tags;
    const colorDominante = data.color.dominantColors[0] || 'N/A';

    document.getElementById('previewImg').src = imageUrl;
    document.getElementById('descripcion').textContent = descripcion;
    document.getElementById('confianza').textContent = `${confianza}%`;
    document.getElementById('color').textContent = colorDominante;

    const tagsContainer = document.getElementById('etiquetas');
    tagsContainer.innerHTML = '';
    etiquetas.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });

    showResults('resultSection');
    setStatus('statusBar', 'success', '✓ Análisis completado');

  } catch (error) {
    setStatus('statusBar', 'error', `Error: ${error.message}`);
  } finally {
    analyzeBtn.disabled = false;
  }
}
