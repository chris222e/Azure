/**
 * 🔌 Cliente API para Azure
 * Maneja todas las solicitudes a los servicios de Azure
 */

class AzureClient {
  constructor(config) {
    this.config = config;
  }

  /**
   * Realizar solicitud HTTP genérica
   */
  async request(url, options = {}) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error.error?.message ||
          error.message ||
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Realizar operación asincrónica con polling
   */
  async pollOperation(operationUrl, subscriptionKey, maxAttempts = 30, delayMs = 1000) {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, delayMs));

      const result = await this.request(operationUrl, {
        headers: { 'Ocp-Apim-Subscription-Key': subscriptionKey }
      });

      if (result.status === 'succeeded') return result;
      if (result.status === 'failed') throw new Error('Operation failed');
    }

    throw new Error('Operation timeout');
  }

  /**
   * OCR - Extraer texto de imagen
   */
  async ocr(imageUrl, subscriptionKey, endpoint) {
    const url = `${endpoint}/vision/v3.2/read/analyze`;

    const response = await this.request(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: imageUrl })
    });

    const operationLocation = response.headers?.get('operation-location');
    if (!operationLocation) throw new Error('No operation location returned');

    return await this.pollOperation(operationLocation, subscriptionKey);
  }

  /**
   * Vision - Detectar objetos
   */
  async detectObjects(imageUrl, subscriptionKey, endpoint) {
    const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Objects`;

    return await this.request(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: imageUrl })
    });
  }

  /**
   * Vision - Analizar imagen
   */
  async analyzeImage(imageUrl, subscriptionKey, endpoint) {
    const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Categories,Description,Color`;

    return await this.request(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: imageUrl })
    });
  }

  /**
   * Language - Extraer entidades
   */
  async extractEntities(text, subscriptionKey, endpoint) {
    const url = `${endpoint}/language/:analyze-text?api-version=2022-05-01`;

    return await this.request(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        kind: 'EntityRecognition',
        analysisInput: {
          documents: [{
            id: '1',
            language: 'es',
            text: text
          }]
        }
      })
    });
  }

  /**
   * OpenAI - Chat completions
   */
  async chatCompletion(messages, apiKey, endpoint, deployment, apiVersion) {
    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

    return await this.request(url, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: messages,
        max_completion_tokens: 800,
        temperature: 0.7
      })
    });
  }
}

export default AzureClient;