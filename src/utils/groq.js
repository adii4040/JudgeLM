import 'dotenv/config';
import Groq from "groq-sdk";
import MODEL_NAMES from '../constants/models.constant.js';


const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const groqAIGenerate = async (prompt) => {
    try {
        console.log('GROQ IS THINKING.........')
        const completion = await groq.chat.completions.create({
            model: MODEL_NAMES.groq.name,
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        console.log('GROQ FINISHED THINKING.........');
        return completion.choices[0]?.message?.content;
    } catch (err) {
        console.log(err);
        return "Error: Could not generate response from Groq";
    }

}


export default groqAIGenerate;
