import { NoteVectorRecord } from "../types";

export interface NoteVectorStore {
  init(): Promise<void>;
  upsertNote(record: NoteVectorRecord): Promise<void>;
  upsertNotes(records: NoteVectorRecord[]): Promise<void>;
  getNote(path: string): Promise<NoteVectorRecord | null>;
  deleteNote(path: string): Promise<void>;
  searchSimilar(
    vector: number[],
    options: {
      limit: number;
      excludePath?: string;
    }
  ): Promise<Array<NoteVectorRecord & { score: number }>>;
  listIndexedPaths(): Promise<string[]>;
  clear(): Promise<void>;
  flush(): Promise<void>;
}
