import type { Section, SectionElement } from "../../core/entities/Section";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

function colorClass(prefix: "bg" | "text" | "border", value: string): string {
  if (value === "transparent") {
    return `${prefix}-transparent`;
  }

  return `${prefix}-[${value}]`;
}

function elementBaseClasses(element: SectionElement): string {
  return [
    "absolute",
    "box-border",
    `left-[${element.x}px]`,
    `top-[${element.y}px]`,
    `w-[${element.width}px]`,
    `h-[${element.height}px]`,
    colorClass("bg", element.backgroundColor),
    colorClass("text", element.textColor),
    colorClass("border", element.borderColor),
    `border-[${element.borderWidth}px]`,
    `rounded-[${element.borderRadius}px]`,
  ].join(" ");
}

function exportElementToHtml(element: SectionElement): string {
  const className = elementBaseClasses(element);

  if (element.type === "text") {
    return `  <div class="${className}">${escapeHtml(element.text ?? "")}</div>`;
  }

  if (element.type === "button") {
    return `  <button type="button" class="${className}">${escapeHtml(
      element.text ?? ""
    )}</button>`;
  }

  if (element.type === "input") {
    return `  <input class="${className} px-2 outline-none" placeholder="${escapeAttribute(
      element.placeholder ?? ""
    )}" />`;
  }

  if (element.type === "checkbox") {
    return [
      `  <label class="${className} flex items-center gap-2">`,
      `    <input type="checkbox" />`,
      `    <span>${escapeHtml(element.text ?? "")}</span>`,
      `  </label>`,
    ].join("\n");
  }

  return `  <div class="${className}"></div>`;
}

export function exportSectionToHtml(section: Section): string {
  const sectionClasses = [
    "relative",
    "box-border",
    "overflow-hidden",
    `w-[${section.width}px]`,
    `h-[${section.height}px]`,
    colorClass("bg", section.backgroundColor),
    colorClass("border", section.borderColor),
    `border-[${section.borderWidth}px]`,
    `rounded-[${section.borderRadius}px]`,
  ].join(" ");

  const elementsHtml = section.elements.map(exportElementToHtml).join("\n");

  if (!elementsHtml) {
    return `<section class="${sectionClasses}"></section>`;
  }

  return [`<section class="${sectionClasses}">`, elementsHtml, `</section>`].join(
    "\n"
  );
}