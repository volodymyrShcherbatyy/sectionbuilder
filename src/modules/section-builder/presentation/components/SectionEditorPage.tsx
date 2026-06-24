"use client";

import { useMemo, useState } from "react";
import { AlignmentToolbar } from "./AlignmentToolbar";
import { EditorCanvas } from "./EditorCanvas";
import { ExportCodeModal } from "./ExportCodeModal";
import { ExportJsonModal } from "./ExportJsonModal";
import { ImportJsonModal } from "./ImportJsonModal";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { LocalStorageSync } from "./LocalStorageSync";
import { RightInspectorPanel } from "./RightInspectorPanel";
import {
  SaveTemplateModal,
  type SaveTemplateFormValues,
} from "./SaveTemplateModal";
import { TemplatesModal } from "./TemplatesModal";
import { useSectionEditorStore } from "../state/sectionEditorStore";
import type { SectionElementType } from "../../core/entities/Section";
import type { SectionTemplate } from "../../core/entities/SectionTemplate";
import { createSectionJsonFileName } from "../../infrastructure/codegen/createSectionJsonFileName";
import { exportSectionToHtml } from "../../infrastructure/codegen/exportSectionToHtml";
import { exportSectionToJson } from "../../infrastructure/codegen/exportSectionToJson";
import { importSectionFromJson } from "../../infrastructure/codegen/importSectionFromJson";
import { cloneSectionTemplate } from "../../infrastructure/templates/cloneSectionTemplate";
import {
  addCustomSectionTemplate,
  createCustomSectionTemplate,
  deleteCustomSectionTemplate,
  loadCustomSectionTemplates,
} from "../../infrastructure/templates/customTemplatesStorage";
import { sectionTemplates } from "../../infrastructure/templates/sectionTemplates";

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

function getInitialCustomTemplates(): SectionTemplate[] {
  if (typeof window === "undefined") {
    return [];
  }

  return loadCustomSectionTemplates();
}

export function SectionEditorPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExportJsonModalOpen, setIsExportJsonModalOpen] = useState(false);
  const [isImportJsonModalOpen, setIsImportJsonModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<SectionTemplate[]>(
    getInitialCustomTemplates
  );

  const section = useSectionEditorStore((state) => state.section);
  const addElement = useSectionEditorStore((state) => state.addElement);
  const resetSection = useSectionEditorStore((state) => state.resetSection);
  const replaceSection = useSectionEditorStore((state) => state.replaceSection);
  const insertElementsFromSection = useSectionEditorStore(
    (state) => state.insertElementsFromSection
  );

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

  function handleUseTemplate(template: SectionTemplate) {
    const clonedSection = cloneSectionTemplate(template);

    if (!clonedSection) {
      return;
    }

    replaceSection(clonedSection);
    setIsTemplatesModalOpen(false);
  }

  function handleInsertTemplate(template: SectionTemplate) {
    const clonedSection = cloneSectionTemplate(template);

    if (!clonedSection) {
      return;
    }

    insertElementsFromSection(clonedSection);
    setIsTemplatesModalOpen(false);
  }

  function handleSaveTemplate(values: SaveTemplateFormValues) {
    const customTemplate = createCustomSectionTemplate({
      section,
      name: values.name,
      description: values.description,
      category: values.category,
    });

    if (!customTemplate) {
      return;
    }

    const nextCustomTemplates = addCustomSectionTemplate(customTemplate);

    setCustomTemplates(nextCustomTemplates);
    setIsSaveTemplateModalOpen(false);
  }

  function handleDeleteCustomTemplate(template: SectionTemplate) {
    const shouldDelete = window.confirm(
      `Delete custom template "${template.name}"?`
    );

    if (!shouldDelete) {
      return;
    }

    const nextCustomTemplates = deleteCustomSectionTemplate(template.id);

    setCustomTemplates(nextCustomTemplates);
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <LocalStorageSync />

      {!isExportModalOpen &&
        !isExportJsonModalOpen &&
        !isImportJsonModalOpen &&
        !isTemplatesModalOpen &&
        !isSaveTemplateModalOpen && <KeyboardShortcuts />}

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

      {isTemplatesModalOpen && (
        <TemplatesModal
          predefinedTemplates={sectionTemplates}
          customTemplates={customTemplates}
          onClose={() => setIsTemplatesModalOpen(false)}
          onUseTemplate={handleUseTemplate}
          onInsertTemplate={handleInsertTemplate}
          onDeleteCustomTemplate={handleDeleteCustomTemplate}
        />
      )}

      {isSaveTemplateModalOpen && (
        <SaveTemplateModal
          defaultName={section.name}
          onClose={() => setIsSaveTemplateModalOpen(false)}
          onSave={handleSaveTemplate}
        />
      )}

      <header className="flex h-[76px] items-center justify-between gap-4 border-b border-slate-200 bg-white px-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="min-w-44 shrink-0">
            <div className="text-sm font-semibold text-slate-900">
              sectionbuilder
            </div>
            <div className="truncate text-xs text-slate-500">
              Current section: {section.name || "Untitled section"}
            </div>
          </div>

          <AlignmentToolbar />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={resetSection}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Reset Section
          </button>

          <button
            type="button"
            onClick={() => setIsSaveTemplateModalOpen(true)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Save Template
          </button>

          <button
            type="button"
            onClick={() => setIsTemplatesModalOpen(true)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Templates
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
        <aside className="flex w-64 min-h-0 flex-col border-r border-slate-200 bg-white p-4">
          <section>
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
          </section>
        </aside>

        <EditorCanvas />

        <aside className="flex w-80 min-h-0 flex-col border-l border-slate-200 bg-white">
          <RightInspectorPanel />
        </aside>
      </div>
    </div>
  );
}