import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const modelJudgingSchema = z.object({
    model: z.string().describe("The model name to be judged"),
    prompt: z.string().describe("The prompt to be evaluated"),
    parameters: z.object({
        accuracy: z.number().describe("The accuracy of the model's response"),
        relevance: z.number().describe("The relevance of the model's response"),
        fluency: z.number().describe("The fluency of the model's response"),
        score: z.number().describe("The overall score of the model's response"),
    }).describe("The parameters for judging the model's response"),
});

const judgmentSchema = z.object({
    bestModel: z.string().describe("The model that performed the best"),
    reasoning: z.string().describe("The reasoning behind the judgment"),
});

const responseSchema = z.object({
    response: z.string().describe("The best response of the user's prompt based on the model judgments"),
});

const finalResponseSchema = z.object({
    modelJudgments: z.array(modelJudgingSchema).describe("The judgments for each model"),
    finalJudgment: judgmentSchema.describe("The final judgment based on the model judgments"),
    response: responseSchema.describe("The final response based on the model judgments and the prompt"),
});

export default finalResponseSchema;