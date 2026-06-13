import { RoutineCompletionModel } from "../models/routine-completion.model";

export class CompletionService {
  /** Get or create today's record */
  static async getOrCreateToday(date: string, totalSteps: number) {
    let record = await RoutineCompletionModel.findOne({ date }).exec();
    if (!record) {
      record = await RoutineCompletionModel.create({
        date,
        completedStepIds: [],
        totalSteps,
        fullyCompleted: false,
      });
    }
    return record;
  }

  /** Mark a step completed for a given date */
  static async markStep(date: string, stepId: string, totalSteps: number) {
    let record = await RoutineCompletionModel.findOne({ date }).exec();
    if (!record) {
      record = await RoutineCompletionModel.create({
        date,
        completedStepIds: [stepId],
        totalSteps,
        fullyCompleted: totalSteps === 1,
        completedAt: totalSteps === 1 ? new Date() : undefined,
      });
      return record;
    }

    if (!record.completedStepIds.includes(stepId)) {
      record.completedStepIds.push(stepId);
    }

    const isNowComplete = record.completedStepIds.length >= totalSteps;
    record.fullyCompleted = isNowComplete;
    if (isNowComplete && !record.completedAt) {
      record.completedAt = new Date();
    }
    record.totalSteps = totalSteps;
    await record.save();
    return record;
  }

  /** Unmark a step (un-complete) for a given date */
  static async unmarkStep(date: string, stepId: string) {
    const record = await RoutineCompletionModel.findOne({ date }).exec();
    if (!record) return null;

    record.completedStepIds = record.completedStepIds.filter((id) => id !== stepId);
    record.fullyCompleted = record.completedStepIds.length >= record.totalSteps;
    if (!record.fullyCompleted) {
      record.completedAt = undefined;
    }
    await record.save();
    return record;
  }

  /** Reset today's completion */
  static async resetToday(date: string) {
    await RoutineCompletionModel.deleteOne({ date }).exec();
  }

  /** Get last N days of history (most recent first) */
  static async getHistory(days: number = 7) {
    const results = await RoutineCompletionModel.find()
      .sort({ date: -1 })
      .limit(days)
      .exec();
    return results;
  }

  /** Get a specific date record */
  static async getByDate(date: string) {
    return await RoutineCompletionModel.findOne({ date }).exec();
  }
}
