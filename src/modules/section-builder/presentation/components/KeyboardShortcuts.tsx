"use client";

import { useEffect } from "react";
import { useSectionEditorStore } from "../state/sectionEditorStore";

export function KeyboardShortcuts() {
  const section = useSectionEditorStore((state) => state.section);
  const selectedId = useSectionEditorStore((state) => state.selectedId);
  const deleteElement = useSectionEditorStore((state) => state.deleteElement);

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
  }, [deleteElement, section.elements, section.id, selectedId]);

  return null;
}