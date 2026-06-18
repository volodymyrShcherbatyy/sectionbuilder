export function createSectionJsonFileName(sectionName: string): string {
  const normalizedName = sectionName
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, "-")
    .replaceAll(/[^a-z0-9-_]/g, "");

  const safeName = normalizedName || "section";

  return `${safeName}.json`;
}