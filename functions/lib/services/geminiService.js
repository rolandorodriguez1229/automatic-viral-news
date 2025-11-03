"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
class GeminiService {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is required");
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    }
    /**
     * Genera un script para video viral basado en una noticia trending
     */
    async generateScript(topicData) {
        const prompt = `
Eres un experto creador de contenido viral para redes sociales.

NOTICIA EN TENDENCIA: ${topicData.keyword}
TRÁFICO: ${topicData.traffic}

ARTÍCULOS RELACIONADOS:
${topicData.articles.map((article, idx) => `${idx + 1}. ${article.title} (${article.source})`).join("\n")}

Crea un script de video optimizado para redes sociales (60-75 segundos) que incluya:

1. HOOK POTENTE (primeros 3 segundos que capture atención inmediatamente)
2. DESARROLLO INFORMATIVO (contexto claro y fácil de entender)
3. DATO SORPRENDENTE (algo impactante que mantenga el interés)
4. CTA CLARO (llamado a la acción al final)

IMPORTANTE:
- El hook debe ser extremadamente atractivo
- Lenguaje claro y accesible
- Incluir números específicos cuando sea posible
- Mantener el interés cada 10-15 segundos

Formato de respuesta JSON (sin markdown, solo JSON puro):
{
  "hook": "texto del hook (máximo 15 palabras)",
  "hook_type": "tipo de hook usado (ej: pregunta, afirmación, dato impactante)",
  "body_segments": [
    {"timestamp": "0-15s", "content": "contenido del primer segmento"},
    {"timestamp": "15-30s", "content": "contenido del segundo segmento"},
    {"timestamp": "30-45s", "content": "contenido del tercer segmento"},
    {"timestamp": "45-60s", "content": "contenido del cuarto segmento"}
  ],
  "surprise": "dato impactante o sorprendente",
  "cta": "llamado a la acción (ej: 'Sigue para más noticias', 'Comparte si te sorprendió')",
  "fullText": "script completo unificado para narración de audio",
  "estimated_duration": 65,
  "videoPrompts": [
    {
      "timestamp": "0-5s",
      "prompt": "descripción detallada de la escena visual para el hook, estilo cinematográfico, alta calidad",
      "style": "cinematic"
    },
    {
      "timestamp": "5-20s",
      "prompt": "descripción de la escena para el desarrollo inicial",
      "style": "informative"
    },
    {
      "timestamp": "20-40s",
      "prompt": "descripción de la escena para el contenido principal",
      "style": "dynamic"
    },
    {
      "timestamp": "40-55s",
      "prompt": "descripción de la escena para el dato sorprendente",
      "style": "impactful"
    },
    {
      "timestamp": "55-65s",
      "prompt": "descripción de la escena final con CTA",
      "style": "call_to_action"
    }
  ],
  "visual_style": "estilo visual general (ej: modern, dynamic, cinematic, minimalist)",
  "topics": ["${topicData.keyword}", "noticias", "tendencias"]
}

Responde SOLO con el JSON, sin texto adicional antes o después.
`;
        try {
            const result = await this.model.generateContent(prompt);
            const responseText = result.response.text();
            // Limpiar respuesta de markdown si existe
            const cleanText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            const scriptData = JSON.parse(cleanText);
            // Validaciones básicas
            if (!scriptData.hook || !scriptData.fullText) {
                throw new Error("Invalid script data generated");
            }
            return scriptData;
        }
        catch (error) {
            console.error("Error generating script:", error);
            throw new Error(`Failed to generate script: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    /**
     * Analiza contenido para determinar calidad y potencial viral
     */
    async analyzeContent(script) {
        const prompt = `
Analiza este script de contenido viral:

${JSON.stringify(script, null, 2)}

Evalúa:
1. Calidad general del script (0-100)
2. Potencial viral (0-100)
3. Fortalezas del contenido
4. Debilidades
5. Recomendaciones para mejorar

Responde en JSON:
{
  "quality_score": 85,
  "viral_potential": 80,
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "weaknesses": ["debilidad 1"],
  "recommendations": ["recomendación 1"]
}
`;
        try {
            const result = await this.model.generateContent(prompt);
            const responseText = result.response.text();
            const cleanText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            return JSON.parse(cleanText);
        }
        catch (error) {
            console.error("Error analyzing content:", error);
            return {
                quality_score: 70,
                viral_potential: 65,
                strengths: [],
                weaknesses: ["Error analyzing content"],
                recommendations: ["Review manually"],
            };
        }
    }
}
exports.GeminiService = GeminiService;
//# sourceMappingURL=geminiService.js.map