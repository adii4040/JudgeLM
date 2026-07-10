import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import MODEL_NAMES from "../constants/models.constant.js";

const ai = new GoogleGenAI({});

const geminiAIGenerate = async (prompt) => {
    try {
        console.log('GEMINI IS THINKING.........');
        const response = await ai.models.generateContent({
            model: MODEL_NAMES.google.name,
            contents: prompt,
        });
        console.log('GEMINI FINISHED THINKING.........');
        return response.text;
    } catch (error) {
        console.log(error);
        return "Error: Could not generate response from Gemini";
    }
}

export default geminiAIGenerate;