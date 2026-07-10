# JudgeLM - Multi-Model AI Evaluator

JudgeLM is a backend-based multi-model evaluation API service. It takes a single user prompt, sends it in parallel to four leading AI models (from Google, Anthropic, OpenAI, and Groq), and then uses OpenAI's judging capabilities to score, rank, and synthesize the final response into a structured format.

---

## Key Features

- **Parallel Model Querying**: Query four leading frontier and open-weight models concurrently.
- **Automated Judging System**: Employs a dedicated judging model (`gpt-5-mini`) to evaluate each response across accuracy, relevance, and fluency metrics.
- **Strict Structured Outputs**: Utilizes Zod schemas and OpenAI's structured outputs parsing (`responses.parse`) to guarantee consistent JSON response payloads.
- **Health Check Endpoint**: Built-in simple health check endpoint `/api/v1/health`.

---

## Evaluated Models

The application sends prompts in parallel to:

| Provider | Model Identifier in Logs | Active Model |
| :--- | :--- | :--- |
| **Google** | `modelG` | `gemini-3.5-flash` |
| **Anthropic** | `modelA` | `claude-sonnet-4-6` |
| **OpenAI** | `modelO` | `gpt-5-mini` |
| **Groq / Meta** | `modelQ` | `llama-3.3-70b-versatile` |

---

## Project Structure

```
MultiModelRes/
├── src/
│   ├── index.js                     # Server entry point
│   ├── app.js                       # Express application configuration & middleware
│   ├── routes/
│   │   └── evaluationRoutes.js      # Router definitions for evaluation endpoints
│   ├── controllers/
│   │   └── evaluationController.js # Handles request validation and parallel execution flow
│   ├── service/
│   │   └── judgement.service.js     # Interacts with the OpenAI judge API
│   ├── utils/
│   │   ├── gemini.js                # Google Gemini API client utility
│   │   ├── anthropic.js             # Anthropic Claude API client utility
│   │   ├── openAI.js                # OpenAI API client utility
│   │   ├── groq.js                  # Groq API client utility
│   │   └── index.js                 # Unified exports for model helpers
│   ├── constants/
│   │   ├── models.constant.js       # Configuration object for model labels & names
│   │   └── system-prompt.constant.js# System instructions detailing the judge rules
│   └── validators/
│       └── zodValidations.validator.js # Zod validation schema for judge output structure
├── .env.example                     # Reference for environment variables configuration
├── package.json                     # Express dependencies, scripts (start, dev)
└── README.md                        # Documentation
```

---

## Requirements

- **Node.js**: Version 18.x or newer
- API Keys for all four providers (OpenAI, Anthropic, Gemini, Groq)

---

## Setup & Installation

1. **Clone & Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root of the project:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   PORT=3000
   ```

---

## Running the Application

### Development (with Nodemon auto-restart)
```bash
npm run dev
```

### Production
```bash
npm start
```

---

## API Endpoints

### 1. Health Check
- **Endpoint**: `GET /api/v1/health`
- **Description**: Returns the operational status of the server.
- **Response**:
  ```json
  {
    "status": "ok",
    "message": "JudgeLM backend server is running."
  }
  ```

### 2. Evaluate Prompt
- **Endpoint**: `POST /api/v1/evaluate`
- **Description**: Submits the prompt to all models, evaluates them, and returns a ranking and synthesized best response.
- **Request Body**:
  ```json
  {
    "prompt": "Explain the difference between deep learning and machine learning in simple terms."
  }
  ```
- **Response Format**:
  ```json
  {
    "success": true,
    "message": "Model judgement completed successfully!",
    "judgement": {
      "prompt": "Explain the difference between deep learning and machine learning in simple terms.",
      "finalEvaluation": [
        {
          "model": "modelG",
          "parameters": {
            "accuracy": 9,
            "relevance": 10,
            "fluency": 9,
            "score": 9
          },
          "strengths": [
            "Good structure",
            "Factual accuracy"
          ],
          "weaknesses": [],
          "reasoning": "Clear explanation with good real-world examples."
        }
        // ... evaluations for modelA, modelO, and modelQ
      ],
      "ranking": {
        "orderedModels": [
          "modelA",
          "modelG",
          "modelO",
          "modelQ"
        ],
        "winner": "modelA",
        "reasoning": "Model A provided the most cohesive explanation suited for general audiences while maintaining technical correctness."
      },
      "finalResponse": "..."
    }
  }
  ```

