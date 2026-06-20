import type { Section } from "../../core/entities/Section";
import type { SectionTemplate } from "../../core/entities/SectionTemplate";
import { parseSection } from "../storage/sectionLocalStorage";

export function cloneSectionTemplate(template: SectionTemplate): Section | null {
  const clonedSection: Section = {
    ...template.section,
    id: "section-root",
    elements: template.section.elements.map((element) => ({
      ...element,
      id: `element-${crypto.randomUUID()}`,
    })),
  };

  return parseSection(clonedSection);
}