import "dotenv/config";
import Anthropic from '@anthropic-ai/sdk';
import MODEL_NAMES from "../constants/models.constant.js";

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

const anthropicAIGenerate = async (prompt) => {
    try {
        console.log('ANTHROPIC IS THINKING.........');
        const message = await client.messages.create({
            max_tokens: 1024,
            messages: [{ content: prompt, role: 'user' }],
            model: MODEL_NAMES.anthropic.name,
        });
        console.log('ANTHROPIC FINISHED THINKING.........');
        return message.content[0].text;
    } catch (err) {
        console.log(err);
        return "Error: Could not generate response from Anthropic";
    }
}

export default anthropicAIGenerate;