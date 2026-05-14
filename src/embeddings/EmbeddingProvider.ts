export interface EmbeddingProvider {
  model: string;
  embed(text: string): Promise<number[]>;
}
