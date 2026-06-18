"use client";

import { useEffect, useRef } from "react";
import {
  loadSectionFromLocalStorage,
  saveSectionToLocalStorage,
} from "../../infrastructure/storage/sectionLocalStorage";
import { useSectionEditorStore } from "../state/sectionEditorStore";

export function LocalStorageSync() {
  const isLoadedFromLocalStorageRef = useRef(false);

  const section = useSectionEditorStore((state) => state.section);
  const replaceSection = useSectionEditorStore((state) => state.replaceSection);

  useEffect(() => {
    const savedSection = loadSectionFromLocalStorage();

    if (savedSection) {
      replaceSection(savedSection);
    }

    isLoadedFromLocalStorageRef.current = true;
  }, [replaceSection]);

  useEffect(() => {
    if (!isLoadedFromLocalStorageRef.current) {
      return;
    }

    saveSectionToLocalStorage(section);
  }, [section]);

  return null;
}