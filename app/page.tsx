"use client";

import { useState } from "react";

interface RequirementItem {
  label: string;
  value: string;
  required: boolean;
  notes?: string;
}

interface Section {
  id: string;
  title: string;
  items: RequirementItem[];
}

interface Requirements {
  projectTitle: string;
  sections: Section[];
}

const SECTION_ICONS: Record<string, string> = {
  project_overview: "📋",
  deliverables: "📦",
  target: "🎯",
  creator_requirements: "🎨",
  schedule: "📅",
  budget: "💰",
  constraints: "⚠️",
  references: "🔍",
  approval_flow: "✅",
  success_criteria: "🏆",
};

export default function Home() {
  const [overview, setOverview] = useState("");
  const [requirements, setRequirements] = useState<Requirements | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!overview.trim()) return;
    setLoading(true);
    setError(null);
    setRequirements(null);

    try {
      const res = await fetch("/api/generate-requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overview }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "エラーが発生しました");
      setRequirements(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!requirements) return;
    const text = requirements.sections
      .map((s) => {
        const icon = SECTION_ICONS[s.id] || "•";
        const items = s.items
          .map((item) => {
            const req = item.required ? "【必須】" : "【任意】";
            const notes = item.notes ? `\n  補足: ${item.notes}` : "";
            return `  ${req} ${item.label}\n  → ${item.value}${notes}`;
          })
          .join("\n\n");
        return `${icon} ${s.title}\n${"─".repeat(40)}\n${items}`;
      })
      .join("\n\n");
    navigator.clipboard.writeText(`【${requirements.projectTitle}】 要件定義\n\n${text}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900">要件定義ジェネレーター</h1>
          <p className="text-sm text-gray-500 mt-0.5">案件概要を入力して、要件定義に必要な項目を自動で策定します</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            案件概要
          </label>
          <textarea
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="例: アパレルブランドのInstagram向け商品撮影。新シーズンの春夏コレクション20アイテムを撮影したい。ターゲットは20〜30代女性で、ナチュラル・北欧風のテイスト。来月中に撮影完了希望。"
            className="w-full h-36 px-4 py-3 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">{overview.length}文字</span>
            <button
              onClick={handleGenerate}
              disabled={loading || !overview.trim()}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  生成中...
                </>
              ) : (
                "要件定義を生成する"
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {requirements && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{requirements.projectTitle}</h2>
                <p className="text-sm text-gray-500">要件定義書</p>
              </div>
              <button
                onClick={handleCopy}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                コピー
              </button>
            </div>

            <div className="space-y-4">
              {requirements.sections.map((section) => (
                <div key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="flex items-center gap-2 px-5 py-3.5 bg-gray-50 border-b border-gray-200">
                    <span className="text-base">{SECTION_ICONS[section.id] || "•"}</span>
                    <h3 className="text-sm font-bold text-gray-800">{section.title}</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {section.items.map((item, idx) => (
                      <div key={idx} className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-gray-600">{item.label}</span>
                              {item.required ? (
                                <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-medium">必須</span>
                              ) : (
                                <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">任意</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-800 leading-relaxed">{item.value}</p>
                            {item.notes && (
                              <p className="mt-1.5 text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
                                💡 {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
