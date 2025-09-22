"use client";
import { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";


export default function Home() {
  const [state, setState] = useState({ date: "", problems: null });

  // 如果要用北京时间，请把 tz 改成 "Asia/Shanghai"
  const formatDate = (date = new Date(), tz = undefined) => {
    if (tz) {
      const s = new Intl.DateTimeFormat("en-CA", {
        timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit"
      }).format(date);
      return s; // YYYY-MM-DD
    }
    return new Date().toISOString().slice(0, 10); // 默认 UTC
  };

  useEffect(() => {
    fetch("/leetcode.json")
      .then((r) => r.json())
      .then((data) => {
        const today = formatDate(new Date(), "America/Los_Angeles");
        const problems = data?.[today]?.problems ?? null;
        setState({ date: today, problems });
      });
  }, []);

  if (!state.problems) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Calendar />
        <div className="text-gray-600">今天（{state.date || "…"}）没有配置题目</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Header 卡片 */}
        <header className="mb-6">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-300 to-yellow-500 flex items-center justify-center text-2xl">💡</div>
              <div>
                <h1 className="text-2xl font-bold">今日 LeetCode</h1>
                <p className="text-gray-500 text-sm">日期：{state.date}</p>
              </div>
            </div>
          </div>
        </header>

      <Calendar />

        {/* 题目列表 */}
        <ul className="grid gap-4">
          {state.problems.map((p, idx) => (
            <li key={idx}>
              <ProblemCard problem={p} index={idx + 1} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}


function Calendar(){
  return(<div className=" p-7">
  <CalendarHeatmap
    startDate={new Date('2024-12-31')}
    endDate={new Date('2025-12-31')}
    values={[
      { date: '2025-09-21', count: 2 },
      { date: '2025-09-22', count: 2 },
    ]}
    classForValue={value => {
      if (!value) return 'color-empty';
      return `color-scale-${value.count}`;
    }}
  />
</div>)
}

function ProblemCard({ problem, index }) {
  const diffClass = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    hard: "bg-red-100 text-red-700",
  }[problem.difficulty?.toLowerCase()] || "bg-gray-100 text-gray-700";

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-900 text-white text-sm font-bold">
            {index}
          </span>
          <h2 className="text-lg font-semibold leading-snug">{problem.title}</h2>
        </div>

        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${diffClass}`}>
          {problem.difficulty}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(problem.labels || []).map((l) => (
          <span
            key={l}
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${labelColor(l)}`}
          >
            {l}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <a
          href={problem.link}
          target="_blank"
          className="inline-flex items-center gap-1 text-sm px-3 py-2 rounded-lg bg-gray-900 text-white hover:opacity-90 transition"
        >
          去刷题 ↗
        </a>
      </div>
    </article>
  );
}

// 给不同标签一些稳定但多样的颜色（纯前端，无需配置）
function labelColor(label) {
  const palette = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-teal-100 text-teal-700",
    "bg-indigo-100 text-indigo-700",
    "bg-orange-100 text-orange-700",
    "bg-emerald-100 text-emerald-700",
  ];
  let hash = 0;
  for (let i = 0; i < label.length; i++) hash = (hash * 31 + label.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length];
}
