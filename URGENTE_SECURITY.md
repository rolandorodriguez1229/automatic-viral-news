# 🚨 URGENTE: Seguridad - API Key Expuesta

## ⚠️ Problema Detectado

Se detectó que tu API key de Firebase estaba expuesta en GitHub en el archivo `DEPLOYMENT_EXITOSO.md`.

**La clave ya fue eliminada del código**, pero necesitas seguir estos pasos:

---

## 🔒 Pasos para Solucionar (HACER AHORA)

### Paso 1: Regenerar la API Key de Firebase

1. Ve a: https://console.cloud.google.com/apis/credentials?project=automatic-viral-news

2. Busca la clave: `AIzaSyBexzm7SHQXDnNfglijAxFXnDPVAakfR74`

3. Click en el ícono de lápiz (Editar)

4. Click en **"Regenerar clave"** o **"Delete"** (eliminar) y crear una nueva

5. **Copia la nueva API key**

---

### Paso 2: Actualizar Variables de Entorno en Vercel

1. Ve a: https://vercel.com/dashboard

2. Selecciona tu proyecto

3. Ve a: **Settings → Environment Variables**

4. Busca `NEXT_PUBLIC_FIREBASE_API_KEY`

5. Edítala con la **nueva API key**

6. Guarda

7. **Redesplega** el proyecto para que tome la nueva clave

---

### Paso 3: Actualizar Variables de Entorno Local (Opcional)

Si tienes el archivo `.env.local` localmente:

```bash
cd web-app
# Edita .env.local y reemplaza la API key
```

---

### Paso 4: Verificar que Todo Funciona

1. Recarga tu aplicación en Vercel
2. Verifica que el login funciona
3. Verifica que puedes ver el dashboard

---

## ✅ Lo que ya hice:

- ✅ Eliminé la API key del archivo `DEPLOYMENT_EXITOSO.md`
- ✅ Los cambios ya están en Git (necesitas hacer push)

---

## 📝 IMPORTANTE para el futuro:

1. **NUNCA** subas API keys reales a GitHub
2. **SIEMPRE** usa variables de entorno
3. **SIEMPRE** verifica `.gitignore` antes de hacer commit
4. Las API keys de Firebase con prefijo `NEXT_PUBLIC_` son públicas por diseño (se exponen en el cliente), pero aún así NO deben estar en el código fuente

---

## ⚠️ Si alguien ya usó tu clave:

1. Revisa el uso en: https://console.cloud.google.com/apis/dashboard?project=automatic-viral-news
2. Revisa la facturación para uso inusual
3. Agrega restricciones a la nueva clave:
   - Solo permitir tu dominio de Vercel
   - Restringir APIs específicas

---

**Haz estos pasos AHORA para proteger tu cuenta.**

