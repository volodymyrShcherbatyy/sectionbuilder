import type { Section } from "./Section";

export type SectionTemplateCategory =
  | "navigation"
  | "form"
  | "controls"
  | "content";

export type SectionTemplate = {
  id: string;
  name: string;
  description: string;
  category: SectionTemplateCategory;
  section: Section;
};