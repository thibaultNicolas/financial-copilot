import OpenAI from "openai";

// Don't throw at build time so Vercel build can succeed without .env.local.
// The API route checks OPENAI_API_KEY at request time and returns 503 if missing.
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});
