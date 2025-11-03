# 🔧 Configuración Paso a Paso - SIGUIENDO JUNTOS

Este documento se actualizará mientras configuramos tu sistema.

## ✅ PASO 1: Herramientas Básicas (COMPLETADO)

- [x] Node.js instalado (v18.18.2)
- [x] npm instalado (v10.9.0)
- [x] Firebase CLI instalado
- [x] Dependencias del backend instaladas
- [x] Dependencias de la web app instaladas

---

## 🔄 PASO 2: Login a Firebase

**Ahora necesitas hacer login en Firebase:**

```bash
firebase login
```

Este comando:
1. Abrirá tu navegador
2. Te pedirá autorizar acceso
3. Conectará tu terminal con tu cuenta de Google

**👉 Ejecuta este comando ahora y dime cuando esté listo**

---

## 🔄 PASO 3: Crear Proyecto en Firebase Console

**Debes hacer esto manualmente en el navegador:**

1. Ve a: https://console.firebase.google.com/
2. Click en **"Agregar proyecto"** o **"Create a project"**
3. Nombre del proyecto: `viral-automation-system` (o el que prefieras)
4. ✅ Activa Google Analytics (recomendado)
5. Click **"Continuar"** y espera a que se cree

**👉 Cuando tengas el proyecto creado, dime el nombre exacto del proyecto**

---

## 🔄 PASO 4: Habilitar Servicios en Firebase

En tu proyecto de Firebase Console:

### 4a) Firestore Database
1. Ve a: **Build** → **Firestore Database**
2. Click **"Create database"**
3. Selecciona **"Start in production mode"**
4. Ubicación: `us-central1` (recomendado) o `us-east1`
5. Click **"Enable"**

### 4b) Storage
1. Ve a: **Build** → **Storage**
2. Click **"Get started"**
3. Acepta las reglas por defecto
4. Click **"Done"**

### 4c) Authentication
1. Ve a: **Build** → **Authentication**
2. Click **"Get started"**
3. Ve a la pestaña **"Sign-in method"**
4. Habilita **"Email/Password"**
5. Click **"Save"**

### 4d) Billing (CRÍTICO)
1. Ve a: ⚙️ **Settings** → **Usage and billing**
2. Click **"Modify plan"**
3. Selecciona **"Blaze (Pay as you go)"**
4. Agrega método de pago
5. ⚠️ **IMPORTANTE**: Sin esto NO funcionarán las Cloud Functions

**👉 Cuando hayas completado estos pasos, dime "listo"**

---

## 🔄 PASO 5: Inicializar Firebase en el Proyecto

**Una vez que tengas el proyecto creado en Firebase Console:**

Ejecutaremos:
```bash
firebase init
```

Y seleccionaremos:
- ✅ Firestore
- ✅ Functions  
- ✅ Storage
- ❌ Hosting (no lo usaremos, desplegamos en Vercel)

**👉 Avísame cuando hayas completado el PASO 4 para continuar**

---

## 🔄 PASO 6: Obtener API Key de Gemini

1. Ve a: https://makersuite.google.com/app/apikey
2. Click **"Create API Key"**
3. Selecciona tu proyecto de Firebase
4. Copia la API key generada

**👉 Cuando tengas la API key, la configuraremos juntos**

---

## 🔄 PASO 7: Configurar Variables de Entorno

Una vez que tengas todo lo anterior, configuraremos:
- API key de Gemini en Firebase Functions
- Variables de Firebase para la web app

---

## 📝 Notas

- Guarda todas tus API keys en un lugar seguro
- No las compartas públicamente
- El proyecto puede tardar varios minutos en crearse

---

**👉 SIGUIENTE ACCIÓN: Ejecuta `firebase login` y dime cuando esté listo**

