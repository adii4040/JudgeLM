import 'dotenv/config';
import OpenAI from 'openai';
import MODEL_NAMES from '../constants/models.constant.js';


const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const openAIGenerate = async (prompt) => {
    try {
        console.log('OPENAI IS THINKING.........');
        const response = await client.responses.create({
            model: MODEL_NAMES.openai.name,
            input: prompt
        });
        console.log('OPENAI FINISHED THINKING.........');
        return response.output_text;
    } catch (err) {
        console.log(err);
        return "Error: Could not generate response from OpenAI";
    }
}

export default openAIGenerate;
