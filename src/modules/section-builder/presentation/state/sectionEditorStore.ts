import { create } from "zustand";
import type {
  Section,
  SectionElement,
  SectionElementType,
} from "../../core/entities/Section";

type UpdateElementPatch = Partial<
  Pick<
    SectionElement,
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
  >
>;

type SectionEditorState = {
  section: Section;
  selectedId: string | null;

  selectSection: () => void;
  selectElement: (elementId: string) => void;

  addElement: (type: SectionElementType) => void;
  updateElement: (elementId: string, patch: UpdateElementPatch) => void;
  deleteElement: (elementId: string) => void;
  duplicateElement: (elementId: string) => void;
  moveSelectedElement: (deltaX: number, deltaY: number) => void;

  bringSelectedElementForward: () => void;
  sendSelectedElementBackward: () => void;
  bringSelectedElementToFront: () => void;
  sendSelectedElementToBack: () => void;

  resetSection: () => void;
  replaceSection: (section: Section) => void;
  updateSectionName: (name: string) => void;
  updateSectionSize: (width: number, height: number) => void;
  updateSectionBackground: (backgroundColor: string) => void;
  updateSectionBorderRadius: (borderRadius: number) => void;
};

function createElement(type: SectionElementType): SectionElement {
  const id = `element-${crypto.randomUUID()}`;

  if (type === "text") {
    return {
      id,
      type,
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
      id,
      type,
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
      id,
      type,
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
      id,
      type,
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
    id,
    type,
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
  const nextX = Math.min(element.x + 10, Math.max(0, section.width - element.width));
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

export const useSectionEditorStore = create<SectionEditorState>((set) => ({
  section: createEmptySection(),

  resetSection: () => {
    set({
      section: createEmptySection(),
      selectedId: "section-root",
    });
  },

  replaceSection: (section) => {
    set({
      section,
      selectedId: section.id,
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

  selectedId: "section-root",

  selectSection: () => {
    set({
      selectedId: "section-root",
    });
  },

  selectElement: (elementId) => {
    set({
      selectedId: elementId,
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
    set((state) => ({
      section: {
        ...state.section,
        elements: state.section.elements.filter(
          (element) => element.id !== elementId
        ),
      },
      selectedId: "section-root",
    }));
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
      };
    });
  },

  moveSelectedElement: (deltaX, deltaY) => {
    set((state) => {
      if (!state.selectedId || state.selectedId === state.section.id) {
        return state;
      }

      const selectedElementExists = state.section.elements.some(
        (element) => element.id === state.selectedId
      );

      if (!selectedElementExists) {
        return state;
      }

      return {
        section: {
          ...state.section,
          elements: state.section.elements.map((element) => {
            if (element.id !== state.selectedId) {
              return element;
            }

            const maxX = Math.max(0, state.section.width - element.width);
            const maxY = Math.max(0, state.section.height - element.height);

            return {
              ...element,
              x: Math.min(Math.max(0, element.x + deltaX), maxX),
              y: Math.min(Math.max(0, element.y + deltaY), maxY),
            };
          }),
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
