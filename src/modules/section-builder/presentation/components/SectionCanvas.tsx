"use client";

import type { PointerEvent } from "react";
import { ElementRenderer } from "./ElementRenderer";
import { useSectionEditorStore } from "../state/sectionEditorStore";

export function SectionCanvas() {
  const section = useSectionEditorStore((state) => state.section);
  const selectedId = useSectionEditorStore((state) => state.selectedId);
  const selectSection = useSectionEditorStore((state) => state.selectSection);
  const updateSectionSize = useSectionEditorStore(
    (state) => state.updateSectionSize
  );

  const isSelected = selectedId === section.id;

  function handleResizePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.stopPropagation();

    selectSection();

    const target = event.currentTarget;
    const sectionElement = target.parentElement;

    if (!sectionElement) {
      return;
    }

    const sectionRect = sectionElement.getBoundingClientRect();

    target.setPointerCapture(event.pointerId);

    function handlePointerMove(moveEvent: globalThis.PointerEvent) {
      const nextWidth = Math.max(20, moveEvent.clientX - sectionRect.left);
      const nextHeight = Math.max(20, moveEvent.clientY - sectionRect.top);

      updateSectionSize(Math.round(nextWidth), Math.round(nextHeight));
    }

    function handlePointerUp(upEvent: globalThis.PointerEvent) {
      target.releasePointerCapture(upEvent.pointerId);
      target.removeEventListener("pointermove", handlePointerMove);
      target.removeEventListener("pointerup", handlePointerUp);
      target.removeEventListener("pointercancel", handlePointerUp);
    }

    target.addEventListener("pointermove", handlePointerMove);
    target.addEventListener("pointerup", handlePointerUp);
    target.addEventListener("pointercancel", handlePointerUp);
  }

  return (
    <div
      onClick={selectSection}
      className={[
        "relative cursor-pointer",
        "shadow-sm",
        isSelected ? "ring-2 ring-blue-500" : "",
      ].join(" ")}
      style={{
        width: `${section.width}px`,
        height: `${section.height}px`,
        backgroundColor: section.backgroundColor,
        borderColor: section.borderColor,
        borderWidth: `${section.borderWidth}px`,
        borderStyle: "solid",
        borderRadius: `${section.borderRadius}px`,
      }}
    >
      <div className="pointer-events-none absolute left-1 top-1 select-none text-[10px] text-slate-400">
        {section.width} × {section.height}
      </div>

      {section.elements
        .filter((element) => element.isVisible !== false)
        .map((element) => (
          <ElementRenderer key={element.id} element={element} />
        ))}

      {isSelected && (
        <div
          onPointerDown={handleResizePointerDown}
          className="absolute bottom-0 right-0 z-10 h-3 w-3 translate-x-1/2 translate-y-1/2 cursor-se-resize rounded-sm border border-blue-600 bg-white"
        />
      )}
    </div>
  );
}