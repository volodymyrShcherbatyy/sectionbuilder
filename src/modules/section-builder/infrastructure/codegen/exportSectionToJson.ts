import type { Section } from "../../core/entities/Section";

export function exportSectionToJson(section: Section): string {
  return JSON.stringify(section, null, 2);
}