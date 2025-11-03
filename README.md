# 🚀 Sistema de Automatización de Contenido Viral

Sistema completo para automatizar la creación de contenido viral basado en tendencias de Google Trends, usando AI (Gemini), generación de audio (ElevenLabs) y publicación en redes sociales.

## 📋 Características

- ✅ Monitoreo automático de Google Trends cada 2 horas
- ✅ Generación de scripts con Google Gemini AI
- ✅ Dashboard web para gestión de contenido
- ✅ Sistema de análisis de calidad y potencial viral
- ✅ Gestión de contenido con aprobación/rechazo
- ✅ Arquitectura escalable con Firebase Functions

## 🏗️ Arquitectura

```
┌─────────────────┐
│  Google Trends  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cloud Functions │
│  (monitorTrends)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Firestore    │
│ (trending_topics)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cloud Functions │
│ (generateScript)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Web App       │
│  (Dashboard)    │
└─────────────────┘
```

## 🚀 Inicio Rápido

### 1. Configuración Inicial

Sigue la guía completa en [`SETUP_GUIDE.md`](./SETUP_GUIDE.md) para:
- Configurar Firebase
- Obtener API keys
- Desplegar el sistema

### 2. Instalación Local

```bash
# Instalar dependencias del backend
cd functions
npm install

# Instalar dependencias de la web app
cd ../web-app
npm install
```

### 3. Configurar Variables de Entorno

```bash
# En Firebase Functions
firebase functions:config:set gemini.api_key="TU_API_KEY"

# En la web app (crear .env.local)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# ... (ver SETUP_GUIDE.md para más detalles)
```

### 4. Desarrollo Local

```bash
# Backend (Functions)
cd functions
npm run serve

# Frontend (Web App)
cd web-app
npm run dev
```

### 5. Despliegue

```bash
# Desplegar Functions
npm run deploy:functions

# Desplegar Web App a Vercel
# (ver SETUP_GUIDE.md para instrucciones detalladas)
```

## 📁 Estructura del Proyecto

```
.
├── functions/                 # Cloud Functions (Backend)
│   ├── src/
│   │   ├── services/         # Servicios (Trends, Gemini, etc.)
│   │   ├── schedulers/       # Funciones programadas
│   │   ├── processors/       # Procesadores de contenido
│   │   └── index.ts
│   └── package.json
│
├── web-app/                   # Next.js App (Frontend)
│   ├── app/                  # App Router
│   ├── components/           # Componentes React
│   ├── lib/                  # Utilidades y Firebase
│   └── package.json
│
├── firestore.rules           # Reglas de seguridad
├── storage.rules             # Reglas de Storage
└── SETUP_GUIDE.md            # Guía completa de setup
```

## 🔑 API Keys Necesarias

- **Google Gemini**: [AI Studio](https://makersuite.google.com/app/apikey)
- **ElevenLabs**: [ElevenLabs](https://elevenlabs.io/) (para audio)
- **Firebase**: Se configura automáticamente

## 📊 Dashboard Web

Accede al dashboard para:
- Ver tendencias detectadas
- Revisar y aprobar scripts generados
- Ver análisis de calidad
- Monitorear estado del sistema

## 🔄 Flujo del Sistema

1. **Monitoreo** (cada 2h): Cloud Function detecta tendencias
2. **Generación**: Se genera script con Gemini AI
3. **Análisis**: Se analiza calidad y potencial viral
4. **Revisión**: Dashboard para aprobar/rechazar
5. **Publicación**: (Próximamente) Publicación automática

## 🛠️ Próximas Características

- [ ] Generación de audio con ElevenLabs
- [ ] Generación de video (cuando Sora/Veo estén disponibles)
- [ ] Publicación automática en redes sociales
- [ ] Sistema de aprendizaje automático
- [ ] Analytics avanzado
- [ ] Rate limiting y gestión de cuotas

## 📝 Licencia

MIT

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para ayuda, consulta [`SETUP_GUIDE.md`](./SETUP_GUIDE.md) o abre un issue.

---

¡Construido con ❤️ usando Firebase, Next.js y AI!

