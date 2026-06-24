"use client";

import { useState } from "react";
import { LayersPanel } from "./LayersPanel";
import { PropertiesPanel } from "./PropertiesPanel";

type RightPanelTab = "properties" | "layers";

const tabs: Array<{
  id: RightPanelTab;
  label: string;
}> = [
  {
    id: "properties",
    label: "Properties",
  },
  {
    id: "layers",
    label: "Layers",
  },
];

export function RightInspectorPanel() {
  const [activeTab, setActiveTab] = useState<RightPanelTab>("properties");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 border-b border-slate-200 bg-white p-2">
        <div className="grid w-full grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "rounded-md px-3 py-1.5 text-sm font-medium",
                  isActive
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:bg-white/70 hover:text-slate-800",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {activeTab === "properties" ? <PropertiesPanel /> : <LayersPanel />}
      </div>
    </div>
  );
}