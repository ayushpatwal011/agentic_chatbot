# Agentic Chatbot 

An advanced Agentic Chatbot built with a **React + Vite** frontend and a **Node.js Microservices** backend. The backend utilizes LangGraph, Google Gemini (Gemini Pro), Groq, Tavily Search, Qdrant Vector DB, Redis (for rate limiting and sessions), and MongoDB.

---

## Project Structure

The project is organized as a monorepo:

```text
├── frontend/                   # React + Vite frontend application
└── backend/                    # Backend microservices workspace
    ├── gateway/                # API Gateway (Express Proxy) on Port 8000
    ├── shared/                 # Shared utilities (Redis connection)
    └── services/
        ├── auth/               # Authentication Service (Firebase + MongoDB)
        ├── chat/               # Chat/Conversation Service (MongoDB)
        └── agent/              # LangGraph Agent reasoning service
```

---

## Local Development Setup

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **MongoDB** (Local instance or MongoDB Atlas cluster)
* **Redis** (Local instance or Docker container)

### Step 1: Backend Setup
1. Open a terminal and navigate to the `backend` folder.
2. Install all dependencies for the root and microservices:
   ```bash
   npm install
   npm install --prefix gateway
   npm install --prefix services/auth
   npm install --prefix services/chat
   npm install --prefix services/agent
   ```
3. Set up the local environment variables. Create a `.env` file in each respective directory:

   * **`backend/gateway/.env`**:
     ```env
     PORT=8000
     AUTH_SERVICE=http://localhost:8001
     CHAT_SERVICE=http://localhost:8002
     AGENT_SERVICE=http://localhost:8003
     FRONTEND_URL=http://localhost:5173
     REDIS_URL=redis://localhost:6379
     ```

   * **`backend/services/auth/.env`**:
     ```env
     AUTH_PORT=8001
     MONGODB_URI=mongodb+srv://your-mongodb-url/auth
     REDIS_URL=redis://localhost:6379
     NODE_ENV=local
     ```
     *Note: Ensure your Firebase credentials file is placed at `backend/services/auth/serviceAccountKey.json`.*

   * **`backend/services/chat/.env`**:
     ```env
     CHAT_PORT=8002
     MONGODB_URI=mongodb+srv://your-mongodb-url/chat
     ```

   * **`backend/services/agent/.env`**:
     ```env
     AGENT_PORT=8003
     MONGODB_URI=mongodb+srv://your-mongodb-url/agent
     REDIS_URL=redis://localhost:6379
     CHAT_SERVICE=http://localhost:8002
     GROQ_API_KEY=your-groq-key
     GOOGLE_API_KEY=your-gemini-key
     TAVILY_API_KEY=your-tavily-key
     OPENROUTER_API_KEY=your-openrouter-key
     AWS_REGION=eu-north-1
     AWS_ACCESS_KEY_ID=your-aws-id
     AWS_SECRET_ACCESS_KEY=your-aws-secret
     AWS_BUCKET_NAME=your-s3-bucket
     QDRANT_API_KEY=your-qdrant-key
     QDRANT_URL=your-qdrant-url
     ```

4. Start the backend services in development mode:
   ```bash
   npm run dev
   ```
   *(This starts local Redis via Docker Compose if running, and concurrently spins up all 4 servers).*

### Step 2: Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder:
   ```env
   VITE_FIREBASE_API_KEY=your-firebase-client-api-key
   VITE_SERVER_URL=http://localhost:8000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *(Access the app at `http://localhost:5173`).*

---

## Production Deployment (Recommended Strategy)

To save hosting costs and simplify management, the backend is configured to deploy as a **single monolithic Docker container** on Render (running all 4 services concurrently), while the frontend is deployed to Vercel.

### 1. Backend Deployment (Render)

1. Create a **Redis instance** on Render (or use **Upstash Redis**). Copy the secure connection string starting with **`rediss://`** (e.g., `rediss://default:password@endpoint.upstash.io:6379`).
2. Create a new **Web Service** on Render and link your GitHub repository.
3. Configure the following project settings:
   * **Root Directory:** `backend`
   * **Runtime:** `Docker`
   * **Instance Type:** Free (or any tier)
