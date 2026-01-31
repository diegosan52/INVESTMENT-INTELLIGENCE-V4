import { GoogleGenerativeAI } from "@google/generative-ai";

// Script de prueba para verificar la API Key
const testApiKey = async () => {
    // REEMPLAZA ESTO CON TU API KEY
    const apiKey = "TU_API_KEY_AQUI";

    console.log("🔍 Probando conexión con Gemini...");

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent("Di 'Hola' en español");
        const response = await result.response;
        const text = response.text();

        console.log("✅ ¡Éxito! Respuesta de Gemini:", text);
    } catch (error) {
        console.error("❌ Error:", error.message);
        console.error("Detalles completos:", error);
    }
};

testApiKey();
