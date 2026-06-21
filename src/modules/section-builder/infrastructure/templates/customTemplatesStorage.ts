import type { Section } from "../../core/entities/Section";
import type {
  SectionTemplate,
  SectionTemplateCategory,
} from "../../core/entities/SectionTemplate";
import { parseSection } from "../storage/sectionLocalStorage";

const CUSTOM_TEMPLATES_LOCAL_STORAGE_KEY =
  "sectionbuilder:mvp-0.6:custom-templates";

const templateCategories: SectionTemplateCategory[] = [
  "navigation",
  "form",
  "controls",
  "content",
];

type CreateCustomSectionTemplateInput = {
  section: Section;
  name: string;
  description: string;
  category: SectionTemplateCategory;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isSectionTemplateCategory(
  value: unknown
): value is SectionTemplateCategory {
  return (
    isString(value) &&
    templateCategories.includes(value as SectionTemplateCategory)
  );
}

function parseCustomSectionTemplate(value: unknown): SectionTemplate | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    !isString(value.id) ||
    !isString(value.name) ||
    !isString(value.description) ||
    !isSectionTemplateCategory(value.category)
  ) {
    return null;
  }

  const section = parseSection(value.section);

  if (!section) {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    description: value.description,
    category: value.category,
    section,
  };
}

export function createCustomSectionTemplate({
  section,
  name,
  description,
  category,
}: CreateCustomSectionTemplateInput): SectionTemplate | null {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return null;
  }

  const clonedSection: Section = {
    ...section,
    id: "section-root",
    name: trimmedName,
    elements: section.elements.map((element) => ({
      ...element,
      id: `template-element-${crypto.randomUUID()}`,
    })),
  };

  const parsedSection = parseSection(clonedSection);

  if (!parsedSection) {
    return null;
  }

  return {
    id: `custom-template-${crypto.randomUUID()}`,
    name: trimmedName,
    description: description.trim(),
    category,
    section: parsedSection,
  };
}

export function loadCustomSectionTemplates(): SectionTemplate[] {
  const rawValue = window.localStorage.getItem(
    CUSTOM_TEMPLATES_LOCAL_STORAGE_KEY
  );

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .map(parseCustomSectionTemplate)
      .filter((template): template is SectionTemplate => template !== null);
  } catch {
    return [];
  }
}

export function saveCustomSectionTemplates(
  templates: SectionTemplate[]
): void {
  window.localStorage.setItem(
    CUSTOM_TEMPLATES_LOCAL_STORAGE_KEY,
    JSON.stringify(templates)
  );
}

export function addCustomSectionTemplate(
  template: SectionTemplate
): SectionTemplate[] {
  const templates = loadCustomSectionTemplates();
  const nextTemplates = [...templates, template];

  saveCustomSectionTemplates(nextTemplates);

  return nextTemplates;
}

export function deleteCustomSectionTemplate(
  templateId: string
): SectionTemplate[] {
  const templates = loadCustomSectionTemplates();
  const nextTemplates = templates.filter(
    (template) => template.id !== templateId
  );

  saveCustomSectionTemplates(nextTemplates);

  return nextTemplates;
}