4. Go to the **Environment** tab and add your environment variables:
   * `PORT` = `8000`
   * `NODE_ENV` = `production`
   * `REDIS_URL` = *[Your Upstash or Render secure Redis URL starting with `rediss://`]*
   * `FRONTEND_URL` = *[Your deployed Vercel URL, e.g. `https://your-app.vercel.app`]* (No trailing slash)
   * `AUTH_SERVICE` = `http://localhost:8001`
   * `CHAT_SERVICE` = `http://localhost:8002`
   * `AGENT_SERVICE` = `http://localhost:8003`
   * `AUTH_PORT` = `8001`
   * `CHAT_PORT` = `8002`
   * `AGENT_PORT` = `8003`
   * `MONGODB_URI` = *[Your MongoDB Atlas connection URL, e.g. `mongodb+srv://.../`]* *(The microservices append `/auth`, `/chat`, `/agent` automatically)*
   * *[Add S3, Qdrant, and LLM API Keys as defined in local setup]*
5. Under the same **Environment** tab, upload your Firebase service account key:
   * Click **Add Secret File**.
   * **Filename:** `services/auth/serviceAccountKey.json`
   * **Contents:** Paste the contents of your local `serviceAccountKey.json` file.
6. Click **Save Changes / Deploy**.

### 2. Frontend Deployment (Vercel)

1. Create a new project in **Vercel** and select your GitHub repository.
2. Edit **Project Settings**:
   * **Root Directory:** `frontend`
   * **Framework Preset:** `Vite`
3. Expand **Environment Variables** and add:
   * `VITE_SERVER_URL` = `https://your-render-gateway-url.onrender.com/api` (Remember to append `/api` to the end)
   * `VITE_FIREBASE_API_KEY` = *[Your Client-side Firebase API Key]*
4. Click **Deploy**.

### 3. Firebase Authorized Domains
1. Go to the **Firebase Console** -> **Authentication** -> **Settings** tab.
2. Select **Authorized Domains**.
3. Add your production Vercel domain name (e.g. `your-app.vercel.app`, *without `https://`*).

---

## Code & System Workflows

The following describes how data and requests flow through the application.

### 1. Authentication & Session Flow
```mermaid
sequenceDiagram
    participant Browser as React Frontend
    participant Gateway as API Gateway (8000)
    participant Auth as Auth Service (8001)
    participant Firebase as Firebase Admin
    participant MongoDB as MongoDB
    participant Redis as Redis Cache

    Browser->>Browser: Trigger Google SignIn via Firebase Client SDK
    Browser->>Gateway: POST /api/auth/login { token }
    Gateway->>Auth: Proxy request (headers unchanged)
    Auth->>Firebase: Verify Google ID token
    Firebase-->>Auth: Token valid (claims & uid)
    Auth->>MongoDB: Upsert user details (name, email, avatar)
    MongoDB-->>Auth: User record
    Auth->>Redis: Set session:uuid -> JSON(user) [TTL 7 days]
    Auth-->>Gateway: HTTP 200 + User JSON + Set-Cookie (session=uuid)
    Gateway-->>Browser: Pass response + cookie back to browser
```

### 2. Request Interception & Proxy Flow
For any protected endpoints (e.g. `/api/chat/*`, `/api/agent/*`):
```mermaid
sequenceDiagram
    participant Browser as React Frontend
    participant Gateway as API Gateway (8000)
    participant Redis as Redis Cache
    participant Service as Chat/Agent Service

    Browser->>Gateway: GET /api/chat/get-conversation (includes Cookie: session=uuid)
    Gateway->>Gateway: Run protect middleware
    Gateway->>Redis: Get session:uuid
    alt Session not found / expired
        Redis-->>Gateway: Null
        Gateway-->>Browser: HTTP 401 Unauthorized
    else Session valid
        Redis-->>Gateway: JSON(user)
        Gateway->>Gateway: Inject User ID / details into proxy headers
        Gateway->>Service: Proxy request to target service with auth headers
        Service-->>Gateway: Return response data
        Gateway-->>Browser: Return response data
    end
```

### 3. Agentic Workflow (LangGraph)
When the user sends a message to the Agent service:
1. **Rate Limiting:** The Agent service checks user query usage limits in **Redis** via the `checkAgentLimit` middleware.
2. **LangGraph Pipeline:** If under limits, the input is passed to the compiled LangGraph workflow:
   * **Router Node:** Decides the nature of the request based on input (code, search, database, etc.).
   * **Tools Execution:**
     * If search query is required, triggers **Tavily Web Search**.
     * If document references are needed, queries the **Qdrant Vector Database** (embeddings).
     * Files (PDFs, Images, PPTs) are stored and fetched from **AWS S3**.
   * **LLM Node:** Passes compiled context, history, and tool outputs to **Google Gemini** (via LangChain) to generate the final response.
3. **Response:** Saves details to **MongoDB** and streams or sends the text and generated artifacts back to the Gateway.

