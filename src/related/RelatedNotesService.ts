import { NoteVectorStore } from "../store/NoteVectorStore";
import { NoteVectorRecord } from "../types";

export class RelatedNotesService {
  constructor(private store: NoteVectorStore) {}

  async getRelatedNotes(path: string, limit = 10): Promise<{
    status: "ok" | "not_indexed" | "error";
    notes: Array<NoteVectorRecord & { score: number }>;
  }> {
    try {
      const current = await this.store.getNote(path);

      if (!current) {
        return {
          status: "not_indexed",
          notes: [],
        };
      }

      const results = await this.store.searchSimilar(current.vector, {
        limit: limit,
        excludePath: path,
      });

      return {
        status: "ok",
        notes: results,
      };
    } catch (e) {
      console.error("RelatedNotesService Error:", e);
      return {
        status: "error",
        notes: [],
      };
    }
  }
}
