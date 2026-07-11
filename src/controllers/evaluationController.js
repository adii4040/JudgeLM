import MODEL_NAMES from '../constants/models.constant.js';
import getFinalJudgment from '../service/judgement.service.js';
import {
    googleAIGenerate,
    anthropicAIGenerate,
    groqAIGenerate,
    openAIGenerate
} from '../utils/index.js';

export const evaluateModels = async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log('PROMPTT: ', prompt)

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required in request body." });
        }

        console.log(`Starting multi-model evaluation.........`);

        // Execute model API calls in parallel
        const [resGoogle, resAnthropic, resGroq, resOpenAI] = await Promise.all([
            googleAIGenerate(prompt),
            anthropicAIGenerate(prompt),
            groqAIGenerate(prompt),
            openAIGenerate(prompt),
        ]);


        const judgingModels = [
            {
                model: MODEL_NAMES.google.label,
                response: resGoogle,
            },
            {
                model: MODEL_NAMES.anthropic.label,
                response: resAnthropic,
            },
            {
                model: MODEL_NAMES.groq.label,
                response: resGroq,
            },
            {
                model: MODEL_NAMES.openai.label,
                response: resOpenAI,
            },
        ];

        const judgement = await getFinalJudgment(judgingModels, prompt);

        return res.status(201).json({
            success: true,
            judgement,
            message: "Model judgement completed successfully!"
        });

    } catch (error) {
        console.error("Error during prompt evaluation:", error);
        return res.status(500).json({
            error: "Failed to evaluate prompt across models",
            message: error.message,
        });
    }
};
