# JudgeLM - Multi-Model AI Evaluator

JudgeLM is a backend-based multi-model evaluation API service. It takes a single user prompt, sends it in parallel to four leading AI models (from Google, Anthropic, OpenAI, and Groq), and uses OpenAI's judging capabilities to score, rank, and synthesize the final response into a structured format. 

The service includes full user authentication, session security, database persistence with MongoDB, and Redis-backed API rate limiting.

---

## Key Features

- **Parallel Model Querying**: Query four leading frontier and open-weight models concurrently.
- **Automated Judging System**: Employs a dedicated judging model (`gpt-5-mini`) to evaluate each response across accuracy, relevance, and fluency metrics.
- **Strict Structured Outputs**: Utilizes Zod schemas and OpenAI's structured outputs parsing (`responses.parse`) to guarantee consistent JSON response payloads.
- **User Authentication**: Secure token-based user signup, login, logout, and profile endpoints using JWT, bcryptjs, and HTTP-only cookies.
- **Redis Rate Limiting**: Limit-controlled access (5 requests per day per user) to protect API resources from abuse.
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

## UI Demonstration

Here is a visual overview of the JudgeLM Gateway user interface during operation:

### 1. Active Evaluation Pipeline
Shows the evaluator console terminal logging parallel node processes in real time.
![Active Pipeline](https://github.com/user-attachments/assets/f9f441bc-4665-4022-9d0f-706459dc6968)

### 2. Multi-Model Completions and Evaluations
Details performance metrics (Accuracy, Relevance, Fluency, Overall Score) along with isolated strengths, weaknesses, and reasoning for each active LLM node.
![Multi-Model Evaluations 1](https://github.com/user-attachments/assets/ae041b86-5203-4228-8c66-aafdce895ecc)
![Multi-Model Evaluations 2](https://github.com/user-attachments/assets/685ab1d6-2d47-4887-87cf-350bc7270a23)

### 3. Decision Matrix & Synthesized Optimal Response
Visualizes the final ranking decision reasoning and shows the consolidated unified response.
![Decision Matrix](https://github.com/user-attachments/assets/c51992ed-390a-4961-8205-b61d967fc169)

---

## Project Structure

```
MultiModelRes/
├── src/
│   ├── index.js                     # Server entry point
│   ├── app.js                       # Express application configuration & middleware
│   ├── db/
│   │   └── db.js                    # MongoDB connection initialization
│   ├── config/
│   │   └── redis.js                 # Redis client configuration
│   ├── models/
│   │   └── user.model.js            # User mongoose schema with bcrypt & JWT methods
│   ├── routes/
│   │   ├── evaluationRoutes.js      # Router definitions for evaluation endpoints (protected)
│   │   └── userRoutes.js            # Router definitions for user login/signup endpoints
│   ├── controllers/
│   │   ├── evaluationController.js # Handles request validation and parallel execution flow
│   │   └── userController.js        # Handles authentication controller actions
│   ├── middlewares/
│   │   ├── auth.middleware.js       # Verifies JWT access tokens
│   │   └── rateLimit.middleware.js  # Redis-backed rate limiting middleware
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
├── index.js                         # Root entrypoint (forwards to src/index.js)
├── .env.example                     # Reference for environment variables configuration
├── package.json                     # Express dependencies, scripts (start, dev)
└── README.md                        # Documentation
```

---

## Requirements

- **Node.js**: Version 18.x or newer
- **MongoDB**: Active connection URI
- **Redis**: Active connection URI for rate limiting
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
   PORT=3001
   MONGODB_URI=your_mongodb_connection_uri_here
   ACCESS_TOKEN_SECRET_KEY=your_jwt_access_secret_here
   REFRESH_TOKEN_SECRET_KEY=your_jwt_refresh_secret_here
   REDIS_URL=your_redis_connection_url_here
   CLIENTS_URL=http://localhost:5173
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

### 2. User Authentication (Public)
- **POST `/api/v1/user/register`**: Registers a new user.
  - **Body**: `{ "fullname": "Jane Doe", "email": "jane@example.com", "password": "securepassword" }`
- **POST `/api/v1/user/login`**: Authenticates a user and sets secure cookies (`accessToken`, `refreshToken`).
  - **Body**: `{ "email": "jane@example.com", "password": "securepassword" }`

### 3. User Authentication (Secured - JWT Required)
- **POST `/api/v1/user/logout`**: Unsets cookies and unassigns the user session.
- **GET `/api/v1/user/@me`**: Fetches the authenticated user profile details.

### 4. Evaluate Prompt (Secured - JWT Required & Rate Limited)
- **Endpoint**: `POST /api/v1/evaluate`
- **Rate Limit**: Max 5 requests per day.
- **Description**: Submits the prompt to all models, evaluates them, and returns a ranking and synthesized best response.
- **Request Body**:
  ```json
  {
    "prompt": "Discuss Postgres sharding vs MongoDB sharding."
  }
  ```
