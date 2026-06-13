import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import type { TRoutineStep } from "~/modules/configurables/src/constants/configurables.default";

const DEFAULT_STEPS: TRoutineStep[] = [
  { id: "bath", emoji: "🚿", title: "Bath & Wash Up", description: "Shower or wash your face and hands", durationMinutes: 10 },
  { id: "dressed", emoji: "👕", title: "Get Dressed", description: "Put on your school uniform", durationMinutes: 5 },
  { id: "breakfast", emoji: "🥣", title: "Eat Breakfast", description: "Have a healthy breakfast to start your day", durationMinutes: 15 },
  { id: "study", emoji: "📚", title: "Study Review", description: "Check your homework and pack your school bag", durationMinutes: 10 },
  { id: "school", emoji: "🏫", title: "Leave for School", description: "Shoes on, bag on — let's go!", durationMinutes: 5 },
];

/* ─── Toggle ─────────────────────────────────────────────────── */
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        className="relative w-12 h-6 rounded-full transition-colors duration-200"
        style={{ background: checked ? "#F59E0B" : "#E5E7EB" }}
        onClick={() => onChange(!checked)}
      >
        <div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: checked ? "translateX(26px)" : "translateX(2px)" }}
        />
      </div>
      <span className="text-base font-medium text-stone-700">{label}</span>
    </label>
  );
}

