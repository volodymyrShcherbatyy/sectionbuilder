"use client";

import type { ReactNode } from "react";
import type { ElementAlignment } from "../state/sectionEditorStore";
import { useSectionEditorStore } from "../state/sectionEditorStore";

type IconProps = {
  className?: string;
};

type IconComponent = (props: IconProps) => ReactNode;

const iconClassName = "h-4 w-4";

function AlignLeftIcon({ className = iconClassName }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 4v16" />
      <path d="M8 7h12" />
      <path d="M8 12h8" />
      <path d="M8 17h12" />
    </svg>
  );
}

function AlignCenterXIcon({ className = iconClassName }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 4v16" />
      <path d="M6 7h12" />
      <path d="M8 12h8" />
      <path d="M6 17h12" />
    </svg>
  );
}

function AlignRightIcon({ className = iconClassName }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M20 4v16" />
      <path d="M4 7h12" />
      <path d="M8 12h8" />
      <path d="M4 17h12" />
    </svg>
  );
}

function AlignTopIcon({ className = iconClassName }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 4h16" />
      <path d="M7 8v12" />
      <path d="M12 8v8" />
      <path d="M17 8v12" />
    </svg>
  );
}

function AlignCenterYIcon({ className = iconClassName }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 12h16" />
      <path d="M7 6v12" />
      <path d="M12 8v8" />
      <path d="M17 6v12" />
    </svg>
  );
}

function AlignBottomIcon({ className = iconClassName }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 20h16" />
      <path d="M7 4v12" />
      <path d="M12 8v8" />
      <path d="M17 4v12" />
    </svg>
  );
}

function DistributeHorizontalIcon({ className = iconClassName }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5v14" />
      <path d="M20 5v14" />
      <rect x="7" y="8" width="3" height="8" rx="1" />
      <rect x="14" y="8" width="3" height="8" rx="1" />
    </svg>
  );
}

function DistributeVerticalIcon({ className = iconClassName }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 4h14" />
      <path d="M5 20h14" />
      <rect x="8" y="7" width="8" height="3" rx="1" />
      <rect x="8" y="14" width="8" height="3" rx="1" />
    </svg>
  );
}

function MatchWidthIcon({ className = iconClassName }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 7h14" />
      <path d="M5 17h14" />
      <path d="M7 5l-2 2 2 2" />
      <path d="M17 5l2 2-2 2" />
      <path d="M7 15l-2 2 2 2" />
      <path d="M17 15l2 2-2 2" />
    </svg>
  );
}

function MatchHeightIcon({ className = iconClassName }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 5v14" />
      <path d="M17 5v14" />
      <path d="M5 7l2-2 2 2" />
      <path d="M5 17l2 2 2-2" />
      <path d="M15 7l2-2 2 2" />
      <path d="M15 17l2 2 2-2" />
    </svg>
  );
}

const alignmentButtons: Array<{
  label: string;
  alignment: ElementAlignment;
  icon: IconComponent;
}> = [
  {
    label: "Align left",
    alignment: "left",
    icon: AlignLeftIcon,
  },
  {
    label: "Align center horizontally",
    alignment: "center-x",
    icon: AlignCenterXIcon,
  },
  {
    label: "Align right",
    alignment: "right",
    icon: AlignRightIcon,
  },
  {
    label: "Align top",
    alignment: "top",
    icon: AlignTopIcon,
  },
  {
    label: "Align middle vertically",
    alignment: "center-y",
    icon: AlignCenterYIcon,
  },
  {
    label: "Align bottom",
    alignment: "bottom",
    icon: AlignBottomIcon,
  },
];

