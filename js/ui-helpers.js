/**
 * 🎨 Funciones auxiliares para UI
 */

/**
 * Mostrar estado (success, error, running, warning)
 */
function setStatus(elementId, type, message, showSpinner = false) {
  const bar = document.getElementById(elementId);
  if (!bar) return;

  bar.className = `status-bar ${type}`;
  bar.classList.remove('hidden');

  const iconEl = bar.querySelector('.status-icon');
  const msgEl = bar.querySelector('.status-msg');

  if (iconEl) {
    if (showSpinner) {
      iconEl.innerHTML = '<div class="spinner"></div>';
    } else {
      const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        running: '⟳'
      };
      iconEl.textContent = icons[type] || '';
    }
  }

  if (msgEl) msgEl.textContent = message;
}

/**
 * Ocultar elemento de estado
 */
function hideStatus(elementId) {
  const bar = document.getElementById(elementId);
  if (bar) bar.classList.add('hidden');
}

/**
 * Mostrar sección de resultados
 */
function showResults(elementId) {
  const section = document.getElementById(elementId);
  if (section) section.classList.remove('hidden');
}

/**
 * Ocultar sección de resultados
 */
function hideResults(elementId) {
  const section = document.getElementById(elementId);
  if (section) section.classList.add('hidden');
}

/**
 * Escapar caracteres HTML
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Copiar texto al portapapeles
 */
async function copyToClipboard(text, buttonElement = null) {
  try {
    await navigator.clipboard.writeText(text);
    if (buttonElement) {
      const originalText = buttonElement.textContent;
      buttonElement.textContent = '✓ Copiado';
      setTimeout(() => {
        buttonElement.textContent = originalText;
      }, 1500);
    }
    return true;
  } catch (error) {
    console.error('Error al copiar:', error);
    return false;
  }
}

/**
 * Formatear número de confianza como porcentaje
 */
function formatConfidence(value) {
  return `${(value * 100).toFixed(2)}%`;
}

/**
 * Validar URL
 */
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Mostrar notificación (si disponible SweetAlert2)
 */
function showNotification(type, title, message) {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      icon: type,
      title: title,
      text: message,
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'Entendido'
    });
  } else {
    alert(`${title}: ${message}`);
  }
}

export {
  setStatus,
  hideStatus,
  showResults,
  hideResults,
  escapeHtml,
  copyToClipboard,
  formatConfidence,
  isValidUrl,
  showNotification
};