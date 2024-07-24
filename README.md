# GenUIne CRS

## A Conversational Recommender with RAG

In this demo, we show an adaptable proof-of-concept web application for a conversational recommender system which supports domain-specific user interface (UI) elements. The application uses a Large Language Model (LLM) for preference elicitation, content-based recommendation, and justification of the outcomes in different explanation styles. Through this interactive example, we aim to highlight three often overlooked aspects in current research on conversational recommender systems: (i) chatbots can go beyond purely text-based interaction patterns by implementing custom UI elements; (ii) function calling is a powerful feature to develop flexible, semi-structured interfaces with LLMs; (iii) due to their general knowledge and RAG extensibility, LLMs can be employed as convincing content-based recommenders to rapidly develop and test interfaces and explanation styles.

## Setup

### Clone the repository

```bash
git clone https://github.com/imec-smit-vub-mep-rec/conversational-recommender-system-rag
cd conversational-recommender-system-rag
```

### Create an .env file

Rename the `.env.example` file to `.env` and fill in the required variables (see below for the database setup).

### Create a Redis KV store

We use a KV store to save the user preferences. We choose for a different database to make the distinction with the embeddings in the Postgres database.
In this demo, we will use the Redis KV store from [Vercel](https://vercel.com/docs/storage/vercel-kv). However, feel free to use any other KV store.

### Create a Postgres database

In this demo, we use the Postgres database from [Vercel](https://vercel.com/docs/storage/vercel-postgres). However, feel free to use any other Postgres database.
Add the connection string to the `.env` file.

### Install dependencies

```bash
pnpm install
```

### Initialize the database

```bash
pnpm db:migrate
```

### Optional: Add custom data

1. Place a csv file with header in the `lib/data` folder.
2. Reference the file in `app/init/route.ts`
3. Visit https://localhost:3000/init once to load in the data

### Optional: Edit user preferences

Visit https://localhost:3000/preferences page and add some user interactions as an array.

## Run

```bash
pnpm run dev
```

## Optional: Browse database contents

```bash
pnpm db:studio
```

# References

This project is based on the starter project for the Vercel AI SDK [Retrieval-Augmented Generation (RAG) guide](https://sdk.vercel.ai/docs/guides/rag-chatbot).

This project uses the following stack:

- [Next.js](https://nextjs.org) 14 (App Router)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [OpenAI](https://openai.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Postgres](https://www.postgresql.org/) with [ pgvector ](https://github.com/pgvector/pgvector)
- [shadcn-ui](https://ui.shadcn.com) and [TailwindCSS](https://tailwindcss.com) for styling
