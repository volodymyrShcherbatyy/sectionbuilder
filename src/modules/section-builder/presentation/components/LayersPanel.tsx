"use client";

import { useSectionEditorStore } from "../state/sectionEditorStore";

function MoveUpIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19V5" />
      <path d="M6 11l6-6 6 6" />
    </svg>
  );
}

function MoveDownIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M18 13l-6 6-6-6" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l18 18" />
      <path d="M10.7 10.7a2 2 0 0 0 2.6 2.6" />
      <path d="M9.9 4.4A10.8 10.8 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-3.2 4.4" />
      <path d="M6.6 6.6C3.6 8.6 2 12 2 12s3.5 8 10 8a10.8 10.8 0 0 0 4.1-.8" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function UnlockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 7.7-1.5" />
    </svg>
  );
}

export function LayersPanel() {
  const section = useSectionEditorStore((state) => state.section);
  const selectedId = useSectionEditorStore((state) => state.selectedId);
  const selectedIds = useSectionEditorStore((state) => state.selectedIds);
  const selectElement = useSectionEditorStore((state) => state.selectElement);
  const toggleElementSelection = useSectionEditorStore(
    (state) => state.toggleElementSelection
  );
  const moveElementForward = useSectionEditorStore(
    (state) => state.moveElementForward
  );
  const moveElementBackward = useSectionEditorStore(
    (state) => state.moveElementBackward
  );
  const toggleElementVisibility = useSectionEditorStore(
    (state) => state.toggleElementVisibility
  );
  const toggleElementLock = useSectionEditorStore(
    (state) => state.toggleElementLock
  );

  const layerItems = section.elements
    .map((element, index) => ({
      element,
      index,
    }))
    .reverse();

  if (section.elements.length === 0) {
    return (
      <section className="flex min-h-0 flex-1 flex-col p-4">
        <h2 className="text-sm font-semibold text-slate-900">Layers</h2>

        <div className="mt-4 rounded-lg border border-dashed border-slate-300 px-3 py-4 text-xs text-slate-500">
          No elements yet.
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col p-4">
      <h2 className="text-sm font-semibold text-slate-900">Layers</h2>

      <div className="mt-3 min-h-0 flex-1 space-y-1 overflow-auto pr-1">
        {layerItems.map(({ element, index }) => {
          const isSelected = selectedIds.includes(element.id);
          const isPrimarySelected = selectedId === element.id;
          const isTopLayer = index === section.elements.length - 1;
          const isBottomLayer = index === 0;
          const isVisible = element.isVisible !== false;
          const isLocked = element.isLocked === true;

          return (
            <div
              key={element.id}
              className={[
                "rounded-md border bg-white",
                isPrimarySelected
                  ? "border-blue-600 bg-blue-50"
                  : isSelected
                    ? "border-blue-300 bg-blue-50"
                    : "border-slate-200",
                !isVisible ? "opacity-60" : "",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={(event) => {
                  if (event.ctrlKey || event.metaKey) {
                    toggleElementSelection(element.id);
                    return;
                  }

                  selectElement(element.id);
                }}
                className="w-full px-2 py-1.5 text-left hover:bg-slate-50"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-xs font-medium text-slate-900">
                      {element.name}
                    </div>

                    <div className="mt-0.5 flex flex-wrap gap-1 text-[10px] text-slate-500">
                      <span>{element.type}</span>

                      {isPrimarySelected && selectedIds.length > 1 && (
                        <span className="rounded bg-blue-600 px-1 uppercase text-white">
                          primary
                        </span>
                      )}

                      {!isVisible && (
                        <span className="rounded bg-slate-200 px-1 uppercase text-slate-600">
                          hidden
                        </span>
                      )}

                      {isLocked && (
                        <span className="rounded bg-slate-900 px-1 uppercase text-white">
                          locked
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                    {index + 1}
                  </div>
                </div>
              </button>

              <div className="grid grid-cols-4 gap-1 border-t border-slate-100 p-1">
                <button
                  type="button"
                  title="Move layer up"
                  aria-label="Move layer up"
                  disabled={isTopLayer}
                  onClick={() => moveElementForward(element.id)}
                  className="flex h-8 items-center justify-center rounded text-slate-800 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                >
                  <MoveUpIcon />
                </button>

                <button
                  type="button"
                  title="Move layer down"
                  aria-label="Move layer down"
                  disabled={isBottomLayer}
                  onClick={() => moveElementBackward(element.id)}
                  className="flex h-8 items-center justify-center rounded text-slate-800 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                >
                  <MoveDownIcon />
                </button>

                <button
                  type="button"
                  title={isVisible ? "Hide layer" : "Show layer"}
                  aria-label={isVisible ? "Hide layer" : "Show layer"}
                  onClick={() => toggleElementVisibility(element.id)}
                  className="flex h-8 items-center justify-center rounded text-slate-800 hover:bg-slate-100"
                >
                  {isVisible ? <EyeIcon /> : <EyeOffIcon />}
                </button>

                <button
                  type="button"
                  title={isLocked ? "Unlock layer" : "Lock layer"}
                  aria-label={isLocked ? "Unlock layer" : "Lock layer"}
                  onClick={() => toggleElementLock(element.id)}
                  className="flex h-8 items-center justify-center rounded text-slate-800 hover:bg-slate-100"
                >
                  {isLocked ? <UnlockIcon /> : <LockIcon />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}