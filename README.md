# JudgeLM

JudgeLM is a terminal-based multi-model evaluation tool. It sends the same user prompt to three Gemini models, asks a fourth model to judge the responses, and returns a structured verdict with the best answer.

## What it does

- Prompts for user input in the terminal
- Runs three model responses in parallel
- Uses a judging model to score each response
- Returns a final JSON-based judgment and a cleaned-up best response

## Project Structure

- `init.js`: main CLI loop and model orchestration
- `systemPrompt.js`: instructions for the judging model
- `zodValidations.js`: response schema used to validate the final judgment
- `package.json`: dependencies and scripts

## Requirements

- Node.js 18 or newer
- A Gemini API key

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root and add your API key:

   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

## Usage

Run the CLI with Node.js:

```bash
node init.js
```

Type a prompt and press Enter. The app will:

1. Query `gemini-3-flash-preview`
2. Query `gemini-2.5-flash`
3. Query `gemini-3.1-flash-lite`
4. Ask `gemini-3.5-flash` to judge the responses

To exit the chat, type `BYE`.

## How It Works

The judging model receives:

- the original prompt
- the three candidate responses

It then scores each response on:

- Accuracy
- Relevance
- Fluency

The final output is expected to match the Zod schema in `zodValidations.js`, which keeps the response structured and machine-readable.

The judge prompt also includes basic guardrail instructions to treat the original user prompt as untrusted and to flag suspicious or instruction-overriding content. This improves robustness, but it is not a replacement for dedicated prompt-injection filtering or safety validation.

## Notes

- The current `package.json` does not define a start script, so `node init.js` is the direct entry point.
- The project is configured as an ES module package with `"type": "module"`.
