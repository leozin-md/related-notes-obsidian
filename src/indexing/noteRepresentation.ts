export function cleanMarkdown(markdown: string): string {
  let text = markdown;

  // 1. Remove YAML frontmatter
  text = text.replace(/^---[\s\S]*?---/, "");

  // 2. Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, "[CODE BLOCK]");

  // 3. Clean Wikilinks [[Note X|Alias]] -> Alias or Note X
  text = text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2");
  text = text.replace(/\[\[([^\]]+)\]\]/g, "$1");

  // 4. Remove standard links [Text](URL) -> Text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // 5. Remove excessive whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

export function buildNoteRepresentation(input: {
  path: string;
  title: string;
  markdown: string;
}): string {
  const cleanedText = cleanMarkdown(input.markdown);
  const MAX_EMBEDDING_CHARS = 12000;
  const truncated = cleanedText.substring(0, MAX_EMBEDDING_CHARS);

  return `Título: ${input.title}\nCaminho: ${input.path}\n\nConteúdo:\n${truncated}`;
}

export function makePreview(representation: string, limit = 200): string {
    const lines = representation.split("\n");
    const contentStart = lines.findIndex(l => l.startsWith("Conteúdo:"));
    const content = lines.slice(contentStart + 1).join(" ");
    return content.substring(0, limit) + (content.length > limit ? "..." : "");
}
