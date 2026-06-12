# 🚀 Azure AI Services Dashboard

Aplicación web moderna e integrada que combina múltiples servicios de **Azure AI** para visión computacional, procesamiento de lenguaje natural y asistentes conversacionales.

## 📋 Contenido

- [Características](#características)
- [Servicios Disponibles](#servicios-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Tecnologías](#tecnologías)

## ✨ Características

✅ **Interfaz moderna** - Diseño oscuro responsive y profesional
✅ **Código limpio** - Estructura organizada y mantenible
✅ **Sin duplicados** - Archivos únicos y bien nombrados
✅ **Fácil configuración** - Variables de entorno centralizadas
✅ **Documentado** - Comentarios y ejemplos en el código

## 🤖 Servicios Disponibles

### 👁️ Visión (Vision API)

- **OCR** - Extrae texto de imágenes con reconocimiento óptico
- **Análisis de Imágenes** - Obtén descripciones y análisis visual
- **Detección de Objetos** - Identifica y localiza objetos en imágenes

### 📝 Lenguaje (Language API)

- **Extracción de Entidades** - Extrae información estructurada (personas, lugares, fechas, etc.)

### 🤖 IA (OpenAI & Phi-4)

- **Chat Phi-4** - Asistente conversacional basado en Phi-4
- **Chat GPT** - Asistente avanzado con capacidades GPT-4

## 📁 Estructura del Proyecto

```
Azure/
├── 📁 config/
│   └── azure.js           # Configuración centralizada de Azure
├── 📁 css/
│   ├── styles.css         # Estilos globales
│   ├── chat.css          # Estilos para chat
│   └── vision.css        # Estilos para servicios de visión
├── 📁 js/
│   ├── api-client.js     # Cliente HTTP para Azure
│   ├── ui-helpers.js     # Funciones auxiliares de UI
│   └── 📁 services/
│       ├── chat.js       # Lógica de chat
│       ├── ocr.js        # Lógica de OCR
│       ├── vision-analysis.js
│       ├── object-detection.js
│       ├── entity-extraction.js
│       └── chat-gpt.js
├── 📁 public/
│   ├── index.html        # Dashboard principal
│   ├── chat.html
│   ├── ocr.html
│   ├── vision-analysis.html
│   ├── object-detection.html
│   ├── entity-extraction.html
│   └── chat-gpt.html
├── .env.example          # Plantilla de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/chris222e/Azure.git
cd Azure

# Instalar dependencias (opcional para servidor)
npm install
```

## ⚙️ Configuración

### 1. Crear archivo `.env`

Copia el contenido de `.env.example` a un nuevo archivo `.env`:

```bash
cp .env.example .env
```

### 2. Agregar tus credenciales de Azure

Edita el archivo `.env` y reemplaza los valores:

```env
# Vision API (OCR, Detección de objetos, Análisis de imágenes)
AZURE_VISION_KEY=tu_api_key_vision
AZURE_VISION_ENDPOINT=https://tu-region.api.cognitive.microsoft.com

# Language API (Extracción de entidades)
AZURE_LANGUAGE_KEY=tu_api_key_language
AZURE_LANGUAGE_ENDPOINT=https://tu-region.api.cognitive.microsoft.com

# OpenAI API (Chat GPT)
AZURE_OPENAI_KEY=tu_api_key_openai
AZURE_OPENAI_ENDPOINT=https://tu-openai.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=nombre_deployment
AZURE_OPENAI_VERSION=2025-04-01-preview
```

### 3. Actualizar configuración en los servicios

En cada archivo de servicio (`js/services/*.js`), reemplaza los valores de credenciales con los del `.env`.

## 🚀 Uso

### Opción 1: Servidor Node.js

```bash
npm start
# El servidor estará disponible en http://localhost:3000
```

### Opción 2: Servidor local con Python

```bash
python -m http.server 8000
# Accede a http://localhost:8000/public/index.html
```

### Opción 3: VS Code Live Server

Usa la extensión "Live Server" en VS Code para servir los archivos.

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Backend**: Node.js + Express (opcional)
- **APIs**: Azure Vision, Azure Language, Azure OpenAI
- **Diseño**: Sistema de diseño personalizado con variables CSS
- **Iconos**: Phosphor Icons

## 📚 Ejemplos de Uso

### OCR

```html
<input type="url" id="imageUrl" placeholder="URL de la imagen">
<button onclick="analyzeOCR()">Analizar</button>
```

### Chat

```html
<input type="text" id="userInput" placeholder="Tu pregunta">
<button onclick="sendMessage()">Enviar</button>
```

## 🔒 Seguridad

⚠️ **IMPORTANTE**: 
- Nunca expongas tus claves de API en el frontend en producción
- Usa un backend seguro para procesar las solicitudes a Azure
- El archivo `.env` está en `.gitignore` para proteger tus credenciales

## 📞 Soporte

Para más información sobre los servicios de Azure, consulta la [documentación oficial](https://learn.microsoft.com/es-es/azure/ai-services/).

## 👨‍💻 Autor

Christian Espinoza

## 📄 Licencia

ISC
