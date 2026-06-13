"use client";

import { SectionCanvas } from "./SectionCanvas";
import {
  EDITOR_CANVAS_MIN_HEIGHT_PX,
  EDITOR_CANVAS_MIN_WIDTH_PX,
  EDITOR_CANVAS_PADDING_PX,
} from "../constants/editorCanvasLayout";
import { useSectionEditorStore } from "../state/sectionEditorStore";

export function EditorCanvas() {
  const section = useSectionEditorStore((state) => state.section);

  const canvasWidth = Math.max(
    EDITOR_CANVAS_MIN_WIDTH_PX,
    section.width + EDITOR_CANVAS_PADDING_PX * 2
  );

  const canvasHeight = Math.max(
    EDITOR_CANVAS_MIN_HEIGHT_PX,
    section.height + EDITOR_CANVAS_PADDING_PX * 2
  );

  return (
    <main className="flex flex-1 overflow-auto bg-slate-100 p-8">
      <div className="min-w-max">
        <div
          className="box-border rounded-xl border border-slate-200 bg-white shadow-sm"
          style={{
            width: `${canvasWidth}px`,
            minHeight: `${canvasHeight}px`,
            padding: `${EDITOR_CANVAS_PADDING_PX}px`,
          }}
        >
          <SectionCanvas />
        </div>
      </div>
    </main>
  );
}