# 🔍 Cómo Encontrar tu API Key de Firebase

## Opción 1: Firebase Console (Más fácil)

1. Ve a: https://console.firebase.google.com/project/automatic-viral-news/settings/general

2. Scroll hacia abajo hasta **"Your apps"**

3. Si tienes una app web, haz click en ella

4. Verás el objeto `firebaseConfig` con `apiKey`

**Esa es la clave que necesitas.**

---

## Opción 2: Google Cloud Console

1. Ve a: https://console.cloud.google.com/apis/credentials?project=automatic-viral-news

2. Busca en la sección **"API keys"**

3. Deberías ver las claves asociadas al proyecto

---

## Verificar qué clave estás usando actualmente

La clave que está en Vercel es la que realmente importa. Para verla:

1. Ve a Vercel Dashboard
2. Tu proyecto → Settings → Environment Variables
3. Busca `NEXT_PUBLIC_FIREBASE_API_KEY`
4. Esa es la clave que está usando tu app

---

## Si no encuentras ninguna clave:

Puedes crear una nueva directamente en Firebase Console sin regenerar la existente. Las apps de Firebase pueden tener múltiples API keys.

---

**Dime qué ves en Firebase Console → Project Settings → Your apps**