export function AlignmentToolbar() {
  const section = useSectionEditorStore((state) => state.section);
  const selectedId = useSectionEditorStore((state) => state.selectedId);
  const selectedIds = useSectionEditorStore((state) => state.selectedIds);
  const alignSelectedElement = useSectionEditorStore(
    (state) => state.alignSelectedElement
  );
  const alignSelectedElementsToPrimary = useSectionEditorStore(
    (state) => state.alignSelectedElementsToPrimary
  );
  const distributeSelectedElementsHorizontally = useSectionEditorStore(
    (state) => state.distributeSelectedElementsHorizontally
  );
  const distributeSelectedElementsVertically = useSectionEditorStore(
    (state) => state.distributeSelectedElementsVertically
  );
  const matchSelectedElementsWidthToPrimary = useSectionEditorStore(
    (state) => state.matchSelectedElementsWidthToPrimary
  );
  const matchSelectedElementsHeightToPrimary = useSectionEditorStore(
    (state) => state.matchSelectedElementsHeightToPrimary
  );

  const selectedElements = section.elements.filter((element) =>
    selectedIds.includes(element.id)
  );

  const primaryElement = section.elements.find(
    (element) => element.id === selectedId
  );

  const editableSelectedElements = selectedElements.filter(
    (element) => element.isVisible !== false && element.isLocked !== true
  );

  const editableTargetElements = selectedElements.filter(
    (element) =>
      element.id !== selectedId &&
      element.isVisible !== false &&
      element.isLocked !== true
  );

  const isSectionAlignmentDisabled = editableSelectedElements.length === 0;
  const isSectionDistributeDisabled = editableSelectedElements.length < 2;

  const isPrimaryActionDisabled =
    !primaryElement ||
    primaryElement.isVisible === false ||
    selectedIds.length < 2 ||
    editableTargetElements.length === 0;

  function renderIconButton({
    keyValue,
    title,
    isDisabled,
    onClick,
    icon,
  }: {
    keyValue: string;
    title: string;
    isDisabled: boolean;
    onClick: () => void;
    icon: IconComponent;
  }) {
    const Icon = icon;

    return (
      <button
        key={keyValue}
        type="button"
        title={title}
        aria-label={title}
        disabled={isDisabled}
        onClick={onClick}
        className="flex h-6 w-6 items-center justify-center rounded-md text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
      >
        <Icon />
      </button>
    );
  }

  function renderAlignmentButtons({
    keyPrefix,
    titleSuffix,
    isDisabled,
    onAlign,
  }: {
    keyPrefix: string;
    titleSuffix: string;
    isDisabled: boolean;
    onAlign: (alignment: ElementAlignment) => void;
  }) {
    return alignmentButtons.map((button) =>
      renderIconButton({
        keyValue: `${keyPrefix}-${button.alignment}`,
        title: `${button.label} ${titleSuffix}`,
        isDisabled,
        onClick: () => onAlign(button.alignment),
        icon: button.icon,
      })
    );
  }

  return (
    <div className="flex min-w-[500px] max-w-[680px] flex-1 flex-col gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
      <div className="flex items-center gap-2">
        <div className="w-14 shrink-0 text-[10px] font-semibold uppercase text-slate-400">
          Section
        </div>

        <div className="flex items-center gap-1">
          {renderAlignmentButtons({
            keyPrefix: "section",
            titleSuffix: "to section",
            isDisabled: isSectionAlignmentDisabled,
            onAlign: alignSelectedElement,
          })}
        </div>

        <div className="mx-1 h-5 w-px bg-slate-200" />

        <div className="flex items-center gap-1">
          {renderIconButton({
            keyValue: "section-distribute-horizontal",
            title: "Distribute selected elements horizontally inside section",
            isDisabled: isSectionDistributeDisabled,
            onClick: distributeSelectedElementsHorizontally,
            icon: DistributeHorizontalIcon,
          })}

          {renderIconButton({
            keyValue: "section-distribute-vertical",
            title: "Distribute selected elements vertically inside section",
            isDisabled: isSectionDistributeDisabled,
            onClick: distributeSelectedElementsVertically,
            icon: DistributeVerticalIcon,
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="text-[10px] font-semibold uppercase text-slate-500">
            Align
          </div>

          {selectedIds.length > 1 && (
            <div className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
              {selectedIds.length} selected
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-14 shrink-0 text-[10px] font-semibold uppercase text-slate-400">
          Primary
        </div>

        <div className="flex items-center gap-1">
          {renderAlignmentButtons({
            keyPrefix: "primary",
            titleSuffix: "to primary selected element",
            isDisabled: isPrimaryActionDisabled,
            onAlign: alignSelectedElementsToPrimary,
          })}
        </div>

        <div className="mx-1 h-5 w-px bg-slate-200" />

        <div className="flex items-center gap-1">
          {renderIconButton({
            keyValue: "primary-match-width",
            title: "Match width to primary selected element",
            isDisabled: isPrimaryActionDisabled,
            onClick: matchSelectedElementsWidthToPrimary,
            icon: MatchWidthIcon,
          })}

          {renderIconButton({
            keyValue: "primary-match-height",
            title: "Match height to primary selected element",
            isDisabled: isPrimaryActionDisabled,
            onClick: matchSelectedElementsHeightToPrimary,
            icon: MatchHeightIcon,
          })}
        </div>
      </div>
    </div>
  );
}