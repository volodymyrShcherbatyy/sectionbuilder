"use client";

import { useEffect } from "react";
import { useSectionEditorStore } from "../state/sectionEditorStore";

export function KeyboardShortcuts() {
  const section = useSectionEditorStore((state) => state.section);
  const selectedId = useSectionEditorStore((state) => state.selectedId);
  const deleteElement = useSectionEditorStore((state) => state.deleteElement);

  const duplicateElement = useSectionEditorStore(
    (state) => state.duplicateElement
  );

  const moveSelectedElement = useSectionEditorStore(
    (state) => state.moveSelectedElement
  );

  const bringSelectedElementForward = useSectionEditorStore(
    (state) => state.bringSelectedElementForward
  );
  const sendSelectedElementBackward = useSectionEditorStore(
    (state) => state.sendSelectedElementBackward
  );
  const bringSelectedElementToFront = useSectionEditorStore(
    (state) => state.bringSelectedElementToFront
  );
  const sendSelectedElementToBack = useSectionEditorStore(
    (state) => state.sendSelectedElementToBack
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;

      const isEditableInput =
        target instanceof HTMLInputElement && !target.readOnly;

      const isEditingInput =
        isEditableInput ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement;

      if (isEditingInput) {
        return;
      }

      const isForwardKey =
        event.key === "]" && (event.ctrlKey || event.metaKey) && !event.shiftKey;

      if (isForwardKey) {
        event.preventDefault();
        bringSelectedElementForward();
        return;
      }

      const isBackwardKey =
        event.key === "[" && (event.ctrlKey || event.metaKey) && !event.shiftKey;

      if (isBackwardKey) {
        event.preventDefault();
        sendSelectedElementBackward();
        return;
      }

      const isBringToFrontKey =
        event.key === "]" && (event.ctrlKey || event.metaKey) && event.shiftKey;

      if (isBringToFrontKey) {
        event.preventDefault();
        bringSelectedElementToFront();
        return;
      }

      const isSendToBackKey =
        event.key === "[" && (event.ctrlKey || event.metaKey) && event.shiftKey;

      if (isSendToBackKey) {
        event.preventDefault();
        sendSelectedElementToBack();
        return;
      }

      const arrowKeyDeltas: Record<string, { deltaX: number; deltaY: number }> =
        {
          ArrowUp: { deltaX: 0, deltaY: -1 },
          ArrowDown: { deltaX: 0, deltaY: 1 },
          ArrowLeft: { deltaX: -1, deltaY: 0 },
          ArrowRight: { deltaX: 1, deltaY: 0 },
        };

      const arrowKeyDelta = arrowKeyDeltas[event.key];

      if (arrowKeyDelta) {
        if (!selectedId || selectedId === section.id) {
          return;
        }

        const selectedElementExists = section.elements.some(
          (element) => element.id === selectedId
        );

        if (!selectedElementExists) {
          return;
        }

        const step = event.shiftKey ? 10 : 1;

        event.preventDefault();
        moveSelectedElement(
          arrowKeyDelta.deltaX * step,
          arrowKeyDelta.deltaY * step
        );
        return;
      }

      const isDuplicateKey =
        event.key.toLowerCase() === "d" && (event.ctrlKey || event.metaKey);

      if (isDuplicateKey) {
        if (!selectedId || selectedId === section.id) {
          return;
        }

        const selectedElementExists = section.elements.some(
          (element) => element.id === selectedId
        );

        if (!selectedElementExists) {
          return;
        }

        event.preventDefault();
        duplicateElement(selectedId);
        return;
      }

      const isDeleteKey = event.key === "Delete" || event.key === "Backspace";

      if (!isDeleteKey) {
        return;
      }

      if (!selectedId || selectedId === section.id) {
        return;
      }

      const selectedElementExists = section.elements.some(
        (element) => element.id === selectedId
      );

      if (!selectedElementExists) {
        return;
      }

      event.preventDefault();
      deleteElement(selectedId);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    bringSelectedElementForward,
    bringSelectedElementToFront,
    deleteElement,
    duplicateElement,
    moveSelectedElement,
    section.elements,
    section.id,
    selectedId,
    sendSelectedElementBackward,
    sendSelectedElementToBack,
  ]);

  return null;
}