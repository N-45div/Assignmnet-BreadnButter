# Talent Matchmaking Engine

This is a Next.js application that serves as a talent matchmaking engine. It allows clients to find the best creative talent for their projects by providing a simple interface to describe their needs in a "creative brief." The application then uses a powerful AI-powered backend to rank and recommend the most suitable talent from a large database.

Demo Video 


https://github.com/user-attachments/assets/838f5276-d2af-4829-982d-ffbaec235278


## Proposal

### Task Selected

Project 01: Talent Matchmaking Engine.

### Approach & Architecture

The goal is to build a full-stack application that simplifies the process of finding creative talent. The core of the application is a hybrid matching system that combines AI-powered semantic search with rule-based filtering to provide accurate and relevant talent recommendations.

- **Frontend:** A modern, responsive interface built with Next.js and React. It features a landing page with an animated hero section to engage users, a matchmaking page to enter creative briefs, and detailed talent profile pages.
- **Backend:** A serverless backend using Next.js API Routes. This provides a scalable and cost-effective solution for handling API requests.
- **AI & Embeddings:** The application leverages Cohere's powerful language models to generate vector embeddings for talent profiles and creative briefs. This enables semantic search, which goes beyond simple keyword matching to understand the underlying meaning of the text.
- **Data:** The talent data is stored in a JSON file (`dataset/Talent Profiles.json`), and the pre-computed embeddings are stored in `app/api/matching/talent_embeddings.json`.

### Tech Stack

- **Framework:** Next.js (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Cohere API for generating text embeddings

### AI/LLM Use

The primary use of AI/LLM is for semantic search. Here's how it works:

1.  **Pre-computation:** The `scripts/precompute-embeddings.ts` script reads all the talent profiles and uses the Cohere API to generate a vector embedding for each profile's key information (e.g., summary, skills, style). These embeddings are stored in a JSON file.
2.  **Runtime:** When a user submits a creative brief, the backend generates an embedding for the brief in real-time using the Cohere API.
3.  **Semantic Search:** The application then calculates the cosine similarity between the brief's embedding and all the pre-computed talent embeddings. This provides a "semantic score" for each talent, indicating how well their profile matches the creative brief on a semantic level.
4.  **Hybrid Scoring:** The semantic score is combined with a rule-based score (e.g., based on location, budget, skills) to generate a final match score. This hybrid approach provides more accurate and explainable recommendations.

## Taking it to Production

As a founder, here's how I would take this feature to production:

1.  **Infrastructure:**
    - **Database:** Replace the JSON files with a scalable database like PostgreSQL with the `pgvector` extension for efficient vector similarity search.
    - **Deployment:** Deploy the application on Vercel for the frontend and a separate, scalable service (e.g., AWS Lambda or Google Cloud Run) for the backend API to handle potentially long-running embedding generation requests.
    - **Caching:** Implement a caching layer (e.g., Redis) to store frequently accessed data and reduce latency.

2.  **Monitoring & Analytics:**
    - **Logging:** Set up a centralized logging system (e.g., Datadog, Sentry) to monitor for errors and performance issues.
    - **Analytics:** Integrate a product analytics tool (e.g., Mixpanel, Amplitude) to track user behavior and gather insights for future improvements.

3.  **CI/CD:**
    - **Automation:** Set up a CI/CD pipeline (e.g., GitHub Actions) to automate testing and deployment.

## Future Work

- **Improve the matching algorithm:**
    - **Feedback Loop:** Use the user feedback (likes/dislikes) to fine-tune the matching algorithm using techniques like reinforcement learning.
    - **More Sophisticated Scoring:** Incorporate more factors into the rule-based scoring, such as availability, response time, and client reviews.
- **Enhance the user experience:**
    - **Real-time Search:** Implement a real-time search feature that updates the results as the user types their creative brief.
    - **Personalization:** Allow users to create accounts and save their searches and favorite talent.
- **Scale the system:**
    - **Batch Processing:** For a very large number of talent profiles, use a batch processing system (e.g., AWS Batch) to pre-compute the embeddings.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm
- A Cohere API key

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/N-45div/Assignmnet-BreadnButter.git
    cd Assignmnet-BreadnButter
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up your environment variables:**

    Create a file named `.env.local` in the root of the project and add your Cohere API key:

    ```
    COHERE_API_KEY=your-cohere-api-key
    ```

4.  **Pre-compute the talent embeddings:**

    Before you can start finding matches, you need to generate the vector embeddings for the talent database. Run the following command:

    ```bash
    npm run precompute-embeddings
    ```

    This will create a file at `app/api/matching/talent_embeddings.json` that contains the pre-computed embeddings.

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
