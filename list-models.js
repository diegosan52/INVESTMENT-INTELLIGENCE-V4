import { GoogleGenerativeAI } from "@google/generative-ai";

// Script para listar modelos disponibles
const listModels = async () => {
    const apiKey = process.argv[2];

    if (!apiKey) {
        console.log("❌ Uso: node list-models.js TU_API_KEY");
        process.exit(1);
    }

    console.log("🔍 Consultando modelos disponibles...\n");

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        // Intentar listar modelos
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();

        console.log("✅ Modelos disponibles:\n");
        data.models?.forEach(model => {
            console.log(`  📌 ${model.name}`);
            console.log(`     Soporta: ${model.supportedGenerationMethods?.join(', ')}`);
            console.log("");
        });

        console.log("\n💡 Usa uno de estos nombres en tu código.");

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
};

listModels();
