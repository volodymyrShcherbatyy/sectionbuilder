import { create } from "zustand";
import type {
  Section,
  SectionElement,
  SectionElementType,
} from "../../core/entities/Section";

export type ElementAlignment =
  | "left"
  | "center-x"
  | "right"
  | "top"
  | "center-y"
  | "bottom";

type UpdateElementPatch = Partial<
  Pick<
    SectionElement,
    | "name"
    | "x"
    | "y"
    | "width"
    | "height"
    | "text"
    | "placeholder"
    | "backgroundColor"
    | "textColor"
    | "borderColor"
    | "borderWidth"
    | "borderRadius"
    | "isVisible"
    | "isLocked"
  >
>;

type SectionEditorState = {
  section: Section;
  selectedId: string | null;
  selectedIds: string[];

  selectSection: () => void;
  selectElement: (elementId: string) => void;
  toggleElementSelection: (elementId: string) => void;

  addElement: (type: SectionElementType) => void;
  updateElement: (elementId: string, patch: UpdateElementPatch) => void;

  deleteElement: (elementId: string) => void;
  deleteSelectedElements: () => void;

  duplicateElement: (elementId: string) => void;
  duplicateSelectedElements: () => void;

  moveSelectedElement: (deltaX: number, deltaY: number) => void;

  alignSelectedElement: (alignment: ElementAlignment) => void;
  alignSelectedElementsToPrimary: (alignment: ElementAlignment) => void;
  distributeSelectedElementsHorizontally: () => void;
  distributeSelectedElementsVertically: () => void;
  matchSelectedElementsWidthToPrimary: () => void;
  matchSelectedElementsHeightToPrimary: () => void;

  hideSelectedElements: () => void;
  showSelectedElements: () => void;
  lockSelectedElements: () => void;
  unlockSelectedElements: () => void;

  bringSelectedElementForward: () => void;
  sendSelectedElementBackward: () => void;
  bringSelectedElementToFront: () => void;
  sendSelectedElementToBack: () => void;
  moveElementForward: (elementId: string) => void;
  moveElementBackward: (elementId: string) => void;
  toggleElementVisibility: (elementId: string) => void;
  toggleElementLock: (elementId: string) => void;

  resetSection: () => void;
  replaceSection: (section: Section) => void;
  insertElementsFromSection: (sourceSection: Section) => void;
  updateSectionName: (name: string) => void;
  updateSectionSize: (width: number, height: number) => void;
  updateSectionBackground: (backgroundColor: string) => void;
  updateSectionBorderRadius: (borderRadius: number) => void;
};

function createElement(type: SectionElementType): SectionElement {
  const id = `element-${crypto.randomUUID()}`;

  const baseElement = {
    id,
    type,
    isVisible: true,
    isLocked: false,
  };

  if (type === "text") {
    return {
      ...baseElement,
      name: "Text",
      x: 10,
      y: 10,
      width: 120,
      height: 24,
      text: "Text",
      backgroundColor: "transparent",
      textColor: "#0f172a",
      borderColor: "transparent",
      borderWidth: 0,
      borderRadius: 0,
    };
  }

  if (type === "button") {
    return {
      ...baseElement,
      name: "Button",
      x: 10,
      y: 10,
      width: 120,
      height: 36,
      text: "Button",
      backgroundColor: "#2563eb",
      textColor: "#ffffff",
      borderColor: "#1d4ed8",
      borderWidth: 1,
      borderRadius: 6,
    };
  }

  if (type === "input") {
    return {
      ...baseElement,
      name: "Input",
      x: 10,
      y: 10,
      width: 160,
      height: 36,
      placeholder: "Enter text",
      backgroundColor: "#ffffff",
      textColor: "#0f172a",
      borderColor: "#cbd5e1",
      borderWidth: 1,
      borderRadius: 6,
    };
  }

  if (type === "checkbox") {
    return {
      ...baseElement,
      name: "Checkbox",
      x: 10,
      y: 10,
      width: 140,
      height: 24,
      text: "Checkbox",
      backgroundColor: "transparent",
      textColor: "#0f172a",
      borderColor: "transparent",
      borderWidth: 0,
      borderRadius: 0,
    };
  }

  return {
    ...baseElement,
    name: "Box",
    x: 10,
    y: 10,
    width: 120,
    height: 80,
    backgroundColor: "#e2e8f0",
    textColor: "#0f172a",
    borderColor: "#94a3b8",
    borderWidth: 1,
    borderRadius: 6,
  };
}

