export type SectionElementType = "text" | "button" | "input" | "checkbox" | "box";

export type SectionElement = {
  id: string;
  type: SectionElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  placeholder?: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  isVisible?: boolean;
  isLocked?: boolean;
};

export type Section = {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  elements: SectionElement[];
};