# 🔑 Configurar API Keys

## Configurar API Key de Gemini

Ejecuta este comando (reemplaza `TU_API_KEY_AQUI` con tu API key real):

```bash
firebase functions:config:set gemini.api_key="TU_API_KEY_AQUI" manual.trigger_token="mi-token-secreto-123"
```

**Ejemplo:**
```bash
firebase functions:config:set gemini.api_key="AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q" manual.trigger_token="token-secreto-123"
```

## Verificar que se guardó correctamente

Después de ejecutar el comando, verifica con:

```bash
firebase functions:config:get
```

Deberías ver algo como:
```json
{
  "gemini": {
    "api_key": "AIza..."
  },
  "manual": {
    "trigger_token": "mi-token-secreto-123"
  }
}
```

## ⚠️ IMPORTANTE

- NO compartas tu API key públicamente
- NO la subas a Git (ya está en .gitignore)
- Guárdala solo localmente

