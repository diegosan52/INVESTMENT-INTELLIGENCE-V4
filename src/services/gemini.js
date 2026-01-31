import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Service to interact with Google Gemini AI for financial analysis
 */
export const analyzeChatWithGemini = async (apiKey, chatContent, tone = 'Ejecutivo') => {
    try {
        if (!apiKey || apiKey.trim() === '') {
            throw new Error('API_KEY_MISSING');
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Usando gemini-2.5-flash - el modelo más rápido y eficiente de Gemini 2.5
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
      Actúa como un analista financiero senior experto en el mercado de valores de Colombia (BVC) e internacional.
      Tu tarea es analizar un historial de chat de WhatsApp y generar un REPORTE ESTRATÉGICO ALPHA.

      CONTEXTO DEL CHAT:
      ${chatContent.substring(0, 50000)}

      INSTRUCCIONES:
      1. Identifica los activos (acciones, ETFs, bonos) mencionados.
      2. Analiza el sentimiento del mercado (optimismo, cautela, miedo).
      3. Extrae recomendaciones tácticas o decisiones de inversión discutidas.
      4. Si se mencionan métricas (dividendos, varianza, precios), inclúyelas.
      5. El tono debe ser "${tone}".

      FORMATO DEL REPORTE:
      - Usa un lenguaje profesional y estructurado.
      - Evita introducciones genéricas tipo "Aquí tienes el análisis...".
      - Comienza directamente con el encabezado "REPORTE ESTRATÉGICO ALPHA".
      - Usa viñetas para mayor claridad.
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini AI Error completo:", error);

        // Manejo específico de errores
        if (error.message === 'API_KEY_MISSING') {
            throw new Error('Por favor, ingresa una API Key válida.');
        }

        if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('invalid') || error.message?.includes('400')) {
            throw new Error('La API Key es inválida. Verifica que la copiaste correctamente desde Google AI Studio.');
        }

        if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
            throw new Error('Has alcanzado el límite de consultas gratuitas. Intenta mañana o usa una API Key de pago.');
        }

        if (error.message?.includes('SAFETY') || error.message?.includes('blocked')) {
            throw new Error('El contenido fue bloqueado por filtros de seguridad. Intenta con otro chat.');
        }

        if (error.message?.includes('404') || error.message?.includes('not found')) {
            throw new Error('Modelo no disponible. Verifica tu API Key en https://aistudio.google.com/apikey');
        }

        // Error genérico con más detalles
        throw new Error(`Error de IA: ${error.message || 'Verifica tu API Key y conexión a internet.'}`);
    }
};
