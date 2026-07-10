import { z } from "zod";

const modelEvaluationSchema = z.object({
    model: z
        .string()
        .describe("The unique name or identifier of the AI model being evaluated."),

    parameters: z
        .object({
            accuracy: z
                .number()
                .describe("A score between 0 and 10 indicating the factual correctness of the response. Higher scores indicate fewer factual errors or hallucinations."),

            relevance: z
                .number()
                .describe("A score between 0 and 10 measuring how well the response addresses every part of the user's prompt without going off-topic."),

            fluency: z
                .number()
                .describe("A score between 0 and 10 evaluating the clarity, grammar, readability, organization, and overall writing quality of the response."),

            score: z
                .number()
                .describe("The overall evaluation score between 0 and 10. This should be based on holistic judgment and not simply the arithmetic average of the other scores.")
        })
        .describe("The numerical evaluation metrics assigned to the model's response."),

    strengths: z
        .array(z.string())
        .describe("A list of the strongest aspects of the response. Each item should describe one specific strength such as reasoning quality, factual accuracy, completeness, creativity, or clarity."),

    weaknesses: z
        .array(z.string())
        .describe("A list of the weaknesses or shortcomings of the response. Each item should describe one specific issue such as hallucinations, missing information, poor reasoning, verbosity, or failure to follow instructions."),

    reasoning: z
        .string()
        .describe("A concise explanation justifying the assigned scores. Explain why the response received its strengths, weaknesses, and overall score."),
});

const finalResponseSchema = z.object({
    prompt: z.string().describe("The prompt provided by the user"),
    finalEvaluation: z.array(modelEvaluationSchema).describe("The judgments for each model"),
    ranking: z.object({
        orderedModels: z.array(z.string()).describe("The list of models in descending order of their performance (best to worst)"),
        winner: z.string().describe("The winning model (best performer)"),
        reasoning: z.string().describe("The reasoning behind the ranking and winner selection")
    }).describe("The final ranking and winner selection"),
    finalResponse: z.string().describe("The final response based on the model judgments and the most precise, accurate, relevant and response for the given prompt"),
}).describe("The final response based on the model judgments");

export default finalResponseSchema;