function createEmptySection(): Section {
  return {
    id: "section-root",
    name: "Section",
    width: 100,
    height: 100,
    backgroundColor: "#ffffff",
    borderColor: "#94a3b8",
    borderWidth: 1,
    borderRadius: 0,
    elements: [],
  };
}

function createDuplicatedElement(
  element: SectionElement,
  section: Section
): SectionElement {
  const nextX = Math.min(
    element.x + 10,
    Math.max(0, section.width - element.width)
  );
  const nextY = Math.min(
    element.y + 10,
    Math.max(0, section.height - element.height)
  );

  return {
    ...element,
    id: `element-${crypto.randomUUID()}`,
    name: `${element.name} copy`,
    x: nextX,
    y: nextY,
  };
}

function moveArrayItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);

  if (!item) {
    return items;
  }

  nextItems.splice(toIndex, 0, item);

  return nextItems;
}

function isElementVisible(element: SectionElement): boolean {
  return element.isVisible !== false;
}

function isElementLocked(element: SectionElement): boolean {
  return element.isLocked === true;
}

function isElementEditable(element: SectionElement): boolean {
  return isElementVisible(element) && !isElementLocked(element);
}

function clampElementX(section: Section, element: SectionElement, x: number) {
  return Math.min(Math.max(0, x), Math.max(0, section.width - element.width));
}

function clampElementY(section: Section, element: SectionElement, y: number) {
  return Math.min(Math.max(0, y), Math.max(0, section.height - element.height));
}

function clampElementWidth(
  section: Section,
  element: SectionElement,
  width: number
) {
  return Math.min(Math.max(10, width), Math.max(10, section.width - element.x));
}

function clampElementHeight(
  section: Section,
  element: SectionElement,
  height: number
) {
  return Math.min(
    Math.max(10, height),
    Math.max(10, section.height - element.y)
  );
}

function getAlignedPositionToSection(
  section: Section,
  element: SectionElement,
  alignment: ElementAlignment
): Pick<SectionElement, "x" | "y"> {
  if (alignment === "left") {
    return {
      x: 0,
      y: element.y,
    };
  }

  if (alignment === "center-x") {
    return {
      x: clampElementX(
        section,
        element,
        Math.round((section.width - element.width) / 2)
      ),
      y: element.y,
    };
  }

  if (alignment === "right") {
    return {
      x: clampElementX(section, element, section.width - element.width),
      y: element.y,
    };
  }

  if (alignment === "top") {
    return {
      x: element.x,
      y: 0,
    };
  }

  if (alignment === "center-y") {
    return {
      x: element.x,
      y: clampElementY(
        section,
        element,
        Math.round((section.height - element.height) / 2)
      ),
    };
  }

  return {
    x: element.x,
    y: clampElementY(section, element, section.height - element.height),
  };
}

