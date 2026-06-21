"use client";

import { useEffect, useState } from "react";
import type { SectionTemplateCategory } from "../../core/entities/SectionTemplate";

export type SaveTemplateFormValues = {
  name: string;
  description: string;
  category: SectionTemplateCategory;
};

type SaveTemplateModalProps = {
  defaultName: string;
  onClose: () => void;
  onSave: (values: SaveTemplateFormValues) => void;
};

const categoryOptions: Array<{
  label: string;
  value: SectionTemplateCategory;
}> = [
  { label: "Navigation", value: "navigation" },
  { label: "Form", value: "form" },
  { label: "Controls", value: "controls" },
  { label: "Content", value: "content" },
];

export function SaveTemplateModal({
  defaultName,
  onClose,
  onSave,
}: SaveTemplateModalProps) {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState("");
  const [category, setCategory] =
    useState<SectionTemplateCategory>("content");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  function handleSave() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage("Template name is required.");
      return;
    }

    setErrorMessage(null);

    onSave({
      name: trimmedName,
      description,
      category,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-6">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Save Template
            </h2>
            <p className="text-xs text-slate-500">
              Save the current section as a reusable custom template.
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

        <div className="space-y-4 p-4">
          <div>
            <label className="text-xs font-medium text-slate-600">
              Template name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setErrorMessage(null);
              }}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
              placeholder="My custom template"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-1 min-h-24 w-full resize-none rounded-md border border-slate-300 px-2 py-1.5 text-sm"
              placeholder="Short description for this template..."
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">
              Category
            </label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as SectionTemplateCategory)
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {errorMessage && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}