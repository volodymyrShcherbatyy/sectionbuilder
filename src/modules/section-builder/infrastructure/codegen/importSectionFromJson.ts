import type { Section } from "../../core/entities/Section";
import { parseSection } from "../storage/sectionLocalStorage";

export function importSectionFromJson(jsonValue: string): Section | null {
  try {
    return parseSection(JSON.parse(jsonValue));
  } catch {
    return null;
  }
}