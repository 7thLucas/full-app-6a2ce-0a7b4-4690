import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

/**
 * Tracks which routine steps were completed on a given date.
 */
@modelOptions({
  schemaOptions: {
    collection: "tbl_routine_completions",
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class RoutineCompletion extends CommonTypegooseEntity {
  /** ISO date string, e.g. "2025-06-13" */
  @prop({ type: String, required: true })
  date!: string;

  /** Step IDs that were completed */
  @prop({ type: () => [String], default: [] })
  completedStepIds!: string[];

  /** Total steps in the routine on that day */
  @prop({ type: Number, default: 0 })
  totalSteps!: number;

  /** Whether all steps were completed */
  @prop({ type: Boolean, default: false })
  fullyCompleted!: boolean;

  /** Timestamp when the routine was fully completed */
  @prop({ type: Date, required: false })
  completedAt?: Date;
}

export const RoutineCompletionModel = getModelForClass(RoutineCompletion);
