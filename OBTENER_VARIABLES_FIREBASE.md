# 📱 Obtener Variables de Firebase para la Web App

## Pasos:

1. **Ve a Firebase Console**: https://console.firebase.google.com/project/automatic-viral-news

2. **Ve a Project Settings**:
   - Click en el ícono de ⚙️ (Settings) en la parte superior izquierda
   - Selecciona **"Project settings"**

3. **Ve a la sección "Your apps"**:
   - Scroll hacia abajo hasta ver **"Your apps"**
   - Si no hay ninguna app web, click en el ícono **`</>` (Web)** para crear una
   - Dale un nombre (ej: "Viral Automation Web App")

4. **Copia los valores del objeto `firebaseConfig`**:
   
   Verás algo como:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "automatic-viral-news.firebaseapp.com",
     projectId: "automatic-viral-news",
     storageBucket: "automatic-viral-news.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abc123def456"
   };
   ```

5. **Copia estos valores** y pásamelos para crear el archivo `.env.local`

## 🔑 Variables que necesito:

- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

