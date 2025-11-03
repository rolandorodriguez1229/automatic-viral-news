# ✅ Checklist - Lo que TÚ necesitas hacer

Esta es una lista clara de todas las tareas que **TÚ** necesitas completar para que el sistema funcione.

---

## 🔴 FASE 1: Configuración Básica (OBLIGATORIO)

### 1. Crear Proyecto Firebase
- [ ] Ir a [Firebase Console](https://console.firebase.google.com/)
- [ ] Crear nuevo proyecto
- [ ] Nombre: `viral-automation-system` (o el que prefieras)
- [ ] ✅ Habilitar Google Analytics

### 2. Habilitar Servicios en Firebase
- [ ] **Firestore Database**:
  - Ir a Build → Firestore Database
  - Crear base de datos en modo producción
  - Ubicación: `us-central1` o `us-east1`

- [ ] **Storage**:
  - Ir a Build → Storage
  - Get started → Aceptar reglas por defecto

- [ ] **Authentication**:
  - Ir a Build → Authentication
  - Habilitar provider "Email/Password"

- [ ] **Billing** (CRÍTICO):
  - Settings → Usage and billing
  - Modificar plan → Seleccionar "Blaze (Pay as you go)"
  - Agregar método de pago
  - ⚠️ **Sin esto NO funcionarán las Cloud Functions**

### 3. Instalar Herramientas
- [ ] Instalar Node.js 18+ desde [nodejs.org](https://nodejs.org/)
- [ ] Instalar Firebase CLI:
  ```bash
  npm install -g firebase-tools
  ```
- [ ] Verificar instalación:
  ```bash
  node --version
  firebase --version
  ```

### 4. Login a Firebase
```bash
firebase login
```
- [ ] Abrirá el navegador, autorizar acceso
- [ ] Verificar con: `firebase projects:list`

---

## 🔑 FASE 2: Obtener API Keys

### 1. Google Gemini API Key
- [ ] Ir a [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ ] Click "Create API Key"
- [ ] Seleccionar tu proyecto Firebase
- [ ] **GUARDAR**: `GEMINI_API_KEY = tu-api-key-aqui`

### 2. ElevenLabs API Key (Para más adelante)
- [ ] Crear cuenta en [ElevenLabs](https://elevenlabs.io/)
- [ ] Ir a Profile → API Keys
- [ ] Crear nueva API key
- [ ] **GUARDAR**: `ELEVENLABS_API_KEY = tu-api-key-aqui`
- [ ] **GUARDAR**: `ELEVENLABS_VOICE_ID = id-del-voice` (puedes usar uno predeterminado)

### 3. APIs de Redes Sociales (Para más adelante)
Estas son opcionales por ahora, las configuraremos después:

- [ ] **TikTok**: [TikTok for Developers](https://developers.tiktok.com/)
- [ ] **Instagram**: [Meta for Developers](https://developers.facebook.com/)
- [ ] **YouTube**: [Google Cloud Console](https://console.cloud.google.com/)
- [ ] **Facebook**: [Meta for Developers](https://developers.facebook.com/)

---

## 💻 FASE 3: Configuración Local

### 1. Navegar al Proyecto
```bash
cd "Automatic viral news"
```

### 2. Instalar Dependencias Backend
```bash
cd functions
npm install
cd ..
```

### 3. Instalar Dependencias Web App
```bash
cd web-app
npm install
cd ..
```

### 4. Inicializar Firebase (si no lo has hecho)
```bash
firebase init
```
- [ ] Seleccionar: Firestore, Functions, Storage
- [ ] Usar TypeScript: Yes
- [ ] Usar ESLint: Yes
- [ ] Instalar dependencias: Yes

### 5. Configurar Variables de Entorno - Backend
```bash
firebase functions:config:set \
  gemini.api_key="TU_GEMINI_API_KEY_AQUI" \
  manual.trigger_token="un-token-secreto-cualquiera-123"
```

**Reemplaza `TU_GEMINI_API_KEY_AQUI` con tu API key real**

### 6. Obtener Configuración de Firebase para Web App

1. Ve a Firebase Console → ⚙️ Settings → Project settings
2. Scroll down → "Your apps"
3. Si no hay app web, click "Add app" → Web (</>)
4. Registra el app (puedes poner cualquier nombre)
5. Copia los valores del objeto `firebaseConfig`

### 7. Crear archivo .env.local en web-app

```bash
cd web-app
```

Crear archivo `.env.local` con:

```
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Reemplaza todos los valores con los de tu proyecto Firebase**

---

## 🚀 FASE 4: Compilar y Probar

### 1. Compilar Backend
```bash
cd functions
npm run build
```
- [ ] Verificar que no hay errores

### 2. Probar Localmente (Opcional)
```bash
# En una terminal
cd functions
npm run serve

# En otra terminal
cd web-app
npm run dev
```

### 3. Desplegar Backend
```bash
cd ..
firebase deploy --only functions
```
- [ ] Esperar 5-10 minutos
- [ ] Verificar en Firebase Console → Functions que aparezcan:
  - `monitorTrends`
  - `manualTrendsCheck`
  - `healthCheck`
  - `generateScript`

### 4. Probar Functions
```bash
# Health check
curl https://us-central1-TU-PROJECT-ID.cloudfunctions.net/healthCheck

# Manual trends (reemplaza el token)
curl -X POST \
  -H "Authorization: Bearer un-token-secreto-cualquiera-123" \
  https://us-central1-TU-PROJECT-ID.cloudfunctions.net/manualTrendsCheck
```

- [ ] Verificar que ambas funcionan

---

## 🌐 FASE 5: Desplegar Web App en Vercel

### 1. Crear Cuenta en Vercel
- [ ] Ir a [Vercel](https://vercel.com/)
- [ ] Crear cuenta (puedes usar GitHub)
- [ ] Verificar email

### 2. Subir Código a GitHub (si no lo has hecho)

```bash
# Inicializar Git (si no lo has hecho)
git init

# Crear .gitignore si no existe (ya debería estar creado)
# Agregar archivos
git add .
git commit -m "Initial commit"

# Crear repo en GitHub y conectar
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

### 3. Conectar con Vercel
- [ ] En Vercel, click "Add New Project"
- [ ] Conectar repositorio de GitHub
- [ ] Seleccionar el repositorio

### 4. Configurar Proyecto en Vercel
- [ ] **Framework Preset**: Next.js
- [ ] **Root Directory**: `web-app`
- [ ] **Build Command**: `npm run build` (debería ser automático)
- [ ] **Output Directory**: `.next` (debería ser automático)

### 5. Agregar Variables de Entorno en Vercel
En Vercel → Tu proyecto → Settings → Environment Variables, agregar:

```
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Mismos valores que en .env.local**

### 6. Deploy
- [ ] Click "Deploy"
- [ ] Esperar 2-3 minutos
- [ ] Obtener URL: `tu-proyecto.vercel.app`

---

## ✅ FASE 6: Verificación Final

### 1. Verificar Firestore
- [ ] Ir a Firebase Console → Firestore Database
- [ ] Debería estar vacío por ahora (se llenará cuando se ejecute monitorTrends)

### 2. Verificar Web App
- [ ] Abrir URL de Vercel
- [ ] Crear cuenta (si no tienes usuario)
- [ ] Iniciar sesión
- [ ] Ver dashboard (debería estar vacío por ahora)

### 3. Trigger Manual de Trends
```bash
curl -X POST \
  -H "Authorization: Bearer un-token-secreto-cualquiera-123" \
  https://us-central1-TU-PROJECT-ID.cloudfunctions.net/manualTrendsCheck
```

- [ ] Debería retornar JSON con tendencias
- [ ] Verificar en Firestore que se crearon documentos en `trending_topics`
- [ ] Verificar en web app que aparecen las tendencias

### 4. Verificar Generación de Scripts
- [ ] Después de que se creen temas en Firestore, espera 1-2 minutos
- [ ] Verificar en Firestore que los documentos cambien a status `script_ready`
- [ ] Verificar que tengan campo `script` con contenido
- [ ] Verificar en web app que se muestren los scripts

---

## 🎉 ¡Listo!

Si completaste todos los pasos, tu sistema base está funcionando.

**Próximos pasos**:
1. El sistema detectará tendencias automáticamente cada 2 horas
2. Puedes aprobar/rechazar contenido en la web app
3. Podemos agregar más funcionalidades (audio, video, publicación)

---

## ❓ ¿Problemas?

### Error: "Billing account not found"
- [ ] Verificar que activaste el plan Blaze en Firebase
- [ ] Agregar método de pago

### Error: "GEMINI_API_KEY not configured"
- [ ] Verificar que ejecutaste `firebase functions:config:set`
- [ ] Re-deploy functions: `firebase deploy --only functions`

### Error: Web app no carga
- [ ] Verificar variables de entorno en Vercel
- [ ] Revisar consola del navegador (F12)
- [ ] Verificar que Firebase Authentication esté habilitado

### Error: "Permission denied" en Firestore
- [ ] Verificar reglas de Firestore (`firestore.rules`)
- [ ] Desplegar reglas: `firebase deploy --only firestore:rules`

---

## 📞 Siguiente Paso

Una vez que todo funcione, avísame y:
1. Agregaremos generación de audio (ElevenLabs)
2. Agregaremos generación de video
3. Agregaremos publicación automática
4. Agregaremos analytics

¡Vamos paso a paso! 🚀

