"use client";

import { useRef, useState } from "react";

type NumberPropertyInputProps = {
  label: string;
  value: number;
  min: number;
  onCommit: (value: number) => void;
};

export function NumberPropertyInput({
  label,
  value,
  min,
  onCommit,
}: NumberPropertyInputProps) {
  const [draftValue, setDraftValue] = useState<string | null>(null);
  const shouldSkipBlurCommitRef = useRef(false);

  const displayValue = draftValue ?? String(value);

  function parseAndClamp(nextDraftValue: string): number | null {
    if (nextDraftValue.trim() === "") {
      return null;
    }

    const parsedValue = Number(nextDraftValue);

    if (!Number.isFinite(parsedValue)) {
      return null;
    }

    return Math.max(min, Math.round(parsedValue));
  }

  function commitValue(nextDraftValue: string) {
    const nextValue = parseAndClamp(nextDraftValue);

    if (nextValue === null) {
      setDraftValue(null);
      return;
    }

    setDraftValue(null);
    onCommit(nextValue);
  }

  function commitLiveValue(nextDraftValue: string) {
    const nextValue = parseAndClamp(nextDraftValue);

    if (nextValue === null) {
      return;
    }

    onCommit(nextValue);
  }

  function cancelEdit() {
    shouldSkipBlurCommitRef.current = true;
    setDraftValue(null);
  }

  return (
    <div>
      <label className="text-xs font-medium text-slate-600">{label}</label>

      <input
        type="number"
        value={displayValue}
        min={min}
        onChange={(event) => {
          setDraftValue(event.target.value);
        }}
        onInput={(event) => {
          const inputType = event.nativeEvent.inputType;

          if (
            inputType === "insertReplacementText" ||
            inputType === "deleteContentBackward" ||
            inputType === "deleteContentForward"
          ) {
            return;
          }

          commitLiveValue(event.currentTarget.value);
        }}
        onBlur={(event) => {
          if (shouldSkipBlurCommitRef.current) {
            shouldSkipBlurCommitRef.current = false;
            return;
          }

          commitValue(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            commitValue(event.currentTarget.value);
            event.currentTarget.blur();
          }

          if (event.key === "Escape") {
            cancelEdit();
            event.currentTarget.blur();
          }
        }}
        className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
      />
    </div>
  );
}