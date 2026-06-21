"use client";

import type { ElementAlignment } from "../state/sectionEditorStore";
import { useSectionEditorStore } from "../state/sectionEditorStore";

const alignmentButtons: Array<{
  label: string;
  shortLabel: string;
  alignment: ElementAlignment;
}> = [
  {
    label: "Align left",
    shortLabel: "Left",
    alignment: "left",
  },
  {
    label: "Align center horizontally",
    shortLabel: "Center X",
    alignment: "center-x",
  },
  {
    label: "Align right",
    shortLabel: "Right",
    alignment: "right",
  },
  {
    label: "Align top",
    shortLabel: "Top",
    alignment: "top",
  },
  {
    label: "Align middle vertically",
    shortLabel: "Middle Y",
    alignment: "center-y",
  },
  {
    label: "Align bottom",
    shortLabel: "Bottom",
    alignment: "bottom",
  },
];

export function AlignmentToolbar() {
  const section = useSectionEditorStore((state) => state.section);
  const selectedId = useSectionEditorStore((state) => state.selectedId);
  const alignSelectedElement = useSectionEditorStore(
    (state) => state.alignSelectedElement
  );

  const selectedElement = section.elements.find(
    (element) => element.id === selectedId
  );

  const isDisabled = !selectedElement || selectedElement.isLocked === true;

  return (
    <div className="flex items-center gap-2">
      <div className="text-xs font-semibold uppercase text-slate-500">
        Align
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
        {alignmentButtons.map((button) => (
          <button
            key={button.alignment}
            type="button"
            title={button.label}
            aria-label={button.label}
            disabled={isDisabled}
            onClick={() => alignSelectedElement(button.alignment)}
            className="rounded-md px-2 py-1 text-xs font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
          >
            {button.shortLabel}
          </button>
        ))}
      </div>
    </div>
  );
}