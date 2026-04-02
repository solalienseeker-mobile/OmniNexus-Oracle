import axios from "axios";

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama2";

export interface OllamaResponse {
  completion: string;
  metadata?: Record<string, unknown>;
}

export async function runOllamaPrompt(prompt: string): Promise<OllamaResponse> {
  const response = await axios.post(
    `${OLLAMA_HOST}/v1/models/${OLLAMA_MODEL}/predict`,
    {
      prompt,
      temperature: 0.2,
      top_p: 0.95,
      max_tokens: 512,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 120000,
    }
  );

  if (!response.data) {
    throw new Error("Empty response from Ollama");
  }

  const completion = (response.data as any).completion || "";

  return {
    completion,
    metadata: response.data,
  };
}
