import { ItemView, WorkspaceLeaf, TFile } from "obsidian";
import { RelatedNotesService } from "../related/RelatedNotesService";
import { NoteVectorRecord } from "../types";

export const RELATED_NOTES_VIEW_TYPE = "related-notes-view";

export class RelatedNotesView extends ItemView {
  private service: RelatedNotesService | null = null;
  private currentFile: TFile | null = null;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return RELATED_NOTES_VIEW_TYPE;
  }

  getDisplayText(): string {
    return "Related Notes";
  }

  getIcon(): string {
    return "links-coming-in";
  }

  setService(service: RelatedNotesService) {
    this.service = service;
  }

  async onOpen() {
    this.updateView();
  }

  setCurrentFile(file: TFile | null) {
    this.currentFile = file;
    this.updateView();
  }

  async updateView() {
    const container = this.containerEl.children[1];
    container.empty();

    if (!this.currentFile) {
      container.createEl("div", { text: "Open a Markdown note to see related notes.", cls: "pane-empty" });
      return;
    }

    if (!this.service) return;

    container.createEl("h4", { text: `Related to: ${this.currentFile.basename}` });
    
    const loading = container.createEl("div", { text: "Loading related notes...", cls: "related-notes-loading" });

    const result = await this.service.getRelatedNotes(this.currentFile.path);
    console.log("[RelatedNotesView] Search result for", this.currentFile.path, ":", result);
    loading.remove();

    if (result.status === "not_indexed") {
      const div = container.createDiv({ cls: "related-notes-empty" });
      div.createEl("p", { text: "This note has not been indexed yet." });
      return;
    }

    if (result.status === "error") {
      container.createEl("div", { text: "Error loading related notes.", cls: "related-notes-error" });
      return;
    }

    if (result.notes.length === 0) {
      container.createEl("div", { text: "No related notes found.", cls: "related-notes-empty" });
      return;
    }

    const list = container.createEl("ul", { cls: "related-notes-list" });

    for (const note of result.notes) {
      const li = list.createEl("li", { cls: "related-notes-item" });
      const link = li.createEl("a", { text: note.title, cls: "related-notes-link" });
      li.createEl("span", { text: ` (${(note.score * 100).toFixed(1)}%)`, cls: "related-notes-score" });
      
      link.onclick = (e) => {
        e.preventDefault();
        this.app.workspace.openLinkText(note.path, "", false);
      };
    }
  }
}
