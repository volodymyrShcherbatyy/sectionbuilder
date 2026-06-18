"use client";

import { useEffect, useState } from "react";

type ExportJsonModalProps = {
  fileName: string;
  json: string;
  onClose: () => void;
};

export function ExportJsonModal({
  fileName,
  json,
  onClose,
}: ExportJsonModalProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

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

  async function handleCopyJson() {
    await navigator.clipboard.writeText(json);
    setCopyStatus("copied");

    window.setTimeout(() => {
      setCopyStatus("idle");
    }, 1500);
  }

  function handleDownloadJson() {
    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-6">
      <div className="flex max-h-[80vh] w-full max-w-4xl flex-col rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Export JSON
            </h2>
            <p className="text-xs text-slate-500">
              Copy or download this JSON to save or import this section later.
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
          <pre className="min-h-[360px] overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">
            <code>{json}</code>
          </pre>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-4 py-3">
          {copyStatus === "copied" && (
            <span className="text-sm font-medium text-emerald-600">
              Copied!
            </span>
          )}

          <button
            type="button"
            onClick={handleDownloadJson}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Download JSON
          </button>

          <button
            type="button"
            onClick={handleCopyJson}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Copy JSON
          </button>
        </div>
      </div>
    </div>
  );
}