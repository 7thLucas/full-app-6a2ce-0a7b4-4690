import { Router } from "express";
import { CompletionService } from "../services/completion.service";

const router = Router();

/** GET /api/routine/today?date=YYYY-MM-DD&totalSteps=N */
router.get("/api/routine/today", async (req, res) => {
  try {
    const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);
    const totalSteps = parseInt((req.query.totalSteps as string) || "5", 10);
    const record = await CompletionService.getOrCreateToday(date, totalSteps);
    res.json({ success: true, data: record });
  } catch (err) {
    console.error("[routine] GET today error:", err);
    res.status(500).json({ success: false, error: "Failed to get today record" });
  }
});

/** POST /api/routine/step/complete */
router.post("/api/routine/step/complete", async (req, res) => {
  try {
    const { date, stepId, totalSteps } = req.body;
    if (!date || !stepId || !totalSteps) {
      return res.status(400).json({ success: false, error: "date, stepId, totalSteps required" });
    }
    const record = await CompletionService.markStep(date, stepId, totalSteps);
    return res.json({ success: true, data: record });
  } catch (err) {
    console.error("[routine] POST step complete error:", err);
    return res.status(500).json({ success: false, error: "Failed to mark step" });
  }
});

/** POST /api/routine/step/uncomplete */
router.post("/api/routine/step/uncomplete", async (req, res) => {
  try {
    const { date, stepId } = req.body;
    if (!date || !stepId) {
      return res.status(400).json({ success: false, error: "date and stepId required" });
    }
    const record = await CompletionService.unmarkStep(date, stepId);
    return res.json({ success: true, data: record });
  } catch (err) {
    console.error("[routine] POST step uncomplete error:", err);
    return res.status(500).json({ success: false, error: "Failed to unmark step" });
  }
});

/** POST /api/routine/reset */
router.post("/api/routine/reset", async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ success: false, error: "date required" });
    }
    await CompletionService.resetToday(date);
    return res.json({ success: true });
  } catch (err) {
    console.error("[routine] POST reset error:", err);
    return res.status(500).json({ success: false, error: "Failed to reset" });
  }
});

/** GET /api/routine/history?days=7 */
router.get("/api/routine/history", async (req, res) => {
  try {
    const days = parseInt((req.query.days as string) || "7", 10);
    const history = await CompletionService.getHistory(days);
    return res.json({ success: true, data: history });
  } catch (err) {
    console.error("[routine] GET history error:", err);
    return res.status(500).json({ success: false, error: "Failed to get history" });
  }
});

export default router;
