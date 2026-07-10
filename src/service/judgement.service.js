import 'dotenv/config';
import OpenAI from 'openai';
import MODEL_NAMES from '../constants/models.constant.js';
import SYSTEM_PROMPT from '../constants/system-prompt.constant.js';
import finalResponseSchema from '../validators/zodValidations.validator.js';
import { zodTextFormat } from "openai/helpers/zod";

const openai = new OpenAI();

const getFinalJudgment = async (judgingModels, prompt) => {
    try {
        console.log('FINAL JUDGEMENT IN PROGRESS.........')
        const response = await openai.responses.parse({
            model: MODEL_NAMES.openai.name,
            input: [
                { role: "system", content: SYSTEM_PROMPT },
                {
                    role: "user",
                    content: JSON.stringify({
                        prompt,
                        responses: judgingModels,
                    }),
                },
            ],
            text: {
                format: zodTextFormat(finalResponseSchema, "finalResponse"),
            },
        });

        const event = response.output_parsed;
        console.log('FINAL JUDGEMENT CALCULATED.........')
        return event
    } catch (error) {
        console.log(error)
        return error
    }
}

export default getFinalJudgment;


