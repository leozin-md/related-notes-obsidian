export type NoteVectorRecord = {
  path: string;
  title: string;
  folder: string;
  preview: string;
  contentHash: string;
  mtime: number;
  embeddingModel: string;
  vector: number[];
  updatedAt: number;
};

export interface RelatedNotesSettings {
  geminiApiKey: string;
  relatedNotesLimit: number;
}

export const DEFAULT_SETTINGS: RelatedNotesSettings = {
  geminiApiKey: "",
  relatedNotesLimit: 10,
};
