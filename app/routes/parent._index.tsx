import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import type { TRoutineStep } from "~/modules/configurables/src/constants/configurables.default";
import { fetchHistory, todayDate } from "~/morning-buddy/utils/api";

type HistoryRecord = {
  date: string;
  completedStepIds: string[];
  totalSteps: number;
  fullyCompleted: boolean;
  completedAt?: string;
};

/* ─── 7-Day History Grid ─────────────────────────────────────── */
function HistoryGrid({
  history,
  steps,
}: {
  history: HistoryRecord[];
  steps: TRoutineStep[];
}) {
  // Build last 7 days
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  const historyMap = new Map(history.map((h) => [h.date, h]));

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((date) => {
        const record = historyMap.get(date);
        const dow = new Date(date + "T12:00:00").getDay();
        const isToday = date === todayDate();
        const isWeekend = dow === 0 || dow === 6;

        let bg = "#F3F4F6"; // grey — no data
        let label = "–";
        let textColor = "#6B7280";

        if (record) {
          const pct = record.totalSteps > 0
            ? Math.round((record.completedStepIds.length / record.totalSteps) * 100)
            : 0;
          if (record.fullyCompleted) {
            bg = "#22C55E";
            label = "✓";
            textColor = "#fff";
          } else if (pct > 0) {
            bg = "#FCD34D";
            label = `${pct}%`;
            textColor = "#92400E";
          }
        }

        return (
          <div key={date} className="flex flex-col items-center gap-1">
            <span className="text-xs font-semibold text-stone-400">
              {dayNames[dow]}
            </span>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200"
              style={{
                background: bg,
                color: textColor,
                border: isToday ? "2px solid #F59E0B" : "2px solid transparent",
                opacity: isWeekend && !record ? 0.45 : 1,
              }}
              title={date}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Step List ──────────────────────────────────────────────── */
function StepList({
  steps,
  completedIds,
}: {
  steps: TRoutineStep[];
  completedIds: string[];
}) {
  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const done = completedIds.includes(step.id);
        return (
          <div
            key={step.id}
            className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200"
            style={{
              background: done ? "#F0FDF4" : "#FFFBF5",
              border: `1.5px solid ${done ? "#86EFAC" : "#FDE68A"}`,
            }}
          >
            <span className="text-3xl">{done ? "✅" : step.emoji}</span>
            <div className="flex-1 min-w-0">
              <p
                className="font-bold text-lg leading-tight"
                style={{ color: done ? "#15803D" : "#1C1917" }}
              >
                {step.title}
              </p>
              <p className="text-sm text-stone-400 truncate">{step.description}</p>
            </div>
            <span
              className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{
                background: done ? "#DCFCE7" : "#FEF3C7",
                color: done ? "#15803D" : "#92400E",
              }}
            >
              {done ? "Done" : `~${step.durationMinutes}m`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── PIN Gate ───────────────────────────────────────────────── */
function PinGate({
  pin,
  onUnlock,
}: {
  pin: string;
  onUnlock: () => void;
}) {
  const [entered, setEntered] = useState("");
  const [error, setError] = useState(false);

  function handleDigit(d: string) {
    if (entered.length >= 4) return;
    const next = entered + d;
    setEntered(next);
    setError(false);
    if (next.length === 4) {
      if (next === pin) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => { setEntered(""); setError(false); }, 800);
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 px-6">
      <div className="w-full max-w-xs text-center space-y-8">
        <div>
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-extrabold text-stone-800">Parent Mode</h1>
          <p className="text-stone-500 mt-2">Enter your 4-digit PIN</p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full transition-all duration-150"
              style={{
                background:
                  entered.length > i
                    ? error
                      ? "#EF4444"
                      : "#F59E0B"
                    : "#E5E7EB",
              }}
            />
          ))}
        </div>
        {error && <p className="text-red-500 text-sm font-semibold">Wrong PIN, try again</p>}

        {/* Number pad */}
        <div className="grid grid-cols-3 gap-3">
          {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((d, i) => (
            <button
              key={i}
              onClick={() => {
                if (d === "⌫") {
                  setEntered((e) => e.slice(0, -1));
                } else if (d !== "") {
                  handleDigit(d);
                }
              }}
              className="h-16 rounded-2xl text-2xl font-bold transition-all active:scale-95 disabled:invisible"
              disabled={d === ""}
              style={{
                background: d ? "#fff" : "transparent",
                color: "#1C1917",
                boxShadow: d ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {d}
            </button>
          ))}
        </div>

        <Link
          to="/"
          className="block text-stone-400 text-sm underline"
        >
          Back to Morning Routine
        </Link>
      </div>
    </div>
  );
}

/* ─── Parent Dashboard ───────────────────────────────────────── */
export default function ParentDashboard() {
  const { config, loading } = useConfigurables();
  const [unlocked, setUnlocked] = useState(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const childName: string = (config as any)?.childName || "Buddy";
  const alarmTime: string = (config as any)?.alarmTime || "06:30";
  const steps: TRoutineStep[] = (config as any)?.routineSteps || [];
  const pin: string = (config as any)?.parentPin || "1234";
  const enableSchoolDaysOnly: boolean = (config as any)?.enableSchoolDaysOnly ?? true;

  useEffect(() => {
    if (!unlocked) return;
    fetchHistory(7)
      .then((data) => {
        setHistory(data || []);
        setHistoryLoading(false);
      })
      .catch(() => setHistoryLoading(false));
  }, [unlocked]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-pulse">☀️</div>
          <p className="text-xl font-bold text-amber-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!unlocked) {
    return <PinGate pin={pin} onUnlock={() => setUnlocked(true)} />;
  }

  const todayRecord = history.find((h) => h.date === todayDate());
  const completedToday = todayRecord?.completedStepIds || [];
  const completedCount = completedToday.length;
  const totalCount = steps.length;

  return (
    <div className="min-h-screen bg-amber-50 pb-20">
      {/* Header */}
      <div
        className="px-6 pt-12 pb-8 text-white"
        style={{ background: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Parent Dashboard</h1>
            <p className="text-lg opacity-90 mt-1">Morning Buddy — {childName}</p>
          </div>
          <Link
            to="/"
            className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl"
            title="Child View"
          >
            👦
          </Link>
        </div>

        {/* Today summary */}
        <div className="bg-white/20 rounded-3xl p-5" style={{ backdropFilter: "blur(8px)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold opacity-90">Today's Progress</p>
              <p className="text-4xl font-extrabold mt-1">
                {completedCount}/{totalCount}
              </p>
              <p className="text-sm opacity-80 mt-0.5">steps completed</p>
            </div>
            <div className="text-right">
              {todayRecord?.fullyCompleted ? (
                <div className="text-5xl">🌟</div>
              ) : (
                <div className="w-20 h-20 rounded-full border-4 border-white/40 flex items-center justify-center">
                  <span className="text-2xl font-extrabold">
                    {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm opacity-90">
            <span>⏰</span>
            <span>Alarm set for <strong>{alarmTime}</strong></span>
            {enableSchoolDaysOnly && <span className="bg-white/20 rounded-full px-2 py-0.5">Weekdays only</span>}
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6 mt-6">
        {/* 7-day history */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <h2 className="text-xl font-extrabold text-stone-800 mb-4">Last 7 Days</h2>
          {historyLoading ? (
            <div className="h-12 flex items-center justify-center text-stone-400 text-sm">
              Loading history…
            </div>
          ) : (
            <HistoryGrid history={history} steps={steps} />
          )}
          <div className="flex gap-4 mt-4 text-sm text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-green-400 inline-block" /> All done
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-yellow-300 inline-block" /> Partial
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-gray-200 inline-block" /> No data
            </span>
          </div>
        </div>

        {/* Today's step breakdown */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <h2 className="text-xl font-extrabold text-stone-800 mb-4">Today's Steps</h2>
          {steps.length === 0 ? (
            <p className="text-stone-400 text-sm">No steps configured.</p>
          ) : (
            <StepList steps={steps} completedIds={completedToday} />
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-3">
          <h2 className="text-xl font-extrabold text-stone-800 mb-4">Quick Actions</h2>
          <Link
            to="/parent/setup"
            className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 transition-all active:scale-95"
          >
            <span className="text-3xl">⚙️</span>
            <div>
              <p className="font-bold text-stone-800">Configure Routine</p>
              <p className="text-sm text-stone-400">Edit alarm, steps, and settings</p>
            </div>
            <span className="ml-auto text-stone-300 text-xl">›</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-4 p-4 rounded-2xl bg-sky-50 border border-sky-200 transition-all active:scale-95"
          >
            <span className="text-3xl">👦</span>
            <div>
              <p className="font-bold text-stone-800">Child Mode</p>
              <p className="text-sm text-stone-400">Switch to the morning routine view</p>
            </div>
            <span className="ml-auto text-stone-300 text-xl">›</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
