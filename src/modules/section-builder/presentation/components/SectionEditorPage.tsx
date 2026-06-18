"use client";

import { useMemo, useState } from "react";
import { EditorCanvas } from "./EditorCanvas";
import { ExportCodeModal } from "./ExportCodeModal";
import { ExportJsonModal } from "./ExportJsonModal";
import { ImportJsonModal } from "./ImportJsonModal";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { LocalStorageSync } from "./LocalStorageSync";
import { PropertiesPanel } from "./PropertiesPanel";
import { useSectionEditorStore } from "../state/sectionEditorStore";
import type { SectionElementType } from "../../core/entities/Section";
import { exportSectionToHtml } from "../../infrastructure/codegen/exportSectionToHtml";
import { exportSectionToJson } from "../../infrastructure/codegen/exportSectionToJson";
import { importSectionFromJson } from "../../infrastructure/codegen/importSectionFromJson";
import { createSectionJsonFileName } from "../../infrastructure/codegen/createSectionJsonFileName";

const elementButtons: Array<{
  label: string;
  type: SectionElementType;
}> = [
  { label: "Text", type: "text" },
  { label: "Button", type: "button" },
  { label: "Input", type: "input" },
  { label: "Checkbox", type: "checkbox" },
  { label: "Box", type: "box" },
];

export function SectionEditorPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExportJsonModalOpen, setIsExportJsonModalOpen] = useState(false);
  const [isImportJsonModalOpen, setIsImportJsonModalOpen] = useState(false);

  const section = useSectionEditorStore((state) => state.section);
  const addElement = useSectionEditorStore((state) => state.addElement);
  const resetSection = useSectionEditorStore((state) => state.resetSection);
  const replaceSection = useSectionEditorStore((state) => state.replaceSection);

  const exportedCode = useMemo(() => {
    return exportSectionToHtml(section);
  }, [section]);

  const exportedJson = useMemo(() => {
    return exportSectionToJson(section);
  }, [section]);

  const exportedJsonFileName = useMemo(() => {
    return createSectionJsonFileName(section.name);
  }, [section.name]);

  function handleImportJson(jsonValue: string) {
    const importedSection = importSectionFromJson(jsonValue);

    if (!importedSection) {
      return;
    }

    replaceSection(importedSection);
    setIsImportJsonModalOpen(false);
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <LocalStorageSync />

      {!isExportModalOpen && !isExportJsonModalOpen && !isImportJsonModalOpen && (
        <KeyboardShortcuts />
      )}

      {isExportModalOpen && (
        <ExportCodeModal
          code={exportedCode}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {isExportJsonModalOpen && (
        <ExportJsonModal
          fileName={exportedJsonFileName}
          json={exportedJson}
          onClose={() => setIsExportJsonModalOpen(false)}
        />
      )}

      {isImportJsonModalOpen && (
        <ImportJsonModal
          onClose={() => setIsImportJsonModalOpen(false)}
          onImport={handleImportJson}
        />
      )}

      <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">
            sectionbuilder
          </div>
          <div className="text-xs text-slate-500">
            Current section: {section.name || "Untitled section"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetSection}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Reset Section
          </button>

          <button
            type="button"
            onClick={() => setIsImportJsonModalOpen(true)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Import JSON
          </button>

          <button
            type="button"
            onClick={() => setIsExportJsonModalOpen(true)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Export JSON
          </button>

          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Export Code
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="w-64 border-r border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">Elements</h2>

          <div className="mt-4 space-y-2">
            {elementButtons.map((button) => (
              <button
                key={button.type}
                type="button"
                onClick={() => addElement(button.type)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                {button.label}
              </button>
            ))}
          </div>
        </aside>

        <EditorCanvas />

        <PropertiesPanel />
      </div>
    </div>
  );
}