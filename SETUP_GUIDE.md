# 🚀 Guía Completa de Setup - Sistema de Automatización Viral

Esta guía te llevará paso a paso para configurar todo el sistema.

---

## 📋 Tabla de Contenidos

1. [Prerrequisitos](#prerrequisitos)
2. [Configuración de Firebase](#configuración-de-firebase)
3. [Obtención de API Keys](#obtención-de-api-keys)
4. [Configuración Local](#configuración-local)
5. [Despliegue del Backend](#despliegue-del-backend)
6. [Despliegue de la Web App](#despliegue-de-la-web-app)
7. [Verificación y Testing](#verificación-y-testing)

---

## 1️⃣ Prerrequisitos

### Herramientas necesarias:

```bash
# 1. Node.js (versión 18 o superior)
node --version
# Si no lo tienes: https://nodejs.org/

# 2. Git
git --version
# Si no lo tienes: https://git-scm.com/downloads

# 3. Firebase CLI
npm install -g firebase-tools
firebase --version

# 4. Cuenta de Google (para Firebase)
# Crear en: https://console.firebase.google.com/
```

---

## 2️⃣ Configuración de Firebase

### Paso 1: Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en **"Agregar proyecto"** o **"Create a project"**
3. Nombre del proyecto: `viral-automation-system` (o el que prefieras)
4. ✅ Habilita Google Analytics (recomendado)
5. Click **"Continuar"** y espera a que se cree el proyecto

### Paso 2: Habilitar Servicios

#### a) Firestore Database
1. En el menú lateral: **Build** → **Firestore Database**
2. Click **"Create database"**
3. Selecciona **"Start in production mode"**
4. Elige ubicación: `us-central1` o `us-east1` (recomendado)
5. Click **"Enable"**

#### b) Storage
1. En el menú lateral: **Build** → **Storage**
2. Click **"Get started"**
3. Acepta las reglas por defecto
4. Elige la misma ubicación que Firestore
5. Click **"Done"**

#### c) Authentication
1. En el menú lateral: **Build** → **Authentication**
2. Click **"Get started"**
3. Habilita **"Email/Password"** provider
4. Click **"Save"**

#### d) Functions
1. En el menú lateral: **Build** → **Functions**
2. Click **"Get started"**
3. Esto se configurará automáticamente cuando despliegues

#### e) Habilitar Billing (CRÍTICO)
1. En el menú: ⚙️ **Settings** → **Usage and billing**
2. Click **"Modify plan"**
3. Selecciona **"Blaze (Pay as you go)"**
4. Agrega método de pago
5. ⚠️ **IMPORTANTE**: Necesitas billing activo para usar Cloud Functions

---

## 3️⃣ Obtención de API Keys

### 🔑 Google Gemini AI

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"**
3. Selecciona tu proyecto de Firebase
4. Copia la API key generada
5. **Guárdala** para más adelante: `GEMINI_API_KEY`

### 🎤 ElevenLabs (Para audio)

1. Ve a [ElevenLabs](https://elevenlabs.io/)
2. Crea una cuenta (tiene plan gratuito)
3. Ve a tu perfil → **"API Keys"**
4. Click **"Create API Key"**
5. Copia la key generada
6. **Guárdala**: `ELEVENLABS_API_KEY`

**También necesitarás:**
- Voice ID (puedes usar uno de los predeterminados o crear uno custom)
- Guárdalo: `ELEVENLABS_VOICE_ID` (ejemplo: `21m00Tcm4TlvDq8ikWAM`)

### 🎬 Sora / Veo (Para video - OPCIONAL por ahora)

**Nota**: Sora y Veo aún no tienen APIs públicas. Por ahora podemos usar:
- **Alternativa 1**: [Runway ML](https://runwayml.com/) - tiene API
- **Alternativa 2**: [Stable Video Diffusion](https://stability.ai/) - API disponible
- **Alternativa 3**: Esperar a que Sora/Veo lancen APIs públicas

**Para Runway ML**:
1. Crea cuenta en [Runway ML](https://runwayml.com/)
2. Ve a Settings → API
3. Genera API key
4. **Guárdala**: `RUNWAY_API_KEY`

### 📱 APIs de Redes Sociales

#### TikTok
1. Ve a [TikTok for Developers](https://developers.tiktok.com/)
2. Crea una aplicación
3. Obtén Access Token
4. **Guárdalo**: `TIKTOK_ACCESS_TOKEN`

#### Instagram
1. Ve a [Meta for Developers](https://developers.facebook.com/)
2. Crea una app → Selecciona "Instagram"
3. Obtén Access Token
4. **Guárdalo**: `INSTAGRAM_ACCESS_TOKEN`

#### YouTube
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o usa el de Firebase
3. Habilita "YouTube Data API v3"
4. Crea credenciales OAuth 2.0
5. **Guárdalo**: `YOUTUBE_CLIENT_ID` y `YOUTUBE_CLIENT_SECRET`

#### Facebook
1. En [Meta for Developers](https://developers.facebook.com/)
2. Misma app de Instagram o crea una nueva
3. Obtén Access Token con permisos para páginas
4. **Guárdalo**: `FACEBOOK_ACCESS_TOKEN`

---

## 4️⃣ Configuración Local

### Paso 1: Clonar/Descargar el Proyecto

Si ya tienes el proyecto en tu computadora, navega a la carpeta:

```bash
cd "Automatic viral news"
```

### Paso 2: Instalar Dependencias del Backend

```bash
cd functions
npm install
cd ..
```

### Paso 3: Configurar Firebase Local

```bash
# Login a Firebase
firebase login

# Inicializar proyecto (si no lo has hecho)
firebase init

# Selecciona:
# - Firestore: Yes
# - Functions: Yes
# - Storage: Yes
# - Hosting: No (usaremos Vercel)
```

### Paso 4: Configurar Variables de Entorno

```bash
# Configurar en Firebase (producción)
firebase functions:config:set \
  gemini.api_key="TU_GEMINI_API_KEY" \
  elevenlabs.api_key="TU_ELEVENLABS_API_KEY" \
  elevenlabs.voice_id="TU_VOICE_ID" \
  manual.trigger_token="un-token-secreto-que-inventes"

# Para APIs de redes sociales (cuando las tengas):
firebase functions:config:set \
  tiktok.access_token="TU_TOKEN" \
  instagram.access_token="TU_TOKEN" \
  youtube.client_id="TU_CLIENT_ID" \
  youtube.client_secret="TU_CLIENT_SECRET" \
  facebook.access_token="TU_TOKEN"
```

### Paso 5: Instalar Dependencias de la Web App

```bash
cd web-app
npm install
cd ..
```

---

## 5️⃣ Despliegue del Backend

### Paso 1: Compilar TypeScript

```bash
cd functions
npm run build
```

Si hay errores, instala dependencias faltantes.

### Paso 2: Desplegar Functions

```bash
cd ..
firebase deploy --only functions
```

Esto puede tardar 5-10 minutos la primera vez.

### Paso 3: Verificar Deployment

Ve a [Firebase Console](https://console.firebase.google.com/) → Tu proyecto → Functions

Deberías ver:
- `monitorTrends`
- `manualTrendsCheck`
- `healthCheck`
- `generateScript`

### Paso 4: Configurar Cloud Scheduler

El `monitorTrends` se ejecutará automáticamente cada 2 horas.

Para probar manualmente:

```bash
# Obtén la URL de tu función
# Ve a Firebase Console → Functions → manualTrendsCheck → Ver URL

curl -X POST \
  -H "Authorization: Bearer un-token-secreto-que-inventes" \
  https://us-central1-TU-PROJECT-ID.cloudfunctions.net/manualTrendsCheck
```

---

## 6️⃣ Despliegue de la Web App

### Opción A: Desplegar en Vercel (RECOMENDADO)

#### Paso 1: Configurar Vercel

1. Ve a [Vercel](https://vercel.com/)
2. Crea cuenta (o inicia sesión con GitHub)
3. Click **"Add New Project"**

#### Paso 2: Conectar Repositorio

```bash
# Si aún no tienes Git, inicializa:
git init
git add .
git commit -m "Initial commit"

# Crea repo en GitHub y conecta:
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

#### Paso 3: Configurar en Vercel

1. En Vercel, conecta tu repositorio de GitHub
2. Configuración del proyecto:
   - **Framework Preset**: Next.js
   - **Root Directory**: `web-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### Paso 4: Variables de Entorno en Vercel

En Vercel → Tu proyecto → Settings → Environment Variables, agrega:

```
NEXT_PUBLIC_FIREBASE_API_KEY=tu-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Para obtener estos valores:**
1. Ve a Firebase Console → ⚙️ Settings → Project settings
2. Scroll down → "Your apps" → Web app (si no existe, créala)
3. Copia los valores del objeto `firebaseConfig`

#### Paso 5: Deploy

1. En Vercel, click **"Deploy"**
2. Espera a que termine (2-3 minutos)
3. Obtendrás una URL tipo: `tu-proyecto.vercel.app`

### Opción B: Desplegar en Firebase Hosting

```bash
cd web-app
npm run build
npm run export  # Si usas static export
cd ..
firebase deploy --only hosting
```

---

## 7️⃣ Verificación y Testing

### Test 1: Health Check

```bash
curl https://us-central1-TU-PROJECT-ID.cloudfunctions.net/healthCheck
```

Debería retornar:
```json
{"status":"healthy","timestamp":"2025-01-02T...","version":"1.0.0"}
```

### Test 2: Manual Trends Check

```bash
curl -X POST \
  -H "Authorization: Bearer un-token-secreto-que-inventes" \
  https://us-central1-TU-PROJECT-ID.cloudfunctions.net/manualTrendsCheck
```

Debería retornar tendencias en JSON.

### Test 3: Verificar en Firestore

1. Ve a Firebase Console → Firestore Database
2. Deberías ver la colección `trending_topics`
3. Verifica que se estén creando documentos con status `pending`

### Test 4: Verificar Web App

1. Abre tu URL de Vercel
2. Inicia sesión con email/password (crea usuario en Authentication primero)
3. Deberías ver el dashboard

---

## 🔧 Troubleshooting

### Error: "GEMINI_API_KEY not configured"
- Verifica que ejecutaste `firebase functions:config:set`
- Re-deploy las functions después de configurar

### Error: "Billing account not found"
- Asegúrate de haber habilitado el plan Blaze en Firebase

### Error: Functions no se despliegan
- Verifica que tienes Node.js 18+
- Ejecuta `npm install` en la carpeta `functions`
- Verifica que `functions/src/index.ts` existe

### Error: Web app no carga
- Verifica variables de entorno en Vercel
- Revisa la consola del navegador
- Verifica que Firebase Authentication esté habilitado

---

## 📞 Próximos Pasos

Una vez que todo esté funcionando:

1. ✅ **Sistema base funcionando**
2. ⏳ **Agregar generación de audio** (ElevenLabs)
3. ⏳ **Agregar generación de video** (Runway/Sora cuando esté disponible)
4. ⏳ **Implementar publicación automática**
5. ⏳ **Agregar analytics y métricas**

---

## 📝 Checklist de Setup

- [ ] Firebase proyecto creado
- [ ] Firestore habilitado
- [ ] Storage habilitado
- [ ] Authentication habilitado
- [ ] Billing activado (Blaze plan)
- [ ] Gemini API key obtenida
- [ ] ElevenLabs API key obtenida
- [ ] Variables de entorno configuradas
- [ ] Functions desplegadas
- [ ] Web app desplegada en Vercel
- [ ] Health check funciona
- [ ] Manual trends check funciona
- [ ] Firestore recibe datos

---

¡Felicidades! 🎉 Si completaste todos los pasos, tu sistema base está funcionando.

