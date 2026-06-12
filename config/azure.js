/**
 * 🔐 Configuración de Azure
 * Aquí van todas las credenciales y endpoints
 * 
 * IMPORTANTE: En producción, estas variables deben venir del backend
 * o usar variables de entorno. NUNCA hagas públicas tus claves.
 */

const AZURE_CONFIG = {
  // Vision API (OCR, Detección de objetos, Análisis de imágenes)
  vision: {
    key: process.env.AZURE_VISION_KEY || '',
    endpoint: process.env.AZURE_VISION_ENDPOINT || '',
    version: 'v3.2'
  },

  // Language API (Extracción de entidades)
  language: {
    key: process.env.AZURE_LANGUAGE_KEY || '',
    endpoint: process.env.AZURE_LANGUAGE_ENDPOINT || '',
    version: '2022-05-01'
  },

  // OpenAI API (Chat GPT)
  openai: {
    key: process.env.AZURE_OPENAI_KEY || '',
    endpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4-turbo',
    version: process.env.AZURE_OPENAI_VERSION || '2025-04-01-preview'
  },

  // Phi-4 (Chat básico)
  phi4: {
    key: process.env.AZURE_PHI4_KEY || '',
    endpoint: process.env.AZURE_PHI4_ENDPOINT || ''
  }
};

// Validar que las claves estén configuradas
function validarConfiguracion() {
  const configs = ['vision', 'language', 'openai'];
  const missingKeys = [];

  configs.forEach(service => {
    if (!AZURE_CONFIG[service].key || !AZURE_CONFIG[service].endpoint) {
      missingKeys.push(service);
    }
  });

  if (missingKeys.length > 0) {
    console.warn(`⚠️ Servicios sin configurar: ${missingKeys.join(', ')}`);
    console.warn('Configura tu archivo .env con las credenciales de Azure');
  }
}

validarConfiguracion();

export default AZURE_CONFIG;