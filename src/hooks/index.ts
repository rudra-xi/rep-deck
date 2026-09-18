import { useMounted } from "./account-hook/use-mounted";
import { usePreferences } from "./account-hook/use-preferences";
import { useProfileForm } from "./account-hook/use-profile-form";
import {
	THEME_OPTIONS,
	useThemeSelection,
	type ThemeSlug,
} from "./account-hook/use-theme-selection";

import { useChallenge } from "./dashboard-hook/use-challenge";
import { useDashboardData } from "./dashboard-hook/use-dashboard-data";
import { useKpiCards } from "./dashboard-hook/use-kpi-cards";
import { useLastWorkout } from "./dashboard-hook/use-last-workout";
import { useStrengthChart } from "./dashboard-hook/use-strength-chart";

import { useDataQuality } from "./metrics-hook/use-data-quality";
import { useMeasurementReminders } from "./metrics-hook/use-measurement-reminders";
import { useMuscleSizeTrend } from "./metrics-hook/use-muscle-size-trend";
import { useQuickAddMeasurement } from "./metrics-hook/use-quick-add-measurement";
import { useQuickStats } from "./metrics-hook/use-quick-stats";

import { useDialog } from "./plans-hook/use-dialog";
import { useDialogForm } from "./plans-hook/use-dialog-form";
import { useFormField } from "./plans-hook/use-form-field";

import { useBodyMetrics } from "./progress-hook/use-body-metrics";
import { useLiftDetails } from "./progress-hook/use-lift-details";
import { useSessionHistory } from "./progress-hook/use-session-history";
import { useStrengthOverview } from "./progress-hook/use-strength-overview";
import { useTrainingFrequency } from "./progress-hook/use-training-frequency";
import { useAllMeasurements } from "./progress-hook/use-all-measurements";

import { useExerciseInputs } from "./workout-log-hook/use-exercise-inputs";
import { useExercisePerformance } from "./workout-log-hook/use-exercise-performance";
import { useRangedInput } from "./workout-log-hook/use-ranged-input";
import { useWorkoutDraft } from "./workout-log-hook/use-workout-draft";
import { useWorkoutSession } from "./workout-log-hook/use-workout-session";

import { useToastPosition } from "./use-toast-position";

export {
	useToastPosition,
	useDialog,
	useDialogForm,
	useFormField,
	useRangedInput,
	useWorkoutDraft,
	useExerciseInputs,
	useExercisePerformance,
	useWorkoutSession,
	useChallenge,
	useStrengthChart,
	useDashboardData,
	useKpiCards,
	useLastWorkout,
	useBodyMetrics,
	useLiftDetails,
	useSessionHistory,
	useStrengthOverview,
	useAllMeasurements,
	useTrainingFrequency,
	useDataQuality,
	useMeasurementReminders,
	useMuscleSizeTrend,
	useQuickAddMeasurement,
	useQuickStats,
	useThemeSelection,
	THEME_OPTIONS,
	ThemeSlug,
	usePreferences,
	useMounted,
	useProfileForm,
};