/* ─── Step Editor Row ────────────────────────────────────────── */
function StepRow({
  step,
  index,
  total,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  step: TRoutineStep;
  index: number;
  total: number;
  onUpdate: (s: TRoutineStep) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
      {/* Drag handles / reorder */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-sm text-stone-500 disabled:opacity-30 shadow-sm"
          >
            ↑
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-sm text-stone-500 disabled:opacity-30 shadow-sm"
          >
            ↓
          </button>
          <span className="text-sm font-bold text-stone-400">Step {index + 1}</span>
        </div>
        <button
          onClick={onRemove}
          className="text-red-400 hover:text-red-600 text-sm font-semibold"
        >
          Remove
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {/* Emoji */}
        <div>
          <label className="text-xs font-semibold text-stone-400 block mb-1">Emoji</label>
          <input
            type="text"
            value={step.emoji}
            maxLength={2}
            onChange={(e) => onUpdate({ ...step, emoji: e.target.value })}
            className="w-full h-11 rounded-xl border border-amber-200 bg-white text-center text-2xl focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        {/* Duration */}
        <div>
          <label className="text-xs font-semibold text-stone-400 block mb-1">Minutes</label>
          <input
            type="number"
            min={1}
            max={60}
            value={step.durationMinutes}
            onChange={(e) => onUpdate({ ...step, durationMinutes: parseInt(e.target.value) || 5 })}
            className="w-full h-11 rounded-xl border border-amber-200 bg-white text-center text-base font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        {/* Title (spans 2) */}
        <div className="col-span-2">
          <label className="text-xs font-semibold text-stone-400 block mb-1">Step Name</label>
          <input
            type="text"
            value={step.title}
            maxLength={40}
            onChange={(e) => onUpdate({ ...step, title: e.target.value })}
            className="w-full h-11 rounded-xl border border-amber-200 bg-white px-3 text-base font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-semibold text-stone-400 block mb-1">Description (optional)</label>
        <input
          type="text"
          value={step.description}
          maxLength={80}
          onChange={(e) => onUpdate({ ...step, description: e.target.value })}
          className="w-full h-10 rounded-xl border border-amber-200 bg-white px-3 text-sm text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>
    </div>
  );
}

/* ─── Setup Page ─────────────────────────────────────────────── */
export default function ParentSetup() {
  const { config, loading } = useConfigurables();

  const [childName, setChildName] = useState("");
  const [alarmTime, setAlarmTime] = useState("06:30");
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const [completionMsg, setCompletionMsg] = useState("");
  const [schoolDaysOnly, setSchoolDaysOnly] = useState(true);
  const [parentPin, setParentPin] = useState("1234");
  const [steps, setSteps] = useState<TRoutineStep[]>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initialize from config
  useEffect(() => {
    if (loading) return;
    setChildName((config as any)?.childName ?? "Buddy");
    setAlarmTime((config as any)?.alarmTime ?? "06:30");
    setWelcomeMsg((config as any)?.welcomeMessage ?? "Good morning! Time to rise and shine! ☀️");
    setCompletionMsg((config as any)?.completionMessage ?? "Amazing! You are ready for school! 🎉");
    setSchoolDaysOnly((config as any)?.enableSchoolDaysOnly ?? true);
    setParentPin((config as any)?.parentPin ?? "1234");
    setSteps((config as any)?.routineSteps ?? DEFAULT_STEPS);
  }, [loading, config]);

  function updateStep(index: number, updated: TRoutineStep) {
    setSteps((prev) => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  function moveStep(index: number, direction: "up" | "down") {
    setSteps((prev) => {
      const next = [...prev];
      const swapWith = direction === "up" ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= next.length) return prev;
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return next;
    });
  }

  function addStep() {
    const newStep: TRoutineStep = {
      id: `step_${Date.now()}`,
      emoji: "⭐",
      title: "New Step",
      description: "",
      durationMinutes: 5,
    };
    setSteps((prev) => [...prev, newStep]);
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Save via configurables API (PATCH /api/configurables)
      await fetch("/api/configurables", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          configurable_data: {
            ...(config as any),
            childName,
            alarmTime,
            welcomeMessage: welcomeMsg,
            completionMessage: completionMsg,
            enableSchoolDaysOnly: schoolDaysOnly,
            parentPin,
            routineSteps: steps,
          },
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50">
        <div className="text-6xl animate-pulse">☀️</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      {/* Header */}
      <div
        className="px-6 pt-12 pb-6 text-white"
        style={{ background: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)" }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Link
            to="/parent"
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl"
          >
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold">Configure Routine</h1>
            <p className="text-sm opacity-80">Set up Morning Buddy for your child</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6 mt-6">
        {/* Basic info */}
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-stone-800">Basic Settings</h2>

          <div>
            <label className="text-sm font-semibold text-stone-500 block mb-1">
              Child's Name
            </label>
            <input
              type="text"
              value={childName}
              maxLength={50}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full h-12 rounded-2xl border border-amber-200 bg-amber-50 px-4 text-lg font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="e.g. Sam"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-stone-500 block mb-1">
              Wake-up Alarm Time
            </label>
            <input
              type="time"
              value={alarmTime}
              onChange={(e) => setAlarmTime(e.target.value)}
              className="w-full h-12 rounded-2xl border border-amber-200 bg-amber-50 px-4 text-lg font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <Toggle
            checked={schoolDaysOnly}
            onChange={setSchoolDaysOnly}
            label="School days only (Mon–Fri)"
          />
        </div>

        {/* Messages */}
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-stone-800">Messages</h2>

          <div>
            <label className="text-sm font-semibold text-stone-500 block mb-1">
              Wake-up Message
            </label>
            <input
              type="text"
              value={welcomeMsg}
              maxLength={120}
              onChange={(e) => setWelcomeMsg(e.target.value)}
              className="w-full h-12 rounded-2xl border border-amber-200 bg-amber-50 px-4 text-base text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-stone-500 block mb-1">
              Completion Message
            </label>
            <input
              type="text"
              value={completionMsg}
              maxLength={120}
              onChange={(e) => setCompletionMsg(e.target.value)}
              className="w-full h-12 rounded-2xl border border-amber-200 bg-amber-50 px-4 text-base text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-stone-800">Security</h2>
          <div>
            <label className="text-sm font-semibold text-stone-500 block mb-1">
              Parent PIN (4 digits)
            </label>
            <input
              type="password"
              value={parentPin}
              maxLength={4}
              pattern="[0-9]{4}"
              onChange={(e) => setParentPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className="w-full h-12 rounded-2xl border border-amber-200 bg-amber-50 px-4 text-2xl font-bold text-stone-800 tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="••••"
            />
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-stone-800">
              Morning Steps ({steps.length})
            </h2>
            <button
              onClick={addStep}
              className="text-sm font-bold px-4 py-2 rounded-xl text-white"
              style={{ background: "#F59E0B" }}
            >
              + Add Step
            </button>
          </div>

          {steps.length === 0 && (
            <p className="text-stone-400 text-sm text-center py-4">
              No steps yet. Add some steps for the morning routine!
            </p>
          )}

          <div className="space-y-3">
            {steps.map((step, index) => (
              <StepRow
                key={step.id}
                step={step}
                index={index}
                total={steps.length}
                onUpdate={(s) => updateStep(index, s)}
                onRemove={() => removeStep(index)}
                onMoveUp={() => moveStep(index, "up")}
                onMoveDown={() => moveStep(index, "down")}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-amber-100 shadow-2xl">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-3xl text-xl font-bold text-white transition-all active:scale-95 disabled:opacity-60"
          style={{ background: saved ? "#22C55E" : "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)" }}
        >
          {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
