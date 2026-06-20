"use client";

import { useEffect, useState } from "react";
import type { SectionTemplate } from "../../core/entities/SectionTemplate";

type TemplatesModalProps = {
  templates: SectionTemplate[];
  onClose: () => void;
  onUseTemplate: (template: SectionTemplate) => void;
  onInsertTemplate: (template: SectionTemplate) => void;
};

type TemplateCategoryFilter = SectionTemplate["category"] | "all";

function formatCategory(category: SectionTemplate["category"]): string {
  if (category === "navigation") {
    return "Navigation";
  }

  if (category === "form") {
    return "Form";
  }

  if (category === "controls") {
    return "Controls";
  }

  return "Content";
}

const categoryFilters: Array<{
  label: string;
  value: TemplateCategoryFilter;
}> = [
  { label: "All", value: "all" },
  { label: "Navigation", value: "navigation" },
  { label: "Form", value: "form" },
  { label: "Controls", value: "controls" },
  { label: "Content", value: "content" },
];

export function TemplatesModal({
  templates,
  onClose,
  onUseTemplate,
  onInsertTemplate,
}: TemplatesModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const [activeCategory, setActiveCategory] =
    useState<TemplateCategoryFilter>("all");

  const visibleTemplates =
    activeCategory === "all"
      ? templates
      : templates.filter((template) => template.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-6">
      <div className="flex max-h-[84vh] w-full max-w-5xl flex-col rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Templates
            </h2>
            <p className="text-xs text-slate-500">
              Choose a predefined section template.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-4">
          <div className="mb-4 flex flex-wrap gap-2">
            {categoryFilters.map((filter) => {
              const isActive = activeCategory === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveCategory(filter.value)}
                  className={[
                    "rounded-md border px-3 py-1.5 text-sm font-medium",
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {visibleTemplates.map((template) => (
              <article
                key={template.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {template.name}
                    </h3>

                    <div className="mt-1 text-xs font-medium uppercase text-slate-500">
                      {formatCategory(template.category)}
                    </div>
                  </div>

                  <div className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    {template.section.width} × {template.section.height}
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-600">
                  {template.description}
                </p>

                <div className="mt-4 rounded-lg bg-slate-50 p-3">
                  <div className="text-xs font-semibold uppercase text-slate-500">
                    Preview summary
                  </div>

                  <div className="mt-2 text-xs text-slate-600">
                    Elements: {template.section.elements.length}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {template.section.elements.map((element) => (
                      <span
                        key={element.id}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
                      >
                        {element.type}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onInsertTemplate(template)}
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Insert
                  </button>

                  <button
                    type="button"
                    onClick={() => onUseTemplate(template)}
                    className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Replace
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}