function getAlignedPositionToPrimary(
  section: Section,
  element: SectionElement,
  primaryElement: SectionElement,
  alignment: ElementAlignment
): Pick<SectionElement, "x" | "y"> {
  if (alignment === "left") {
    return {
      x: clampElementX(section, element, primaryElement.x),
      y: element.y,
    };
  }

  if (alignment === "center-x") {
    const primaryCenterX = primaryElement.x + primaryElement.width / 2;

    return {
      x: clampElementX(
        section,
        element,
        Math.round(primaryCenterX - element.width / 2)
      ),
      y: element.y,
    };
  }

  if (alignment === "right") {
    const primaryRight = primaryElement.x + primaryElement.width;

    return {
      x: clampElementX(section, element, primaryRight - element.width),
      y: element.y,
    };
  }

  if (alignment === "top") {
    return {
      x: element.x,
      y: clampElementY(section, element, primaryElement.y),
    };
  }

  if (alignment === "center-y") {
    const primaryCenterY = primaryElement.y + primaryElement.height / 2;

    return {
      x: element.x,
      y: clampElementY(
        section,
        element,
        Math.round(primaryCenterY - element.height / 2)
      ),
    };
  }

  const primaryBottom = primaryElement.y + primaryElement.height;

  return {
    x: element.x,
    y: clampElementY(section, element, primaryBottom - element.height),
  };
}

function getSelectedElementIds(state: {
  selectedId: string | null;
  selectedIds: string[];
  section: Section;
}): string[] {
  if (state.selectedIds.length > 0) {
    return state.selectedIds;
  }

  if (!state.selectedId || state.selectedId === state.section.id) {
    return [];
  }

  return [state.selectedId];
}

function getEditableSelectedElements(state: {
  section: Section;
  selectedId: string | null;
  selectedIds: string[];
}): SectionElement[] {
  const selectedElementIds = getSelectedElementIds(state);

  if (selectedElementIds.length === 0) {
    return [];
  }

  return state.section.elements.filter(
    (element) =>
      selectedElementIds.includes(element.id) && isElementEditable(element)
  );
}

function getSelectedElements(state: {
  section: Section;
  selectedId: string | null;
  selectedIds: string[];
}): SectionElement[] {
  const selectedElementIds = getSelectedElementIds(state);

  if (selectedElementIds.length === 0) {
    return [];
  }

  return state.section.elements.filter((element) =>
    selectedElementIds.includes(element.id)
  );
}

function getNextSelectedIdsAfterDelete(
  selectedIds: string[],
  deletedElementId: string
): string[] {
  return selectedIds.filter((selectedId) => selectedId !== deletedElementId);
}

function getGroupClampedDelta(
  section: Section,
  elements: SectionElement[],
  deltaX: number,
  deltaY: number
): { deltaX: number; deltaY: number } {
  if (elements.length === 0) {
    return {
      deltaX: 0,
      deltaY: 0,
    };
  }

  const minX = Math.min(...elements.map((element) => element.x));
  const minY = Math.min(...elements.map((element) => element.y));
  const maxX = Math.max(
    ...elements.map((element) => element.x + element.width)
  );
  const maxY = Math.max(
    ...elements.map((element) => element.y + element.height)
  );

  const clampedDeltaX = Math.min(
    Math.max(deltaX, -minX),
    section.width - maxX
  );

  const clampedDeltaY = Math.min(
    Math.max(deltaY, -minY),
    section.height - maxY
  );

  return {
    deltaX: clampedDeltaX,
    deltaY: clampedDeltaY,
  };
}

