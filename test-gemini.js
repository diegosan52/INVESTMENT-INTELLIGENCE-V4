import { GoogleGenerativeAI } from "@google/generative-ai";

const testGemini = async () => {
    const apiKey = "AIzaSyAyzWJfIzzWmOm3LUiEBwY7tvj0WmYL-aA";

    console.log("🧪 Probando Gemini 2.5 Flash...\n");

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent("Analiza brevemente: ECOPETROL subió 5% hoy");
        const response = result.response;
        const text = response.text();

        console.log("✅ ¡ÉXITO! Respuesta de Gemini 2.5:");
        console.log(text);
        console.log("\n✅ La API Key funciona perfectamente con gemini-2.5-flash");
    } catch (error) {
        console.error("❌ Error:", error.message);
        console.error("Detalles:", error);
    }
};

testGemini();
