import { NoteVectorRecord } from "../types";
import { NoteVectorStore } from "./NoteVectorStore";
import { Plugin } from "obsidian";

export class JsonVectorStore implements NoteVectorStore {
  private data: Map<string, NoteVectorRecord> = new Map();
  private storagePath: string;

  constructor(private plugin: Plugin) {
    // Correct way to get the plugin data folder: this.plugin.manifest.id or hardcoded safe path
    this.storagePath = `${this.plugin.app.vault.configDir}/plugins/${this.plugin.manifest.id}/index.json`;
  }

  async init(): Promise<void> {
    console.log("Initializing JsonVectorStore with path:", this.storagePath);
    if (await this.plugin.app.vault.adapter.exists(this.storagePath)) {
      const content = await this.plugin.app.vault.adapter.read(this.storagePath);
      console.log("Found index.json, size:", content.length);
      try {
        const parsed = JSON.parse(content);
        this.data = new Map(Object.entries(parsed));
        console.log("Loaded records:", this.data.size);
      } catch (e) {
        console.error("Failed to parse vector index:", e);
      }
    } else {
        console.log("No index.json found at storagePath.");
    }
  }

  private async save(): Promise<void> {
    const obj = Object.fromEntries(this.data);
    await this.plugin.app.vault.adapter.write(this.storagePath, JSON.stringify(obj, null, 2));
  }

  async upsertNote(record: NoteVectorRecord): Promise<void> {
    this.data.set(record.path, record);
    // Don't auto-save for single updates to avoid I/O bottlenecks
  }

  async upsertNotes(records: NoteVectorRecord[]): Promise<void> {
    for (const record of records) {
      this.data.set(record.path, record);
    }
    await this.flush();
  }

  async flush(): Promise<void> {
    await this.save();
  }

  async getNote(path: string): Promise<NoteVectorRecord | null> {
    const note = this.data.get(path);
    if (!note) {
        console.log("[JsonVectorStore] Note not found for path:", path);
        // Try normalized path (Obsidian sometimes sends paths with/without leading slash or different separators)
        const normalized = path.replace(/\\/g, "/");
        return this.data.get(normalized) || null;
    }
    return note;
  }

  async deleteNote(path: string): Promise<void> {
    this.data.delete(path);
    await this.save();
  }

  async listIndexedPaths(): Promise<string[]> {
    return Array.from(this.data.keys());
  }

  async clear(): Promise<void> {
    this.data.clear();
    await this.save();
  }

  async searchSimilar(
    vector: number[],
    options: { limit: number; excludePath?: string }
  ): Promise<Array<NoteVectorRecord & { score: number }>> {
    const results: Array<NoteVectorRecord & { score: number }> = [];

    for (const record of this.data.values()) {
      if (options.excludePath && record.path === options.excludePath) continue;

      const score = this.cosineSimilarity(vector, record.vector);
      results.push({ ...record, score });
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, options.limit);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
