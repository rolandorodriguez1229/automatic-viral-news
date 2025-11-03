# 🔄 Alternativas para Obtener Tendencias

Google Trends está bloqueando peticiones desde servidores. Aquí tienes **3 alternativas funcionales**:

---

## ✅ Opción 1: NewsAPI (RECOMENDADO - Más fácil y gratis)

### Ventajas:
- ✅ API oficial y estable
- ✅ 100 requests gratis/día
- ✅ Fácil de configurar
- ✅ Datos de noticias reales y trending

### Cómo configurarlo:

1. **Regístrate en NewsAPI:**
   - Ve a: https://newsapi.org/register
   - Crea una cuenta gratuita
   - Obtén tu API key (gratis hasta 100 requests/día)

2. **Configurar en Firebase:**
   ```bash
   firebase functions:config:set newsapi.key="TU_API_KEY_AQUI"
   ```

3. **Re-deploy:**
   ```bash
   firebase deploy --only functions:fetchTrendsNow
   ```

### Costo:
- **Gratis**: 100 requests/día
- **Pago**: Desde $449/mes para más requests

---

## ✅ Opción 2: SerpAPI

### Ventajas:
- ✅ Acceso a Google Trends real
- ✅ Plan gratuito limitado
- ✅ Datos oficiales de Google

### Cómo configurarlo:

1. **Regístrate en SerpAPI:**
   - Ve a: https://serpapi.com/users/sign_up
   - Crea cuenta (tienen plan gratuito)
   - Obtén tu API key

2. **Configurar en Firebase:**
   ```bash
   firebase functions:config:set serpapi.key="TU_API_KEY_AQUI"
   ```

3. **Re-deploy:**
   ```bash
   firebase deploy --only functions:fetchTrendsNow
   ```

### Costo:
- **Gratis**: 100 searches/mes
- **Pago**: Desde $50/mes

---

## ✅ Opción 3: Agregar Tendencias Manualmente (Ya funciona)

Ya tienes el botón en el dashboard. Funciona perfectamente:

1. Ve al dashboard
2. Click en "Agregar Tendencia Manual"
3. Ingresa el keyword
4. El sistema genera el script automáticamente

---

## 🎯 Mi Recomendación

**Para empezar:**
1. Usa **NewsAPI** (más fácil, gratis, funciona bien)
2. Si necesitas más volumen, agrega **SerpAPI**

**Para producción:**
- **SerpAPI** es mejor si necesitas datos exactos de Google Trends
- **NewsAPI** es más económico y suficiente para la mayoría de casos

---

## 📝 Instrucciones Rápidas

### Configurar NewsAPI (5 minutos):

1. Ve a: https://newsapi.org/register
2. Regístrate (es gratis)
3. Copia tu API key
4. Ejecuta:
   ```bash
   firebase functions:config:set newsapi.key="TU_API_KEY"
   firebase deploy --only functions:fetchTrendsNow
   ```
5. ¡Listo! El botón de "Buscar Tendencias" funcionará

---

¿Quieres que te guíe para configurar NewsAPI o SerpAPI?

