# 🧪 Cómo Probar NewsAPI

## 1. Configurar NewsAPI Key

```bash
firebase functions:config:set newsapi.key="TU_API_KEY_AQUI"
```

## 2. Obtener API Key de NewsAPI

1. Ve a: https://newsapi.org/register
2. Regístrate (gratis)
3. Copia tu API key del dashboard
4. Configúrala en Firebase (comando arriba)

## 3. Redesplegar

```bash
firebase deploy --only functions:fetchTrendsNow
```

## 4. Probar

1. Ve a tu dashboard web
2. Click en "Buscar Tendencias"
3. Debería obtener noticias trending de NewsAPI

---

## ✅ Qué debería pasar:

- ✅ Obtiene las top 15 noticias de NewsAPI
- ✅ Extrae el tema principal de cada noticia
- ✅ Crea trending topics con esas noticias
- ✅ Las agrega a Firestore
- ✅ Se generan scripts automáticamente

---

## 🐛 Si no funciona:

1. Verifica que la API key esté configurada:
   ```bash
   firebase functions:config:get
   ```

2. Revisa los logs:
   ```bash
   firebase functions:log --only fetchTrendsNow
   ```

3. Verifica que tu API key de NewsAPI esté activa en: https://newsapi.org/account

