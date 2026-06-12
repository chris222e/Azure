/**
 * 🏷️ Servicio de Extracción de Entidades
 */

const LANGUAGE_CONFIG = {
  key: '', // Tu API key de Language
  endpoint: '' // Tu endpoint de Language
};

const boton = document.getElementById('btnAnalizar');
boton.addEventListener('click', analyzeText);

async function analyzeText() {
  const texto = document.getElementById('textoEntrada').value.trim();
  const tbody = document.getElementById('tbodyResultados');

  tbody.innerHTML = '';

  if (texto === '') {
    showNotification('warning', 'Campo vacío', 'Por favor ingresa un texto antes de analizar');
    return;
  }

  const checks = document.querySelectorAll('.categorias input:checked');
  const categoriasSeleccionadas = [];

  checks.forEach(check => {
    categoriasSeleccionadas.push(check.value);
  });

  if (categoriasSeleccionadas.length === 0) {
    showNotification('warning', 'Sin categorías', 'Selecciona al menos una categoría antes de analizar');
    return;
  }

  try {
    boton.disabled = true;
    boton.innerText = 'Analizando...';
    setStatus('statusBar', 'running', 'Enviando texto a Azure...', true);

    if (!LANGUAGE_CONFIG.endpoint || !LANGUAGE_CONFIG.key) {
      setStatus('statusBar', 'error', 'Configura tus credenciales de Language');
      return;
    }

    const url = `${LANGUAGE_CONFIG.endpoint}/language/:analyze-text?api-version=2022-05-01`;

    const body = {
      kind: 'EntityRecognition',
      analysisInput: {
        documents: [
          {
            id: '1',
            language: 'es',
            text: texto
          }
        ]
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': LANGUAGE_CONFIG.key
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const resultado = await response.json();
    const entidades = resultado.results.documents[0].entities;

    const entidadesFiltradas = entidades.filter(entidad =>
      categoriasSeleccionadas.includes(entidad.category)
    );

    if (entidadesFiltradas.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="3" style="text-align: center; opacity: 0.6;">No se encontraron resultados</td>
        </tr>
      `;
      setStatus('statusBar', 'warning', '⚠ No se encontraron entidades');
      document.getElementById('resultSection').classList.remove('hidden');
      return;
    }

    entidadesFiltradas.forEach(entidad => {
      const confianza = (entidad.confidenceScore * 100).toFixed(1);
      const fila = `
        <tr>
          <td>${escapeHtml(entidad.text)}</td>
          <td>${entidad.category}</td>
          <td>${confianza}%</td>
        </tr>
      `;
      tbody.innerHTML += fila;
    });

    document.getElementById('resultSection').classList.remove('hidden');
    setStatus('statusBar', 'success', `✓ ${entidadesFiltradas.length} entidad${entidadesFiltradas.length > 1 ? 'es' : ''} extraída${entidadesFiltradas.length > 1 ? 's' : ''}`);

  } catch (error) {
    console.error(error);
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="color: #e74c3c;">Error: ${error.message}</td>
      </tr>
    `;
    setStatus('statusBar', 'error', `Error: ${error.message}`);

  } finally {
    boton.disabled = false;
    boton.innerText = 'Analizar';
  }
}
