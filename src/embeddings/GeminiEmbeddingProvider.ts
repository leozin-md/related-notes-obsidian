import { EmbeddingProvider } from "./EmbeddingProvider";

export class GeminiEmbeddingProvider implements EmbeddingProvider {
  model = "gemini-embedding-001";

  constructor(public apiKey: string) {}

  async embed(text: string): Promise<number[]> {
    console.log(`[GeminiEmbeddingProvider] Attempting to embed with key length: ${this.apiKey?.length || 0}`);
    if (!this.apiKey) {
      throw new Error("Gemini API key is missing.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:embedContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: `models/${this.model}`,
        content: {
          parts: [{ text }],
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.embedding.values;
  }
}
