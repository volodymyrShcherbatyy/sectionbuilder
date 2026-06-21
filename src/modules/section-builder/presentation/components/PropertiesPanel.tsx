"use client";

import { NumberPropertyInput } from "./NumberPropertyInput";
import { useSectionEditorStore } from "../state/sectionEditorStore";

export function PropertiesPanel() {
  const section = useSectionEditorStore((state) => state.section);
  const selectedId = useSectionEditorStore((state) => state.selectedId);

  const updateSectionSize = useSectionEditorStore(
    (state) => state.updateSectionSize
  );
  const updateSectionName = useSectionEditorStore(
    (state) => state.updateSectionName
  );
  const updateSectionBackground = useSectionEditorStore(
    (state) => state.updateSectionBackground
  );
  const updateSectionBorderRadius = useSectionEditorStore(
    (state) => state.updateSectionBorderRadius
  );
  const updateElement = useSectionEditorStore((state) => state.updateElement);

  const deleteElement = useSectionEditorStore((state) => state.deleteElement);

  const duplicateElement = useSectionEditorStore(
    (state) => state.duplicateElement
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

  const selectedElement = section.elements.find(
    (element) => element.id === selectedId
  );

  if (selectedElement) {
    return (
      <section className="min-h-0 flex-1 overflow-auto p-4">
        <h2 className="text-sm font-semibold text-slate-900">Properties</h2>

        <div className="mt-4 rounded-lg border border-slate-200 p-3">
          <div className="text-xs font-semibold uppercase text-slate-500">
            Selected
          </div>

          <div className="mt-1 text-sm text-slate-900">
            {selectedElement.name}
          </div>

          <div className="mt-1 text-xs text-slate-500">
            type: {selectedElement.type}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => duplicateElement(selectedElement.id)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Duplicate
          </button>

          <button
            type="button"
            onClick={() => deleteElement(selectedElement.id)}
            className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600">
              Element name
            </label>
            <input
              type="text"
              value={selectedElement.name}
              onChange={(event) =>
                updateElement(selectedElement.id, {
                  name: event.target.value,
                })
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
            />
          </div>

          {(selectedElement.type === "text" ||
            selectedElement.type === "button" ||
            selectedElement.type === "checkbox") && (
            <div>
              <label className="text-xs font-medium text-slate-600">
                Text
              </label>
              <input
                type="text"
                value={selectedElement.text ?? ""}
                onChange={(event) =>
                  updateElement(selectedElement.id, {
                    text: event.target.value,
                  })
                }
                className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
              />
            </div>
          )}

          {selectedElement.type === "input" && (
            <div>
              <label className="text-xs font-medium text-slate-600">
                Placeholder
              </label>
              <input
                type="text"
                value={selectedElement.placeholder ?? ""}
                onChange={(event) =>
                  updateElement(selectedElement.id, {
                    placeholder: event.target.value,
                  })
                }
                className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <NumberPropertyInput
              label="X"
              value={selectedElement.x}
              min={0}
              onCommit={(value) =>
                updateElement(selectedElement.id, {
                  x: value,
                })
              }
            />

            <NumberPropertyInput
              label="Y"
              value={selectedElement.y}
              min={0}
              onCommit={(value) =>
                updateElement(selectedElement.id, {
                  y: value,
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberPropertyInput
              label="Width"
              value={selectedElement.width}
              min={10}
              onCommit={(value) =>
                updateElement(selectedElement.id, {
                  width: value,
                })
              }
            />

            <NumberPropertyInput
              label="Height"
              value={selectedElement.height}
              min={10}
              onCommit={(value) =>
                updateElement(selectedElement.id, {
                  height: value,
                })
              }
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">
              Background
            </label>
            <input
              type="color"
              value={
                selectedElement.backgroundColor === "transparent"
                  ? "#ffffff"
                  : selectedElement.backgroundColor
              }
              onChange={(event) =>
                updateElement(selectedElement.id, {
                  backgroundColor: event.target.value,
                })
              }
              className="mt-1 h-9 w-full rounded-md border border-slate-300"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">
              Text color
            </label>
            <input
              type="color"
              value={selectedElement.textColor}
              onChange={(event) =>
                updateElement(selectedElement.id, {
                  textColor: event.target.value,
                })
              }
              className="mt-1 h-9 w-full rounded-md border border-slate-300"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">
              Border color
            </label>
            <input
              type="color"
              value={
                selectedElement.borderColor === "transparent"
                  ? "#ffffff"
                  : selectedElement.borderColor
              }
              onChange={(event) =>
                updateElement(selectedElement.id, {
                  borderColor: event.target.value,
                })
              }
              className="mt-1 h-9 w-full rounded-md border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberPropertyInput
              label="Border width"
              value={selectedElement.borderWidth}
              min={0}
              onCommit={(value) =>
                updateElement(selectedElement.id, {
                  borderWidth: value,
                })
              }
            />

            <NumberPropertyInput
              label="Radius"
              value={selectedElement.borderRadius}
              min={0}
              onCommit={(value) =>
                updateElement(selectedElement.id, {
                  borderRadius: value,
                })
              }
            />
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-slate-200 p-3">
          <div className="text-xs font-semibold uppercase text-slate-500">
            Order
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={sendSelectedElementToBack}
              className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Send to back
            </button>

            <button
              type="button"
              onClick={bringSelectedElementToFront}
              className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Bring to front
            </button>

            <button
              type="button"
              onClick={sendSelectedElementBackward}
              className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Backward
            </button>

            <button
              type="button"
              onClick={bringSelectedElementForward}
              className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Forward
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-0 flex-1 overflow-auto p-4">
      <h2 className="text-sm font-semibold text-slate-900">Properties</h2>

      <div className="mt-4 rounded-lg border border-slate-200 p-3">
        <div className="text-xs font-semibold uppercase text-slate-500">
          Selected
        </div>

        <div className="mt-1 text-sm text-slate-900">{section.name}</div>
      </div>

      <div className="mt-4">
        <label className="text-xs font-medium text-slate-600">
          Section name
        </label>
        <input
          type="text"
          value={section.name}
          onChange={(event) => updateSectionName(event.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
        />
      </div>

      <div className="mt-4 space-y-4">
        <NumberPropertyInput
          label="Width"
          value={section.width}
          min={20}
          onCommit={(value) => updateSectionSize(value, section.height)}
        />

        <NumberPropertyInput
          label="Height"
          value={section.height}
          min={20}
          onCommit={(value) => updateSectionSize(section.width, value)}
        />

        <div>
          <label className="text-xs font-medium text-slate-600">
            Background
          </label>
          <input
            type="color"
            value={section.backgroundColor}
            onChange={(event) => updateSectionBackground(event.target.value)}
            className="mt-1 h-9 w-full rounded-md border border-slate-300"
          />
        </div>

        <NumberPropertyInput
          label="Border radius"
          value={section.borderRadius}
          min={0}
          onCommit={(value) => updateSectionBorderRadius(value)}
        />
      </div>
    </section>
  );
}