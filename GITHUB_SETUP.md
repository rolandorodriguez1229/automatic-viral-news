# 🚀 Configurar Repositorio en GitHub

## ✅ Pasos Completados:
1. ✅ Repositorio Git inicializado
2. ✅ Archivos agregados
3. ✅ Commit inicial creado

## 📋 Siguientes Pasos:

### Paso 1: Crear Repositorio en GitHub

1. **Ve a GitHub**: https://github.com/new

2. **Configura el repositorio:**
   - **Repository name**: `viral-automation-system` (o el nombre que prefieras)
   - **Description**: Sistema de automatización de contenido viral basado en tendencias
   - **Visibility**: Private (recomendado) o Public
   - ❌ **NO** marques "Add a README file" (ya tenemos uno)
   - ❌ **NO** agregues .gitignore (ya tenemos uno)
   - ❌ **NO** agregues una licencia

3. **Click en "Create repository"**

### Paso 2: Conectar Repositorio Local con GitHub

**Después de crear el repositorio en GitHub, ejecuta estos comandos:**

```bash
# Reemplaza TU-USUARIO con tu nombre de usuario de GitHub
# Reemplaza viral-automation-system con el nombre que elegiste

git remote add origin https://github.com/TU-USUARIO/viral-automation-system.git
git branch -M main
git push -u origin main
```

**O si prefieres usar SSH:**

```bash
git remote add origin git@github.com:TU-USUARIO/viral-automation-system.git
git branch -M main
git push -u origin main
```

### Paso 3: Verificar

Después del push, deberías poder ver todos los archivos en tu repositorio de GitHub.

---

## 🔐 Notas de Seguridad:

**IMPORTANTE**: Asegúrate de que estos archivos NO se suban a GitHub:

- ✅ `.env.local` (ya está en .gitignore)
- ✅ Variables de entorno con API keys
- ✅ Firebase config con credenciales sensibles

El `.gitignore` ya está configurado para excluir estos archivos automáticamente.

---

## 📝 Comandos Útiles:

```bash
# Ver estado del repositorio
git status

# Agregar cambios
git add .

# Hacer commit
git commit -m "Descripción del cambio"

# Subir cambios
git push

# Ver commits
git log
```

---

**Una vez que hayas creado el repositorio en GitHub, dime el nombre de usuario y el nombre del repo para que te ayude con los comandos exactos.**

