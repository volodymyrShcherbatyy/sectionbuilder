import type {
  Section,
  SectionElement,
  SectionElementType,
} from "../../core/entities/Section";

const SECTION_LOCAL_STORAGE_KEY = "sectionbuilder:mvp-0.2:section";

const sectionElementTypes: SectionElementType[] = [
  "text",
  "button",
  "input",
  "checkbox",
  "box",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isSectionElementType(value: unknown): value is SectionElementType {
  return isString(value) && sectionElementTypes.includes(value as SectionElementType);
}

function parseOptionalString(value: unknown): string | undefined {
  return isString(value) ? value : undefined;
}

function parseOptionalBoolean(value: unknown, fallback: boolean): boolean {
  return isBoolean(value) ? value : fallback;
}

function parseSectionElement(value: unknown): SectionElement | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    !isString(value.id) ||
    !isSectionElementType(value.type) ||
    !isString(value.name) ||
    !isNumber(value.x) ||
    !isNumber(value.y) ||
    !isNumber(value.width) ||
    !isNumber(value.height) ||
    !isString(value.backgroundColor) ||
    !isString(value.textColor) ||
    !isString(value.borderColor) ||
    !isNumber(value.borderWidth) ||
    !isNumber(value.borderRadius)
  ) {
    return null;
  }

  return {
    id: value.id,
    type: value.type,
    name: value.name,
    x: Math.max(0, Math.round(value.x)),
    y: Math.max(0, Math.round(value.y)),
    width: Math.max(10, Math.round(value.width)),
    height: Math.max(10, Math.round(value.height)),
    text: parseOptionalString(value.text),
    placeholder: parseOptionalString(value.placeholder),
    backgroundColor: value.backgroundColor,
    textColor: value.textColor,
    borderColor: value.borderColor,
    borderWidth: Math.max(0, Math.round(value.borderWidth)),
    borderRadius: Math.max(0, Math.round(value.borderRadius)),
    isVisible: parseOptionalBoolean(value.isVisible, true),
    isLocked: parseOptionalBoolean(value.isLocked, false),
  };
}

export function parseSection(value: unknown): Section | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    !isString(value.id) ||
    !isString(value.name) ||
    !isNumber(value.width) ||
    !isNumber(value.height) ||
    !isString(value.backgroundColor) ||
    !isString(value.borderColor) ||
    !isNumber(value.borderWidth) ||
    !isNumber(value.borderRadius) ||
    !Array.isArray(value.elements)
  ) {
    return null;
  }

  const elements = value.elements
    .map(parseSectionElement)
    .filter((element): element is SectionElement => element !== null);

  const width = Math.max(20, Math.round(value.width));
  const height = Math.max(20, Math.round(value.height));

  return {
    id: value.id,
    name: value.name,
    width,
    height,
    backgroundColor: value.backgroundColor,
    borderColor: value.borderColor,
    borderWidth: Math.max(0, Math.round(value.borderWidth)),
    borderRadius: Math.max(0, Math.round(value.borderRadius)),
    elements: elements.map((element) => {
      const nextWidth = Math.min(element.width, width);
      const nextHeight = Math.min(element.height, height);

      return {
        ...element,
        width: nextWidth,
        height: nextHeight,
        x: Math.min(element.x, Math.max(0, width - nextWidth)),
        y: Math.min(element.y, Math.max(0, height - nextHeight)),
      };
    }),
  };
}

export function saveSectionToLocalStorage(section: Section): void {
  window.localStorage.setItem(
    SECTION_LOCAL_STORAGE_KEY,
    JSON.stringify(section)
  );
}

export function loadSectionFromLocalStorage(): Section | null {
  const rawValue = window.localStorage.getItem(SECTION_LOCAL_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return parseSection(JSON.parse(rawValue));
  } catch {
    return null;
  }
}

export function clearSectionLocalStorage(): void {
  window.localStorage.removeItem(SECTION_LOCAL_STORAGE_KEY);
}