import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import type { TRoutineStep } from "~/modules/configurables/src/constants/configurables.default";
import { fetchToday, completeStep, resetRoutine, todayDate } from "~/morning-buddy/utils/api";

/* ─── Alarm ──────────────────────────────────────────────────── */
function useAlarm(alarmTime: string | undefined) {
  const [alarmFired, setAlarmFired] = useState(false);
  const [alarmDismissed, setAlarmDismissed] = useState(false);

  useEffect(() => {
    if (!alarmTime) return;

    // Check if we've already dismissed today
    const today = todayDate();
    const key = `alarm_dismissed_${today}`;
    if (localStorage.getItem(key) === "1") {
      setAlarmDismissed(true);
      return;
    }

    function checkAlarm() {
      const now = new Date();
      const [h, m] = (alarmTime as string).split(":").map(Number);
      const alarmDate = new Date();
      alarmDate.setHours(h, m, 0, 0);

      // Fire within a 2-minute window of alarm time
      const diff = now.getTime() - alarmDate.getTime();
      if (diff >= 0 && diff < 2 * 60 * 1000) {
        setAlarmFired(true);
      }
    }

    checkAlarm();
    const interval = setInterval(checkAlarm, 30_000);
    return () => clearInterval(interval);
  }, [alarmTime]);

  const dismiss = useCallback(() => {
    const today = todayDate();
    localStorage.setItem(`alarm_dismissed_${today}`, "1");
    setAlarmDismissed(true);
    setAlarmFired(false);
  }, []);

  return { alarmFired: alarmFired && !alarmDismissed, dismiss };
}

