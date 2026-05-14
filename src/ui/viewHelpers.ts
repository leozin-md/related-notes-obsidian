export type ScoreTone = "high" | "medium" | "low";

export function formatScore(score: number): string {
  const bounded = Math.max(0, Math.min(1, score));
  return `${Math.round(bounded * 100)}%`;
}

export function getScoreTone(score: number): ScoreTone {
  if (score >= 0.8) return "high";
  if (score >= 0.6) return "medium";
  return "low";
}

export function pathToWikilink(path: string, title: string): string {
  const withoutExtension = path.replace(/\.md$/i, "");
  const basename = withoutExtension.split("/").pop() ?? withoutExtension;

  if (withoutExtension === title || (basename === title && !withoutExtension.includes("/"))) {
    return `[[${withoutExtension}]]`;
  }

  return `[[${withoutExtension}|${title}]]`;
}
