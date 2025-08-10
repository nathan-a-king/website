import React from "react";

export default function GameTheoryProgress() {
  const data = {
    title: "Draft",
    targetWords: 50000,
    currentWords: 33000,
    plannedChapters: 13,
    draftedChapters: 8,
    outlineComplete: true,
    notes: [
      { label: "World & premise locked", done: true },
      { label: "Outline (v2)", done: true },
      { label: "Theme and tone exploration", done: true },
      { label: "Preliminary research – Historical background, technical details", done: true },
      { label: "Core plot elements solidified", done: true },
      { label: "Subplots and secondary characters defined", done: true },
      { label: "Character arcs defined", done: true },
      { label: "Review foreshadowing elements", done: false },
      { label: "All chapters complete (v1)", done: false },
      { label: "Structural revisions – Pacing issues, plot holes", done: false },
      { label: "Line edits/continuity pass 1", done: false },
      { label: "Final review, proofread, and polish", done: false }
    ],
    chapters: Array.from({ length: 18 }).map((_, i) => ({
      index: i + 1,
      status: i + 1 < 6 ? "done" : i + 1 === 6 ? "wip" : "todo",
    })),
  };

  const pctWords = Math.min(100, Math.round((data.currentWords / data.targetWords) * 100));
  const pctChapters = Math.min(100, Math.round((data.draftedChapters / data.plannedChapters) * 100));
  const overall = Math.round(pctWords * 0.7 + pctChapters * 0.3);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-avenir transition-colors">
      <header className="pt-32 pb-20 px-6 text-center opacity-0 animate-fadeIn" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
        <h1 className="text-5xl mb-4 text-gray-900 dark:text-gray-100">{data.title} Progress</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Tracking draft momentum, chapter milestones, and overall completion.
        </p>
      </header>

      <main className="px-6 pb-12 opacity-0 animate-fadeIn" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
        <div className="max-w-5xl mx-auto space-y-12">
          <section className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg transition-colors shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-3xl text-gray-900 dark:text-gray-100 mb-3">Overall Progress</h2>
                <p className="text-gray-700 dark:text-gray-300 m-0">A blended view of words written and chapters drafted.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white flex items-center justify-center text-2xl font-semibold shadow-md">
                  {overall}%
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="relative h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-green-700" style={{ width: `${pctWords}%` }} />
                <div className="absolute inset-y-0 left-0 mix-blend-overlay" style={{ width: `${pctChapters}%`, backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0 8px, rgba(255,255,255,0) 8px 16px)" }} />
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Words: {data.currentWords.toLocaleString()} / {data.targetWords.toLocaleString()} ({pctWords}%)</span>
                <span>Chapters: {data.draftedChapters} / {data.plannedChapters} ({pctChapters}%)</span>
              </div>
            </div>
          </section>

          {/* Chapter Timeline */}
<section>
  <h2 className="text-3xl mb-6 text-gray-900 dark:text-gray-100">Chapter Timeline</h2>
  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg transition-colors">
    <div className="relative">
      {/* Horizontal Timeline Container */}
      <div className="overflow-x-auto">
        <div className="flex items-center justify-between w-full pb-4 min-w-max md:min-w-0">
          {(() => {
            const chapters = Array.from({ length: data.plannedChapters }).map((_, i) => {
              const idx = i + 1;
              if (idx <= data.draftedChapters) return { index: idx, status: "done" };
              if (idx === data.draftedChapters + 1) return { index: idx, status: "wip" };
              return { index: idx, status: "todo" };
            });

            return chapters.map((chapter, i) => {
              const isLast = i === chapters.length - 1;
              
              const getNodeStyles = () => {
                switch (chapter.status) {
                  case "done":
                    return "bg-green-500 text-white shadow-sm";
                  case "wip":
                    return "bg-green-600 text-white shadow-sm animate-pulse";
                  default:
                    return "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300";
                }
              };

              return (
                <div key={chapter.index} className={`flex items-center ${!isLast ? 'flex-1' : ''} ${isLast ? '' : 'min-w-0'}`}>
                  {/* Chapter Node */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${getNodeStyles()}`}
                    >
                      {chapter.index}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      {chapter.status === "done" && "✓"}
                      {chapter.status === "wip" && "●"}
                      {chapter.status === "todo" && "◯"}
                    </div>
                  </div>
                  
                  {/* Connecting Line */}
                  {!isLast && (
                    <div className="flex-1 mx-2 min-w-8">
                      <div 
                        className={`h-0.5 w-full ${
                          chapter.status === "done" 
                            ? "bg-gradient-to-r from-green-500 to-green-400" 
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      ></div>
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>
      </div>
      
      {/* Progress Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {data.draftedChapters} of {data.plannedChapters} chapters drafted
          </span>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            <span className="flex items-center gap-1"><span className="text-green-500">✓</span> Complete</span>
            <span className="flex items-center gap-1"><span className="text-green-600">●</span> In Progress</span>
            <span className="flex items-center gap-1"><span className="text-gray-400">◯</span> Planned</span>
          </div>
          <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent font-semibold">
            {Math.round((data.draftedChapters / data.plannedChapters) * 100)}% Complete
          </span>
        </div>
      </div>
    </div>
  </div>
</section>

          <section>
            <h2 className="text-3xl mb-6 text-gray-900 dark:text-gray-100">Milestones</h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg transition-colors">
              <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                {data.notes.map((n, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className={["mt-1 inline-block w-3 h-3 rounded-full", n.done ? "bg-green-500" : "bg-gray-400 dark:bg-gray-500"].join(" ")} aria-hidden />
                    <span className="text-gray-700 dark:text-gray-300">{n.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl mb-6 text-gray-900 dark:text-gray-100">Quotes</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg transition-colors">
                <blockquote className="text-lg italic text-gray-700 dark:text-gray-300">
                  "The clocks in the Ellis House seemed to mock the concept of time, never quite agreeing with each other. As William passed through the halls earlier, he'd noticed their discord - the mahogany regulator clock racing forward with feverish determination, the art deco timepiece in the parlor frozen at 3:47, and strangest of all, the grandfather clock whose hands seemed to hesitate between ticks, trembling as if fighting against their own momentum, occasionally slipping backwards before lurching forward again."
                </blockquote>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg transition-colors">
                <blockquote className="text-lg italic text-gray-700 dark:text-gray-300">
                  "There, across the street, through the misted windshield, he could just make out the edges of the Ellis House. Its presence was merely suggested rather than strongly defined, as if somehow conjured by the very fog that cloaked it. It felt more like a haunting apparition of the past than a real place in front of him. The simple roofline vanished into the gray sky, and the facade, though barely visible, seemed stern and unyielding, almost judgmental."
                </blockquote>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg transition-colors">
                <blockquote className="text-lg italic text-gray-700 dark:text-gray-300">
                  "He filled the room with his presence… a man who considered vulnerability a choice rather than a condition."
                </blockquote>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg transition-colors">
                <blockquote className="text-lg italic text-gray-700 dark:text-gray-300">
                  "In game theory, as in life, the most dangerous opponent is the one who has nothing left to lose."
                </blockquote>
              </div>
            </div>
          </section>

          <div className="my-6 w-3/4 mx-auto h-px bg-gray-200 dark:bg-gray-700 origin-center scale-x-0 animate-drawLine" style={{ animationDelay: "200ms", animationFillMode: "forwards" }} />

          <section className="grid md:grid-cols-3 gap-6">
            <StatCard label="Words Written" value={data.currentWords.toLocaleString()} sub={`of ${data.targetWords.toLocaleString()}`} />
            <StatCard label="Chapters Drafted" value={`${data.draftedChapters}`} sub={`of ${data.plannedChapters}`} />
            <StatCard label="Overall" value={`${overall}%`} sub="weighted completion" />
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Nathan A. King. All rights reserved.
      </footer>
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg transition-colors text-center">
      <div className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-1">{value}</div>
      {sub && <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}