/* ─── Confetti ───────────────────────────────────────────────── */
function Confetti() {
  const particles = Array.from({ length: 30 });
  const colors = ["#F59E0B", "#38BDF8", "#22C55E", "#F472B6", "#A78BFA"];
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
      {particles.map((_, i) => {
        const color = colors[i % colors.length];
        const left = `${Math.random() * 100}%`;
        const delay = `${Math.random() * 1.5}s`;
        const duration = `${1.5 + Math.random() * 1.5}s`;
        const size = `${8 + Math.floor(Math.random() * 10)}px`;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              top: "-20px",
              left,
              width: size,
              height: size,
              background: color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              animation: `confettiFall ${duration} ${delay} ease-in forwards`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ─── Alarm Screen ───────────────────────────────────────────── */
function AlarmScreen({
  childName,
  alarmTime,
  welcomeMessage,
  onDismiss,
}: {
  childName: string;
  alarmTime: string;
  welcomeMessage: string;
  onDismiss: () => void;
}) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-40 text-white"
      style={{ background: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)" }}
    >
      <div className="text-center px-8 space-y-6 max-w-sm w-full">
        {/* Pulsing sun */}
        <div
          className="text-8xl mx-auto select-none"
          style={{ animation: "sunPulse 1.5s ease-in-out infinite" }}
        >
          ☀️
        </div>
        <style>{`
          @keyframes sunPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.12); }
          }
        `}</style>

        <div className="space-y-2">
          <p className="text-2xl font-bold opacity-90">Good Morning,</p>
          <h1 className="text-5xl font-extrabold leading-tight">{childName}!</h1>
        </div>

        <div
          className="bg-white/20 rounded-3xl px-6 py-4"
          style={{ backdropFilter: "blur(8px)" }}
        >
          <p className="text-6xl font-black tracking-tight">{alarmTime}</p>
        </div>

        <p className="text-lg font-medium opacity-90 leading-relaxed">{welcomeMessage}</p>

        <button
          onClick={onDismiss}
          className="w-full py-5 rounded-3xl text-2xl font-bold shadow-2xl transition-transform active:scale-95"
          style={{ background: "#fff", color: "#F59E0B" }}
        >
          I'm Awake! 👋
        </button>
      </div>
    </div>
  );
}

/* ─── Step Card ──────────────────────────────────────────────── */
function StepCard({
  step,
  stepNumber,
  totalSteps,
  isCompleted,
  isActive,
  onComplete,
}: {
  step: TRoutineStep;
  stepNumber: number;
  totalSteps: number;
  isCompleted: boolean;
  isActive: boolean;
  onComplete: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center justify-between min-h-screen px-6 py-8 text-center"
      style={{ background: isCompleted ? "#F0FDF4" : "#FFFBF5" }}
    >
      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-stone-500">
            Step {stepNumber} of {totalSteps}
          </span>
          <span className="text-sm font-semibold text-stone-500">
            {Math.round((stepNumber / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(stepNumber / totalSteps) * 100}%`,
              background: "linear-gradient(90deg, #F59E0B, #F97316)",
            }}
          />
        </div>
        {/* Star trail */}
        <div className="flex gap-1 justify-center mt-3">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span key={i} className="text-lg transition-all duration-300">
              {i < stepNumber ? "⭐" : "☆"}
            </span>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-8">
        {/* Emoji icon */}
        <div
          className="text-9xl leading-none select-none"
          style={{
            animation: isCompleted ? "bounce 0.5s ease-in-out" : undefined,
          }}
        >
          {isCompleted ? "✅" : step.emoji}
        </div>
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.25); }
          }
        `}</style>

        <div className="space-y-3">
          <h2
            className="font-extrabold leading-tight"
            style={{ fontSize: "clamp(2rem, 7vw, 3rem)", color: "#1C1917" }}
          >
            {step.title}
          </h2>
          <p className="text-xl text-stone-500 leading-relaxed max-w-xs mx-auto">
            {step.description}
          </p>
          {step.durationMinutes > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-700 rounded-full px-4 py-1.5 text-base font-semibold">
              <span>⏱</span>
              <span>~{step.durationMinutes} min</span>
            </div>
          )}
        </div>
      </div>

      {/* Action button */}
      <div className="w-full max-w-xs space-y-4">
        {isCompleted ? (
          <div className="flex items-center justify-center gap-3 py-5 rounded-3xl bg-green-100 text-green-700 text-2xl font-bold">
            <span>✅</span>
            <span>Done!</span>
          </div>
        ) : (
          <button
            onClick={onComplete}
            disabled={!isActive}
            className="w-full py-5 rounded-3xl text-2xl font-bold text-white shadow-lg transition-all duration-150 active:scale-95 disabled:opacity-50"
            style={{
              background: isActive
                ? "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)"
                : "#e5e7eb",
              color: isActive ? "#fff" : "#9ca3af",
            }}
          >
            Done! ✓
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── All Done Screen ────────────────────────────────────────── */
function AllDoneScreen({
  childName,
  completionMessage,
  onReset,
}: {
  childName: string;
  completionMessage: string;
  onReset: () => void;
}) {
  return (
    <>
      <Confetti />
      <div
        className="fixed inset-0 flex flex-col items-center justify-center text-white z-30"
        style={{ background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)" }}
      >
        <div className="text-center px-8 space-y-6 max-w-sm w-full">
          <div
            className="text-9xl mx-auto"
            style={{ animation: "starBurst 0.6s ease-out" }}
          >
            🌟
          </div>
          <style>{`
            @keyframes starBurst {
              0% { transform: scale(0) rotate(-30deg); opacity: 0; }
              70% { transform: scale(1.3) rotate(5deg); opacity: 1; }
              100% { transform: scale(1) rotate(0deg); }
            }
          `}</style>

          <div className="space-y-2">
            <h1 className="text-5xl font-extrabold leading-tight">You Did It!</h1>
            <p className="text-2xl font-bold opacity-90">{childName} 🎉</p>
          </div>

          <div className="bg-white/20 rounded-3xl px-6 py-4 space-y-1">
            <p className="text-lg font-medium leading-relaxed">{completionMessage}</p>
          </div>

          <div className="flex gap-3 flex-col">
            <Link
              to="/parent"
              className="w-full py-4 rounded-3xl text-lg font-bold bg-white text-green-600 text-center block shadow-lg"
            >
              Parent View
            </Link>
            <button
              onClick={onReset}
              className="w-full py-3 rounded-3xl text-base font-semibold bg-white/20 text-white"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function IndexPage() {
  const { config, loading } = useConfigurables();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [allDone, setAllDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const initializedRef = useRef(false);

  const childName = (config as any)?.childName || "Buddy";
  const alarmTime: string = (config as any)?.alarmTime || "06:30";
  const welcomeMessage: string =
    (config as any)?.welcomeMessage || "Good morning! Time to rise and shine! ☀️";
  const completionMessage: string =
    (config as any)?.completionMessage || "Amazing! You are ready for school! 🎉";
  const steps: TRoutineStep[] = (config as any)?.routineSteps || [];

  const { alarmFired, dismiss: dismissAlarm } = useAlarm(alarmTime);

  // Load today's progress from server
  useEffect(() => {
    if (loading || steps.length === 0 || initializedRef.current) return;
    initializedRef.current = true;

    fetchToday(steps.length)
      .then((data) => {
        if (data) {
          setCompletedIds(data.completedStepIds || []);
          if (data.fullyCompleted) {
            setAllDone(true);
            setCurrentStepIndex(steps.length - 1);
          } else {
            // Find the first incomplete step
            const firstIncomplete = steps.findIndex(
              (s) => !data.completedStepIds.includes(s.id)
            );
            setCurrentStepIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
          }
        }
        setDataLoaded(true);
      })
      .catch(() => setDataLoaded(true));
  }, [loading, steps]);

  const handleStepComplete = useCallback(
    async (step: TRoutineStep) => {
      try {
        const data = await completeStep(step.id, steps.length);
        if (data) {
          setCompletedIds(data.completedStepIds);
          if (data.fullyCompleted) {
            setAllDone(true);
          } else {
            // Advance to next incomplete step
            const nextIndex = steps.findIndex(
              (s) => !data.completedStepIds.includes(s.id)
            );
            if (nextIndex >= 0) {
              setCurrentStepIndex(nextIndex);
            }
          }
        }
      } catch (e) {
        console.error("Failed to complete step", e);
      }
    },
    [steps]
  );

  const handleReset = useCallback(async () => {
    await resetRoutine();
    setCompletedIds([]);
    setAllDone(false);
    setCurrentStepIndex(0);
    initializedRef.current = false;
  }, []);

  if (loading || !dataLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-pulse">☀️</div>
          <p className="text-xl font-bold text-amber-600">Loading Morning Buddy...</p>
        </div>
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 px-6 text-center space-y-6">
        <div className="text-8xl">🌅</div>
        <h1 className="text-4xl font-extrabold text-stone-800">Morning Buddy</h1>
        <p className="text-xl text-stone-500">No routine steps configured yet.</p>
        <Link
          to="/parent"
          className="px-8 py-4 rounded-3xl text-xl font-bold text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)" }}
        >
          Set Up Routine
        </Link>
      </div>
    );
  }

  return (
    <>
      {alarmFired && (
        <AlarmScreen
          childName={childName}
          alarmTime={alarmTime}
          welcomeMessage={welcomeMessage}
          onDismiss={dismissAlarm}
        />
      )}

      {allDone ? (
        <AllDoneScreen
          childName={childName}
          completionMessage={completionMessage}
          onReset={handleReset}
        />
      ) : (
        <div className="relative">
          {/* Parent link (top corner, discreet) */}
          <Link
            to="/parent"
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow text-lg"
            title="Parent Mode"
          >
            👨‍👩‍👧
          </Link>

          {/* Step cards — horizontally scrollable strip (shows current step) */}
          <div className="overflow-hidden">
            <StepCard
              key={steps[currentStepIndex].id}
              step={steps[currentStepIndex]}
              stepNumber={currentStepIndex + 1}
              totalSteps={steps.length}
              isCompleted={completedIds.includes(steps[currentStepIndex].id)}
              isActive={true}
              onComplete={() => handleStepComplete(steps[currentStepIndex])}
            />
          </div>

          {/* Navigate back to already-completed steps */}
          {currentStepIndex > 0 && (
            <button
              onClick={() => setCurrentStepIndex((i) => i - 1)}
              className="fixed bottom-6 left-6 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-xl"
              aria-label="Previous step"
            >
              ←
            </button>
          )}
        </div>
      )}
    </>
  );
}
