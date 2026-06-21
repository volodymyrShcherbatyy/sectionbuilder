"use client";

import type { CSSProperties, MouseEvent, PointerEvent } from "react";
import type { SectionElement } from "../../core/entities/Section";
import { useSectionEditorStore } from "../state/sectionEditorStore";

type ElementRendererProps = {
  element: SectionElement;
};

export function ElementRenderer({ element }: ElementRendererProps) {
  const section = useSectionEditorStore((state) => state.section);
  const selectedId = useSectionEditorStore((state) => state.selectedId);
  const selectElement = useSectionEditorStore((state) => state.selectElement);
  const updateElement = useSectionEditorStore((state) => state.updateElement);

  const isSelected = selectedId === element.id;
  const isLocked = element.isLocked === true;

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    event.stopPropagation();

    selectElement(element.id);

    if (isLocked) {
      return;
    }

    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);

    const startClientX = event.clientX;
    const startClientY = event.clientY;
    const startX = element.x;
    const startY = element.y;

    function handlePointerMove(moveEvent: globalThis.PointerEvent) {
      const deltaX = moveEvent.clientX - startClientX;
      const deltaY = moveEvent.clientY - startClientY;

      const maxX = Math.max(0, section.width - element.width);
      const maxY = Math.max(0, section.height - element.height);

      const nextX = Math.min(Math.max(0, startX + deltaX), maxX);
      const nextY = Math.min(Math.max(0, startY + deltaY), maxY);

      updateElement(element.id, {
        x: Math.round(nextX),
        y: Math.round(nextY),
      });
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

  function handleResizePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.stopPropagation();

    selectElement(element.id);

    if (isLocked) {
      return;
    }

    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);

    const startClientX = event.clientX;
    const startClientY = event.clientY;
    const startWidth = element.width;
    const startHeight = element.height;

    function handlePointerMove(moveEvent: globalThis.PointerEvent) {
      const deltaX = moveEvent.clientX - startClientX;
      const deltaY = moveEvent.clientY - startClientY;

      const maxWidth = Math.max(10, section.width - element.x);
      const maxHeight = Math.max(10, section.height - element.y);

      const nextWidth = Math.min(Math.max(10, startWidth + deltaX), maxWidth);
      const nextHeight = Math.min(
        Math.max(10, startHeight + deltaY),
        maxHeight
      );

      updateElement(element.id, {
        width: Math.round(nextWidth),
        height: Math.round(nextHeight),
      });
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

  function handleClick(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();
    selectElement(element.id);
  }

  const commonStyle: CSSProperties = {
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    backgroundColor: element.backgroundColor,
    color: element.textColor,
    borderColor: element.borderColor,
    borderWidth: `${element.borderWidth}px`,
    borderStyle: element.borderWidth > 0 ? "solid" : "none",
    borderRadius: `${element.borderRadius}px`,
    touchAction: "none",
    userSelect: "none",
  };

  const className = [
    "absolute",
    "box-border",
    isLocked ? "cursor-default" : "cursor-move",
    "text-xs",
    isSelected ? "ring-2 ring-blue-500" : "",
  ].join(" ");

  function renderResizeHandle() {
    if (!isSelected || isLocked) {
      return null;
    }

    return (
      <div
        onPointerDown={handleResizePointerDown}
        className="absolute -bottom-1 -right-1 h-3 w-3 cursor-se-resize rounded-sm border border-blue-600 bg-white"
      />
    );
  }

  function renderLockIndicator() {
    if (!isLocked) {
      return null;
    }

    return (
      <span className="ml-1 inline-block h-[5px] w-[5px] shrink-0 rounded-full bg-slate-900 align-middle" />
    );
  }

  if (element.type === "text") {
    return (
      <div
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        className={className}
        style={commonStyle}
      >
        <span>{element.text}</span>
        {renderLockIndicator()}
        {renderResizeHandle()}
      </div>
    );
  }

  if (element.type === "button") {
    return (
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        className={className}
        style={commonStyle}
      >
        <span>{element.text}</span>
        {renderLockIndicator()}
        {renderResizeHandle()}
      </button>
    );
  }

  if (element.type === "input") {
    return (
      <div
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        className={className}
        style={commonStyle}
      >
        <div className="flex h-full w-full items-center px-2">
          <input
            readOnly
            placeholder={element.placeholder}
            className="min-w-0 flex-1 bg-transparent outline-none"
          />
          {renderLockIndicator()}
        </div>
        {renderResizeHandle()}
      </div>
    );
  }

  if (element.type === "checkbox") {
    return (
      <label
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        className={`${className} flex items-center gap-2`}
        style={commonStyle}
      >
        <input type="checkbox" readOnly />
        <span>{element.text}</span>
        {renderLockIndicator()}
        {renderResizeHandle()}
      </label>
    );
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className={className}
      style={commonStyle}
    >
      {renderLockIndicator()}
      {renderResizeHandle()}
    </div>
  );
}