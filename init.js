import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from '@google/genai';


import readline from "readline/promises";

import finalResponseSchema from "./zodValidations.js";
import SYSTEM_PROMPT from "./systemPrompt.js";
import zodToJsonSchema from "zod-to-json-schema";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });


const getResFrom3flashPreview = async (prompt) => {
    console.log("gemini-3-flash-preview thinking...")
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
    });
    return response.text;
}

const getResFrom2point5Flash = async (prompt) => {
    console.log("gemini-2.5-flash thinking...")
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
}

const getResFrom3point1FlashLite = async (prompt) => {
    console.log("gemini-3.1-flash-lite thinking...")
    const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
    });
    return response.text;
}

const getJudgmentFromModel = async (judgingModels, prompt) => {

    console.log("gemini-3.5-flash is judging...")
    const judgmentResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: JSON.stringify({
            prompt,
            responses: judgingModels,
        }),
        config: {
            systemInstruction: SYSTEM_PROMPT,
            responseFormat: {
                text: {
                    mimeType: "application/json",
                    schema: zodToJsonSchema(finalResponseSchema),
                },
            },
        },
    });
    console.log("Judgement completed!")

    return JSON.parse(judgmentResponse.text);
}


async function main() {
    console.log("INTITALIZING YOUR AI AGENT...\n")

    while (true) {
        const prompt = await rl.question("You: ");
        if (prompt === 'BYE') {
            console.log("End of chat!!")
            break;
        }

        console.log('STARTING...')

        if (prompt) {
            const [res3flashPreview, res2point5FlashLite, res3point1FlashLite] = await Promise.all([
                getResFrom3flashPreview(prompt),
                getResFrom2point5Flash(prompt),
                getResFrom3point1FlashLite(prompt),
            ])

            console.log("Responses received from all models!")
            const judgingModels = [
                {
                    model: 'gemini-3-flash-preview',
                    response: res3flashPreview,
                },
                {
                    model: 'gemini-2.5-flash',
                    response: res2point5FlashLite,
                },
                {
                    model: 'gemini-3.1-flash-lite',
                    response: res3point1FlashLite,
                },
            ]

            const judgement = await getJudgmentFromModel(judgingModels, prompt);
            console.log("JUDGEMENT: ", JSON.stringify(judgement, null, 2))
        }
    }
    rl.close();
}

main();


// console.log(await getResFrom3flashPreview("what is the capital of india"))
// console.log(await getResFrom3point5Flash("what is the capital of india"))
// console.log(await getResFrom2point5Flash("what is the capital of india"))
// console.log(await getJudgmentFromModel("What is the capital of India?"))

