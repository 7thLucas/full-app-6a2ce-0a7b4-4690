/**
 * Client-side helpers for the Morning Buddy routine API.
 */

export function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function fetchToday(totalSteps: number) {
  const date = todayDate();
  const res = await fetch(`/api/routine/today?date=${date}&totalSteps=${totalSteps}`);
  const json = await res.json();
  return json.data as { completedStepIds: string[]; fullyCompleted: boolean };
}

export async function completeStep(stepId: string, totalSteps: number) {
  const date = todayDate();
  const res = await fetch("/api/routine/step/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, stepId, totalSteps }),
  });
  const json = await res.json();
  return json.data as { completedStepIds: string[]; fullyCompleted: boolean };
}

export async function uncompleteStep(stepId: string) {
  const date = todayDate();
  const res = await fetch("/api/routine/step/uncomplete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, stepId }),
  });
  const json = await res.json();
  return json.data as { completedStepIds: string[]; fullyCompleted: boolean };
}

export async function resetRoutine() {
  const date = todayDate();
  await fetch("/api/routine/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date }),
  });
}

export async function fetchHistory(days = 7) {
  const res = await fetch(`/api/routine/history?days=${days}`);
  const json = await res.json();
  return json.data as Array<{
    date: string;
    completedStepIds: string[];
    totalSteps: number;
    fullyCompleted: boolean;
    completedAt?: string;
  }>;
}
