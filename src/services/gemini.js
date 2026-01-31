import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Service to interact with Google Gemini AI for financial analysis
 */
export const analyzeChatWithGemini = async (apiKey, chatContent, tone = 'Ejecutivo') => {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      Actúa como un analista financiero senior experto en el mercado de valores de Colombia (BVC) e internacional.
      Tu tarea es analizar un historial de chat de WhatsApp y generar un REPORTE ESTRATÉGICO ALPHA.

      CONTEXTO DEL CHAT:
      ${chatContent.substring(0, 30000)} // Limitamos a 30k caracteres para evitar exceder tokens en la versión gratuita

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
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini AI Error:", error);
        throw new Error("No se pudo completar el análisis de IA. Verifica tu API Key y conexión.");
    }
};
