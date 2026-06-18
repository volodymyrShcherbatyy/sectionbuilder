"use client";

import { useEffect, useRef, useState } from "react";
import { importSectionFromJson } from "../../infrastructure/codegen/importSectionFromJson";

type ImportJsonModalProps = {
  onClose: () => void;
  onImport: (jsonValue: string) => void;
};

export function ImportJsonModal({ onClose, onImport }: ImportJsonModalProps) {
  const [jsonValue, setJsonValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  function handleImport() {
    const importedSection = importSectionFromJson(jsonValue);

    if (!importedSection) {
      setErrorMessage("Invalid section JSON.");
      return;
    }

    setErrorMessage(null);
    onImport(jsonValue);
  }

  function handleUploadButtonClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".json")) {
      setErrorMessage("Please select a .json file.");
      event.target.value = "";
      return;
    }

    try {
      const fileText = await file.text();

      setJsonValue(fileText);
      setErrorMessage(null);
    } catch {
      setErrorMessage("Could not read JSON file.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-6">
      <div className="flex max-h-[80vh] w-full max-w-4xl flex-col rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Import JSON
            </h2>
            <p className="text-xs text-slate-500">
              Upload or paste section JSON exported from sectionbuilder.
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

        <div className="min-h-0 flex-1 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Choose a downloaded .json file or paste JSON manually.
            </div>

            <button
              type="button"
              onClick={handleUploadButtonClick}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Upload JSON file
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <textarea
            value={jsonValue}
            onChange={(event) => {
              setJsonValue(event.target.value);
              setErrorMessage(null);
            }}
            placeholder="Paste section JSON here..."
            className="min-h-[360px] w-full resize-none rounded-lg border border-slate-300 bg-white p-4 font-mono text-xs text-slate-900 outline-none focus:border-blue-500"
          />

          {errorMessage && (
            <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-4 py-3">
          <button
            type="button"
            onClick={handleImport}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Import JSON
          </button>
        </div>
      </div>
    </div>
  );
}