export const useSectionEditorStore = create<SectionEditorState>((set) => ({
  section: createEmptySection(),
  selectedId: "section-root",
  selectedIds: [],

  resetSection: () => {
    set({
      section: createEmptySection(),
      selectedId: "section-root",
      selectedIds: [],
    });
  },

  replaceSection: (section) => {
    set({
      section,
      selectedId: section.id,
      selectedIds: [],
    });
  },

  insertElementsFromSection: (sourceSection) => {
    set((state) => {
      const insertedElements = sourceSection.elements.map((element) => ({
        ...element,
        id: `element-${crypto.randomUUID()}`,
        isVisible: isElementVisible(element),
        isLocked: isElementLocked(element),
      }));

      const nextWidth = Math.max(state.section.width, sourceSection.width);
      const nextHeight = Math.max(state.section.height, sourceSection.height);
      const lastInsertedElement = insertedElements[insertedElements.length - 1];

      return {
        section: {
          ...state.section,
          width: nextWidth,
          height: nextHeight,
          elements: [...state.section.elements, ...insertedElements],
        },
        selectedId: lastInsertedElement?.id ?? state.selectedId,
        selectedIds: lastInsertedElement ? [lastInsertedElement.id] : [],
      };
    });
  },

  updateSectionName: (name) => {
    set((state) => ({
      section: {
        ...state.section,
        name,
      },
    }));
  },

  selectSection: () => {
    set({
      selectedId: "section-root",
      selectedIds: [],
    });
  },

  selectElement: (elementId) => {
    set({
      selectedId: elementId,
      selectedIds: [elementId],
    });
  },

  toggleElementSelection: (elementId) => {
    set((state) => {
      const isAlreadySelected = state.selectedIds.includes(elementId);

      if (isAlreadySelected) {
        const nextSelectedIds = state.selectedIds.filter(
          (selectedId) => selectedId !== elementId
        );

        return {
          selectedId:
            nextSelectedIds.length > 0
              ? nextSelectedIds[nextSelectedIds.length - 1]
              : "section-root",
          selectedIds: nextSelectedIds,
        };
      }

      return {
        selectedId: elementId,
        selectedIds: [...state.selectedIds, elementId],
      };
    });
  },

  addElement: (type) => {
    const element = createElement(type);

    set((state) => ({
      section: {
        ...state.section,
        elements: [...state.section.elements, element],
      },
      selectedId: element.id,
      selectedIds: [element.id],
    }));
  },

  updateElement: (elementId, patch) => {
    set((state) => ({
      section: {
        ...state.section,
        elements: state.section.elements.map((element) =>
          element.id === elementId
            ? {
                ...element,
                ...patch,
                x: patch.x !== undefined ? Math.max(0, patch.x) : element.x,
                y: patch.y !== undefined ? Math.max(0, patch.y) : element.y,
                width:
                  patch.width !== undefined
                    ? Math.max(10, patch.width)
                    : element.width,
                height:
                  patch.height !== undefined
                    ? Math.max(10, patch.height)
                    : element.height,
                borderWidth:
                  patch.borderWidth !== undefined
                    ? Math.max(0, patch.borderWidth)
                    : element.borderWidth,
                borderRadius:
                  patch.borderRadius !== undefined
                    ? Math.max(0, patch.borderRadius)
                    : element.borderRadius,
              }
            : element
        ),
      },
    }));
  },

  updateSectionSize: (width, height) => {
    set((state) => {
      const nextWidth = Math.max(20, width);
      const nextHeight = Math.max(20, height);

      return {
        section: {
          ...state.section,
          width: nextWidth,
          height: nextHeight,
          elements: state.section.elements.map((element) => {
            const nextElementWidth = Math.min(element.width, nextWidth);
            const nextElementHeight = Math.min(element.height, nextHeight);

            return {
              ...element,
              width: nextElementWidth,
              height: nextElementHeight,
              x: Math.min(element.x, Math.max(0, nextWidth - nextElementWidth)),
              y: Math.min(
                element.y,
                Math.max(0, nextHeight - nextElementHeight)
              ),
            };
          }),
        },
      };
    });
  },

  deleteElement: (elementId) => {
    set((state) => {
      const selectedElement = state.section.elements.find(
        (element) => element.id === elementId
      );

      if (!selectedElement || isElementLocked(selectedElement)) {
        return state;
      }

      const nextSelectedIds = getNextSelectedIdsAfterDelete(
        state.selectedIds,
        elementId
      );

      return {
        section: {
          ...state.section,
          elements: state.section.elements.filter(
            (element) => element.id !== elementId
          ),
        },
        selectedId:
          nextSelectedIds.length > 0
            ? nextSelectedIds[nextSelectedIds.length - 1]
            : "section-root",
        selectedIds: nextSelectedIds,
      };
    });
  },

  deleteSelectedElements: () => {
    set((state) => {
      const selectedElementIds = getSelectedElementIds(state);

      if (selectedElementIds.length === 0) {
        return state;
      }

      const deletableSelectedIds = new Set(
        state.section.elements
          .filter(
            (element) =>
              selectedElementIds.includes(element.id) &&
              !isElementLocked(element)
          )
          .map((element) => element.id)
      );

      if (deletableSelectedIds.size === 0) {
        return state;
      }

      return {
        section: {
          ...state.section,
          elements: state.section.elements.filter(
            (element) => !deletableSelectedIds.has(element.id)
          ),
        },
        selectedId: "section-root",
        selectedIds: [],
      };
    });
  },

  duplicateElement: (elementId) => {
    set((state) => {
      const sourceElement = state.section.elements.find(
        (element) => element.id === elementId
      );

      if (!sourceElement) {
        return state;
      }

      const duplicatedElement = createDuplicatedElement(
        sourceElement,
        state.section
      );

      return {
        section: {
          ...state.section,
          elements: [...state.section.elements, duplicatedElement],
        },
        selectedId: duplicatedElement.id,
        selectedIds: [duplicatedElement.id],
      };
    });
  },

  duplicateSelectedElements: () => {
    set((state) => {
      const selectedElementIds = getSelectedElementIds(state);

      if (selectedElementIds.length === 0) {
        return state;
      }

      const sourceElements = state.section.elements.filter((element) =>
        selectedElementIds.includes(element.id)
      );

      if (sourceElements.length === 0) {
        return state;
      }

      const duplicatedElements = sourceElements.map((element) =>
        createDuplicatedElement(element, state.section)
      );

      const duplicatedElementIds = duplicatedElements.map(
        (element) => element.id
      );

      const lastDuplicatedElement =
        duplicatedElements[duplicatedElements.length - 1];

      return {
        section: {
          ...state.section,
          elements: [...state.section.elements, ...duplicatedElements],
        },
        selectedId: lastDuplicatedElement?.id ?? state.selectedId,
        selectedIds: duplicatedElementIds,
      };
    });
  },

  moveSelectedElement: (deltaX, deltaY) => {
    set((state) => {
      const editableSelectedElements = getEditableSelectedElements(state);

      if (editableSelectedElements.length === 0) {
        return state;
      }

      const editableSelectedIds = new Set(
        editableSelectedElements.map((element) => element.id)
      );

      const clampedDelta = getGroupClampedDelta(
        state.section,
        editableSelectedElements,
        deltaX,
        deltaY
      );

      if (clampedDelta.deltaX === 0 && clampedDelta.deltaY === 0) {
        return state;
      }

      return {
        section: {
          ...state.section,
          elements: state.section.elements.map((element) => {
            if (!editableSelectedIds.has(element.id)) {
              return element;
            }

            return {
              ...element,
              x: element.x + clampedDelta.deltaX,
              y: element.y + clampedDelta.deltaY,
            };
          }),
        },
      };
    });
  },

  alignSelectedElement: (alignment) => {
    set((state) => {
      const selectedElementIds = getSelectedElementIds(state);

      if (selectedElementIds.length === 0) {
        return state;
      }

      const editableSelectedIds = new Set(
        state.section.elements
          .filter(
            (element) =>
              selectedElementIds.includes(element.id) &&
              isElementEditable(element)
          )
          .map((element) => element.id)
      );

      if (editableSelectedIds.size === 0) {
        return state;
      }

      return {
        section: {
          ...state.section,
          elements: state.section.elements.map((element) => {
            if (!editableSelectedIds.has(element.id)) {
              return element;
            }

            const alignedPosition = getAlignedPositionToSection(
              state.section,
              element,
              alignment
            );

            return {
              ...element,
              x: alignedPosition.x,
              y: alignedPosition.y,
            };
          }),
        },
      };
    });
  },

  alignSelectedElementsToPrimary: (alignment) => {
    set((state) => {
      if (!state.selectedId || state.selectedIds.length < 2) {
        return state;
      }

      const primaryElement = state.section.elements.find(
        (element) => element.id === state.selectedId
      );

      if (!primaryElement || !isElementVisible(primaryElement)) {
        return state;
      }

      const editableTargetIds = new Set(
        state.section.elements
          .filter(
            (element) =>
              element.id !== primaryElement.id &&
              state.selectedIds.includes(element.id) &&
              isElementEditable(element)
          )
          .map((element) => element.id)
      );

      if (editableTargetIds.size === 0) {
        return state;
      }

      return {
        section: {
          ...state.section,
          elements: state.section.elements.map((element) => {
            if (!editableTargetIds.has(element.id)) {
              return element;
            }

            const alignedPosition = getAlignedPositionToPrimary(
              state.section,
              element,
              primaryElement,
              alignment
            );

            return {
              ...element,
              x: alignedPosition.x,
              y: alignedPosition.y,
            };
          }),
        },
      };
    });
  },

  distributeSelectedElementsHorizontally: () => {
    set((state) => {
      const editableSelectedElements = getEditableSelectedElements(state);

      if (editableSelectedElements.length < 2) {
        return state;
      }

      const sortedElements = [...editableSelectedElements].sort((a, b) => {
        if (a.x === b.x) {
          return a.y - b.y;
        }

        return a.x - b.x;
      });

      const totalWidth = sortedElements.reduce(
        (sum, element) => sum + element.width,
        0
      );

      const availableSpace = state.section.width - totalWidth;

      if (availableSpace < 0) {
        return state;
      }

      const gap = availableSpace / (sortedElements.length + 1);
      let nextX = gap;
      const nextXByElementId = new Map<string, number>();

      sortedElements.forEach((element) => {
        nextXByElementId.set(
          element.id,
          clampElementX(state.section, element, Math.round(nextX))
        );

        nextX += element.width + gap;
      });

      return {
        section: {
          ...state.section,
          elements: state.section.elements.map((element) => {
            const nextElementX = nextXByElementId.get(element.id);

            if (nextElementX === undefined) {
              return element;
            }

            return {
              ...element,
              x: nextElementX,
            };
          }),
        },
      };
    });
  },

  distributeSelectedElementsVertically: () => {
    set((state) => {
      const editableSelectedElements = getEditableSelectedElements(state);

      if (editableSelectedElements.length < 2) {
        return state;
      }

      const sortedElements = [...editableSelectedElements].sort((a, b) => {
        if (a.y === b.y) {
          return a.x - b.x;
        }

        return a.y - b.y;
      });

      const totalHeight = sortedElements.reduce(
        (sum, element) => sum + element.height,
        0
      );

      const availableSpace = state.section.height - totalHeight;

      if (availableSpace < 0) {
        return state;
      }

      const gap = availableSpace / (sortedElements.length + 1);
      let nextY = gap;
      const nextYByElementId = new Map<string, number>();

      sortedElements.forEach((element) => {
        nextYByElementId.set(
          element.id,
          clampElementY(state.section, element, Math.round(nextY))
        );

        nextY += element.height + gap;
      });

      return {
        section: {
          ...state.section,
          elements: state.section.elements.map((element) => {
            const nextElementY = nextYByElementId.get(element.id);

            if (nextElementY === undefined) {
              return element;
            }

            return {
              ...element,
              y: nextElementY,
            };
          }),
        },
      };
    });
  },

  matchSelectedElementsWidthToPrimary: () => {
    set((state) => {
      if (!state.selectedId || state.selectedIds.length < 2) {
        return state;
      }

      const primaryElement = state.section.elements.find(
        (element) => element.id === state.selectedId
      );

      if (!primaryElement || !isElementVisible(primaryElement)) {
        return state;
      }

      const editableTargetIds = new Set(
        state.section.elements
          .filter(
            (element) =>
              element.id !== primaryElement.id &&
              state.selectedIds.includes(element.id) &&
              isElementEditable(element)
          )
          .map((element) => element.id)
      );

      if (editableTargetIds.size === 0) {
        return state;
      }

      return {
        section: {
          ...state.section,
          elements: state.section.elements.map((element) => {
            if (!editableTargetIds.has(element.id)) {
              return element;
            }

            return {
              ...element,
              width: clampElementWidth(
                state.section,
                element,
                primaryElement.width
              ),
            };
          }),
        },
      };
    });
  },

  matchSelectedElementsHeightToPrimary: () => {
    set((state) => {
      if (!state.selectedId || state.selectedIds.length < 2) {
        return state;
      }

      const primaryElement = state.section.elements.find(
        (element) => element.id === state.selectedId
      );

      if (!primaryElement || !isElementVisible(primaryElement)) {
        return state;
      }

      const editableTargetIds = new Set(
        state.section.elements
          .filter(
            (element) =>
              element.id !== primaryElement.id &&
              state.selectedIds.includes(element.id) &&
              isElementEditable(element)
          )
          .map((element) => element.id)
      );

      if (editableTargetIds.size === 0) {
        return state;
      }

      return {
        section: {
          ...state.section,
          elements: state.section.elements.map((element) => {
            if (!editableTargetIds.has(element.id)) {
              return element;
            }

            return {
              ...element,
              height: clampElementHeight(
                state.section,
                element,
                primaryElement.height
              ),
            };
          }),
        },
      };
    });
  },

  hideSelectedElements: () => {
    set((state) => {
      const selectedElements = getSelectedElements(state);

      if (selectedElements.length === 0) {
        return state;
      }

      const targetIds = new Set(
        selectedElements
          .filter((element) => isElementVisible(element))
          .map((element) => element.id)
      );

      if (targetIds.size === 0) {
        return state;
      }

      return {
        section: {
          ...state.section,
          elements: state.section.elements.map((element) =>
            targetIds.has(element.id)
              ? {
                  ...element,
                  isVisible: false,
                }
              : element
          ),
        },
      };
    });
  },

  showSelectedElements: () => {
    set((state) => {
      const selectedElements = getSelectedElements(state);

      if (selectedElements.length === 0) {
        return state;
      }

      const targetIds = new Set(
        selectedElements
          .filter((element) => !isElementVisible(element))
          .map((element) => element.id)
      );

      if (targetIds.size === 0) {
        return state;
      }

      return {
        section: {
          ...state.section,
          elements: state.section.elements.map((element) =>
            targetIds.has(element.id)
              ? {
                  ...element,
                  isVisible: true,
                }
              : element
          ),
        },
      };
    });
  },

  lockSelectedElements: () => {
    set((state) => {
      const selectedElements = getSelectedElements(state);

      if (selectedElements.length === 0) {
        return state;
      }

      const targetIds = new Set(
        selectedElements
          .filter((element) => !isElementLocked(element))
          .map((element) => element.id)
      );

      if (targetIds.size === 0) {
        return state;
      }

      return {
        section: {
          ...state.section,
          elements: state.section.elements.map((element) =>
            targetIds.has(element.id)
              ? {
                  ...element,
                  isLocked: true,
                }
              : element
          ),
        },
      };
    });
  },

  unlockSelectedElements: () => {
    set((state) => {
      const selectedElements = getSelectedElements(state);

      if (selectedElements.length === 0) {
        return state;
      }

      const targetIds = new Set(
        selectedElements
          .filter((element) => isElementLocked(element))
          .map((element) => element.id)
      );

      if (targetIds.size === 0) {
        return state;
      }

      return {
        section: {
          ...state.section,
          elements: state.section.elements.map((element) =>
            targetIds.has(element.id)
              ? {
                  ...element,
                  isLocked: false,
                }
              : element
          ),
        },
      };
    });
  },

  bringSelectedElementForward: () => {
    set((state) => {
      if (!state.selectedId || state.selectedId === state.section.id) {
        return state;
      }

      const currentIndex = state.section.elements.findIndex(
        (element) => element.id === state.selectedId
      );

      if (
        currentIndex === -1 ||
        currentIndex === state.section.elements.length - 1
      ) {
        return state;
      }

      return {
        section: {
          ...state.section,
          elements: moveArrayItem(
            state.section.elements,
            currentIndex,
            currentIndex + 1
          ),
        },
      };
    });
  },

  sendSelectedElementBackward: () => {
    set((state) => {
      if (!state.selectedId || state.selectedId === state.section.id) {
        return state;
      }

      const currentIndex = state.section.elements.findIndex(
        (element) => element.id === state.selectedId
      );

      if (currentIndex <= 0) {
        return state;
      }

      return {
        section: {
          ...state.section,
          elements: moveArrayItem(
            state.section.elements,
            currentIndex,
            currentIndex - 1
          ),
        },
      };
    });
  },

  bringSelectedElementToFront: () => {
    set((state) => {
      if (!state.selectedId || state.selectedId === state.section.id) {
        return state;
      }

      const currentIndex = state.section.elements.findIndex(
        (element) => element.id === state.selectedId
      );

      if (
        currentIndex === -1 ||
        currentIndex === state.section.elements.length - 1
      ) {
        return state;
      }

      return {
        section: {
          ...state.section,
          elements: moveArrayItem(
            state.section.elements,
            currentIndex,
            state.section.elements.length - 1
          ),
        },
      };
    });
  },

  sendSelectedElementToBack: () => {
    set((state) => {
      if (!state.selectedId || state.selectedId === state.section.id) {
        return state;
      }

      const currentIndex = state.section.elements.findIndex(
        (element) => element.id === state.selectedId
      );

      if (currentIndex <= 0) {
        return state;
      }

      return {
        section: {
          ...state.section,
          elements: moveArrayItem(state.section.elements, currentIndex, 0),
        },
      };
    });
  },

  moveElementForward: (elementId) => {
    set((state) => {
      const currentIndex = state.section.elements.findIndex(
        (element) => element.id === elementId
      );

      if (
        currentIndex === -1 ||
        currentIndex === state.section.elements.length - 1
      ) {
        return state;
      }

      return {
        section: {
          ...state.section,
          elements: moveArrayItem(
            state.section.elements,
            currentIndex,
            currentIndex + 1
          ),
        },
        selectedId: elementId,
        selectedIds: [elementId],
      };
    });
  },

  moveElementBackward: (elementId) => {
    set((state) => {
      const currentIndex = state.section.elements.findIndex(
        (element) => element.id === elementId
      );

      if (currentIndex <= 0) {
        return state;
      }

      return {
        section: {
          ...state.section,
          elements: moveArrayItem(
            state.section.elements,
            currentIndex,
            currentIndex - 1
          ),
        },
        selectedId: elementId,
        selectedIds: [elementId],
      };
    });
  },

  toggleElementVisibility: (elementId) => {
    set((state) => ({
      section: {
        ...state.section,
        elements: state.section.elements.map((element) =>
          element.id === elementId
            ? {
                ...element,
                isVisible: !isElementVisible(element),
              }
            : element
        ),
      },
      selectedId: elementId,
      selectedIds: [elementId],
    }));
  },

  toggleElementLock: (elementId) => {
    set((state) => ({
      section: {
        ...state.section,
        elements: state.section.elements.map((element) =>
          element.id === elementId
            ? {
                ...element,
                isLocked: !isElementLocked(element),
              }
            : element
        ),
      },
      selectedId: elementId,
      selectedIds: [elementId],
    }));
  },

  updateSectionBackground: (backgroundColor) => {
    set((state) => ({
      section: {
        ...state.section,
        backgroundColor,
      },
    }));
  },

  updateSectionBorderRadius: (borderRadius) => {
    set((state) => ({
      section: {
        ...state.section,
        borderRadius: Math.max(0, borderRadius),
      },
    }));
  },
}));