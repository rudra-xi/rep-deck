import "dotenv/config";
import { eq } from "drizzle-orm";
import {
	bodyMeasurements,
	db,
	exerciseTemplates,
	programDayTemplates,
	programTemplates,
	users,
	workoutSessions,
	workoutSets,
} from "./index";

const USER_ID = "2e2a4a9f-8fe9-470e-8b21-c58e67e8d8ea";

const daysAgo = (n: number, hour = 18, minute = 0) => {
	const d = new Date();
	d.setDate(d.getDate() - n);
	d.setHours(hour, minute, 0, 0);
	return d;
};

function rand(seed: number): number {
	const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
	return x - Math.floor(x);
}

async function seedUser() {
	await db.delete(users).where(eq(users.id, USER_ID));

	await db.insert(users).values({
		id: USER_ID,
		email: "rudra@repdeck.app",
		name: "rudra",
		avatarSeed: "thumb-2e2a4a9t",
	});
	console.log("✓ User seeded");
}

async function seedPrograms() {
	await db
		.delete(programTemplates)
		.where(eq(programTemplates.userId, USER_ID));

	const [v1] = await db
		.insert(programTemplates)
		.values({
			userId: USER_ID,
			name: "Hypertrophy Foundation",
			version: 1,
			startDate: daysAgo(365),
			endDate: daysAgo(240),
			active: false,
		})
		.returning();

	const [v1d1] = await db
		.insert(programDayTemplates)
		.values({ programId: v1.id, dayIndex: 1, label: "Push" })
		.returning();
	const [v1d2] = await db
		.insert(programDayTemplates)
		.values({ programId: v1.id, dayIndex: 2, label: "Pull" })
		.returning();
	const [v1d3] = await db
		.insert(programDayTemplates)
		.values({ programId: v1.id, dayIndex: 3, label: "Legs" })
		.returning();

	await db.insert(exerciseTemplates).values([
		{
			programDayId: v1d1.id,
			name: "Bench Press",
			type: "Chest",
			order: 1,
			targetSets: 4,
			targetRepRange: "8-10",
		},
		{
			programDayId: v1d1.id,
			name: "Incline Dumbbell Press",
			type: "Chest",
			order: 2,
			targetSets: 3,
			targetRepRange: "10-12",
		},
		{
			programDayId: v1d1.id,
			name: "Cable Flyes",
			type: "Chest",
			order: 3,
			targetSets: 3,
			targetRepRange: "12-15",
		},
		{
			programDayId: v1d1.id,
			name: "Overhead Press",
			type: "Shoulders",
			order: 4,
			targetSets: 3,
			targetRepRange: "8-10",
		},
		{
			programDayId: v1d1.id,
			name: "Lateral Raise",
			type: "Shoulders",
			order: 5,
			targetSets: 4,
			targetRepRange: "12-15",
		},
		{
			programDayId: v1d2.id,
			name: "Barbell Row",
			type: "Back",
			order: 1,
			targetSets: 4,
			targetRepRange: "8-10",
		},
		{
			programDayId: v1d2.id,
			name: "Lat Pulldown",
			type: "Back",
			order: 2,
			targetSets: 3,
			targetRepRange: "10-12",
		},
		{
			programDayId: v1d2.id,
			name: "Dumbbell Row",
			type: "Back",
			order: 3,
			targetSets: 3,
			targetRepRange: "10-12",
		},
		{
			programDayId: v1d2.id,
			name: "Barbell Curl",
			type: "Biceps",
			order: 4,
			targetSets: 4,
			targetRepRange: "10-12",
		},
		{
			programDayId: v1d2.id,
			name: "Face Pull",
			type: "Shoulders",
			order: 5,
			targetSets: 3,
			targetRepRange: "15-20",
		},
		{
			programDayId: v1d3.id,
			name: "Barbell Squat",
			type: "Legs",
			order: 1,
			targetSets: 4,
			targetRepRange: "8-10",
		},
		{
			programDayId: v1d3.id,
			name: "Romanian Deadlift",
			type: "Legs",
			order: 2,
			targetSets: 3,
			targetRepRange: "10-12",
		},
		{
			programDayId: v1d3.id,
			name: "Leg Press",
			type: "Legs",
			order: 3,
			targetSets: 3,
			targetRepRange: "10-12",
		},
		{
			programDayId: v1d3.id,
			name: "Leg Curl",
			type: "Legs",
			order: 4,
			targetSets: 3,
			targetRepRange: "12-15",
		},
		{
			programDayId: v1d3.id,
			name: "Calf Raise",
			type: "Legs",
			order: 5,
			targetSets: 4,
			targetRepRange: "15-20",
		},
	]);

	const [v2] = await db
		.insert(programTemplates)
		.values({
			userId: USER_ID,
			name: "Strength Block",
			version: 2,
			startDate: daysAgo(240),
			endDate: daysAgo(120),
			active: false,
		})
		.returning();

	const [v2d1] = await db
		.insert(programDayTemplates)
		.values({ programId: v2.id, dayIndex: 1, label: "Upper Power" })
		.returning();
	const [v2d2] = await db
		.insert(programDayTemplates)
		.values({ programId: v2.id, dayIndex: 2, label: "Lower Power" })
		.returning();
	const [v2d3] = await db
		.insert(programDayTemplates)
		.values({ programId: v2.id, dayIndex: 3, label: "Upper Volume" })
		.returning();
	const [v2d4] = await db
		.insert(programDayTemplates)
		.values({ programId: v2.id, dayIndex: 4, label: "Lower Volume" })
		.returning();

	await db.insert(exerciseTemplates).values([
		{
			programDayId: v2d1.id,
			name: "Bench Press",
			type: "Chest",
			order: 1,
			targetSets: 4,
			targetRepRange: "4-6",
		},
		{
			programDayId: v2d1.id,
			name: "Barbell Row",
			type: "Back",
			order: 2,
			targetSets: 4,
			targetRepRange: "5-6",
		},
		{
			programDayId: v2d1.id,
			name: "Overhead Press",
			type: "Shoulders",
			order: 3,
			targetSets: 4,
			targetRepRange: "5-6",
		},
		{
			programDayId: v2d1.id,
			name: "Barbell Curl",
			type: "Biceps",
			order: 4,
			targetSets: 3,
			targetRepRange: "6-8",
		},
		{
			programDayId: v2d2.id,
			name: "Barbell Squat",
			type: "Legs",
			order: 1,
			targetSets: 5,
			targetRepRange: "3-5",
		},
		{
			programDayId: v2d2.id,
			name: "Deadlift",
			type: "Back",
			order: 2,
			targetSets: 3,
			targetRepRange: "3-5",
		},
		{
			programDayId: v2d2.id,
			name: "Leg Press",
			type: "Legs",
			order: 3,
			targetSets: 3,
			targetRepRange: "6-8",
		},
		{
			programDayId: v2d2.id,
			name: "Calf Raise",
			type: "Legs",
			order: 4,
			targetSets: 4,
			targetRepRange: "8-10",
		},
		{
			programDayId: v2d3.id,
			name: "Incline Bench Press",
			type: "Chest",
			order: 1,
			targetSets: 4,
			targetRepRange: "8-10",
		},
		{
			programDayId: v2d3.id,
			name: "Dumbbell Row",
			type: "Back",
			order: 2,
			targetSets: 4,
			targetRepRange: "10-12",
		},
		{
			programDayId: v2d3.id,
			name: "Lat Pulldown",
			type: "Back",
			order: 3,
			targetSets: 3,
			targetRepRange: "10-12",
		},
		{
			programDayId: v2d3.id,
			name: "Face Pull",
			type: "Shoulders",
			order: 4,
			targetSets: 3,
			targetRepRange: "15-20",
		},
		{
			programDayId: v2d4.id,
			name: "Romanian Deadlift",
			type: "Legs",
			order: 1,
			targetSets: 4,
			targetRepRange: "8-10",
		},
		{
			programDayId: v2d4.id,
			name: "Front Squat",
			type: "Legs",
			order: 2,
			targetSets: 3,
			targetRepRange: "8-10",
		},
		{
			programDayId: v2d4.id,
			name: "Leg Curl",
			type: "Legs",
			order: 3,
			targetSets: 3,
			targetRepRange: "12-15",
		},
	]);

	const [v3] = await db
		.insert(programTemplates)
		.values({
			userId: USER_ID,
			name: "Power & Peak",
			version: 3,
			startDate: daysAgo(120),
			active: true,
		})
		.returning();

	const [v3d1] = await db
		.insert(programDayTemplates)
		.values({ programId: v3.id, dayIndex: 1, label: "Heavy Push" })
		.returning();
	const [v3d2] = await db
		.insert(programDayTemplates)
		.values({ programId: v3.id, dayIndex: 2, label: "Heavy Pull" })
		.returning();
	const [v3d3] = await db
		.insert(programDayTemplates)
		.values({ programId: v3.id, dayIndex: 3, label: "Squat Focus" })
		.returning();
	await db
		.insert(programDayTemplates)
		.values({ programId: v3.id, dayIndex: 4, label: "Rest" });
	const [v3d5] = await db
		.insert(programDayTemplates)
		.values({ programId: v3.id, dayIndex: 5, label: "Hypertrophy Push" })
		.returning();
	const [v3d6] = await db
		.insert(programDayTemplates)
		.values({ programId: v3.id, dayIndex: 6, label: "Deadlift Focus" })
		.returning();

	await db.insert(exerciseTemplates).values([
		{
			programDayId: v3d1.id,
			name: "Bench Press",
			type: "Chest",
			order: 1,
			targetSets: 4,
			targetRepRange: "4-6",
		},
		{
			programDayId: v3d1.id,
			name: "Overhead Press",
			type: "Shoulders",
			order: 2,
			targetSets: 4,
			targetRepRange: "4-6",
		},
		{
			programDayId: v3d1.id,
			name: "Incline Dumbbell Press",
			type: "Chest",
			order: 3,
			targetSets: 3,
			targetRepRange: "8-10",
		},
		{
			programDayId: v3d1.id,
			name: "Cable Flyes",
			type: "Chest",
			order: 4,
			targetSets: 3,
			targetRepRange: "12-15",
		},
		{
			programDayId: v3d1.id,
			name: "Barbell Curl",
			type: "Biceps",
			order: 5,
			targetSets: 3,
			targetRepRange: "8-10",
		},
		{
			programDayId: v3d2.id,
			name: "Deadlift",
			type: "Back",
			order: 1,
			targetSets: 4,
			targetRepRange: "3-5",
		},
		{
			programDayId: v3d2.id,
			name: "Barbell Row",
			type: "Back",
			order: 2,
			targetSets: 4,
			targetRepRange: "5-6",
		},
		{
			programDayId: v3d2.id,
			name: "Lat Pulldown",
			type: "Back",
			order: 3,
			targetSets: 3,
			targetRepRange: "8-10",
		},
		{
			programDayId: v3d2.id,
			name: "Hanging Leg Raises",
			type: "Core",
			order: 4,
			targetSets: 3,
			targetRepRange: "12-15",
		},
		{
			programDayId: v3d3.id,
			name: "Barbell Squat",
			type: "Legs",
			order: 1,
			targetSets: 5,
			targetRepRange: "3-5",
		},
		{
			programDayId: v3d3.id,
			name: "Romanian Deadlift",
			type: "Legs",
			order: 2,
			targetSets: 3,
			targetRepRange: "8-10",
		},
		{
			programDayId: v3d3.id,
			name: "Lateral Raise",
			type: "Shoulders",
			order: 3,
			targetSets: 4,
			targetRepRange: "12-15",
		},
		{
			programDayId: v3d5.id,
			name: "Incline Bench Press",
			type: "Chest",
			order: 1,
			targetSets: 4,
			targetRepRange: "8-10",
		},
		{
			programDayId: v3d5.id,
			name: "Dumbbell Row",
			type: "Back",
			order: 2,
			targetSets: 4,
			targetRepRange: "10-12",
		},
		{
			programDayId: v3d5.id,
			name: "Face Pull",
			type: "Shoulders",
			order: 3,
			targetSets: 4,
			targetRepRange: "15-20",
		},
		{
			programDayId: v3d6.id,
			name: "Front Squat",
			type: "Legs",
			order: 1,
			targetSets: 4,
			targetRepRange: "6-8",
		},
		{
			programDayId: v3d6.id,
			name: "Leg Press",
			type: "Legs",
			order: 2,
			targetSets: 3,
			targetRepRange: "10-12",
		},
		{
			programDayId: v3d6.id,
			name: "Calf Raise",
			type: "Legs",
			order: 3,
			targetSets: 4,
			targetRepRange: "12-15",
		},
	]);

	console.log("✓ Programs seeded:");
	console.log("  • v1 — Hypertrophy Foundation (archived)");
	console.log("  • v2 — Strength Block (archived)");
	console.log("  • v3 — Power & Peak (active)");

	return { v3 };
}

const LIFT_TARGETS = {
	squat: { start: 105, end: 148, step: 2.5, jitter: 0.03, deloadEvery: 22 },
	bench: { start: 75, end: 95, step: 2.5, jitter: 0.03, deloadEvery: 22 },
	deadlift: { start: 135, end: 175, step: 5, jitter: 0.035, deloadEvery: 20 },
	ohp: { start: 50, end: 62.5, step: 1.25, jitter: 0.04, deloadEvery: 24 },
};

function targetWeight(
	lift: "squat" | "bench" | "deadlift" | "ohp",
	sessionIndex: number,
	totalSessions: number,
): { weight: number; isDeload: boolean } {
	const cfg = LIFT_TARGETS[lift];
	const progress = sessionIndex / totalSessions;

	const trend = cfg.start + (cfg.end - cfg.start) * progress;

	const isDeload =
		cfg.deloadEvery > 0 &&
		sessionIndex > 0 &&
		sessionIndex % cfg.deloadEvery === 0;

	const jitterRoll = (rand(sessionIndex * 3 + lift.length * 7) - 0.5) * 2;
	let w = trend * (1 + cfg.jitter * jitterRoll);

	if (!isDeload && rand(sessionIndex * 7 + 13) < 0.12) {
		w -= cfg.step;
	}

	if (rand(sessionIndex * 11 + 5) < 0.05) {
		w *= 0.95;
	}

	if (isDeload) {
		w *= 0.9;
	}

	w = Math.round(w / 2.5) * 2.5;

	return { weight: w, isDeload };
}

async function seedWorkouts(programIds: { v3: any }) {
	await db.delete(workoutSessions).where(eq(workoutSessions.userId, USER_ID));

	const TOTAL_SESSIONS = 100;
	const START_DAYS_AGO = 182;

	const dayCycle = [
		{ dayIndex: 1, label: "Heavy Push" },
		{ dayIndex: 2, label: "Heavy Pull" },
		{ dayIndex: 3, label: "Squat Focus" },
		{ dayIndex: 5, label: "Hypertrophy Push" },
		{ dayIndex: 6, label: "Deadlift Focus" },
	];

	const setsToInsert: any[] = [];
	let actualSessions = 0;
	const liftCounters = { squat: 0, bench: 0, deadlift: 0, ohp: 0 };

	for (let i = 0; i < TOTAL_SESSIONS; i++) {
		const daysBack = Math.floor(START_DAYS_AGO - i * 1.82);
		if (daysBack < 0) break;

		const cycle = dayCycle[i % dayCycle.length];
		const sessionDate = daysAgo(daysBack, 17 + (i % 4), (i * 13) % 60);

		if (sessionDate > new Date()) continue;

		const [session] = await db
			.insert(workoutSessions)
			.values({
				userId: USER_ID,
				programId: programIds.v3.id,
				dayIndex: cycle.dayIndex,
				date: sessionDate,
				notes:
					i % 9 === 0
						? "Felt strong today. Bar speed was excellent."
						: i % 14 === 0
							? "Slight shoulder tightness on OHP — kept RPE in check."
							: i % 21 === 0
								? "Hit a new PR on the main lift — everything clicked."
								: i % 17 === 0
									? "Tired from poor sleep. Just hit the working weights, no extras."
									: null,
			})
			.returning();

		const setsForDay = generateSetsForDay(
			cycle.dayIndex,
			i,
			TOTAL_SESSIONS,
			liftCounters,
			session.id,
		);
		setsToInsert.push(...setsForDay);
		actualSessions++;
	}

	if (setsToInsert.length > 0) {
		const CHUNK = 200;
		for (let i = 0; i < setsToInsert.length; i += CHUNK) {
			await db
				.insert(workoutSets)
				.values(setsToInsert.slice(i, i + CHUNK));
		}
	}

	console.log(
		`✓ Workouts seeded (${actualSessions} sessions, ${setsToInsert.length} sets)`,
	);
}

function generateSetsForDay(
	dayIndex: number,
	sessionIndex: number,
	totalSessions: number,
	liftCounters: {
		squat: number;
		bench: number;
		deadlift: number;
		ohp: number;
	},
	sessionId: string,
) {
	const sets: any[] = [];

	const pushExercise = (
		exerciseName: string,
		setsCount: number,
		reps: number,
		opts: {
			lift?: "squat" | "bench" | "deadlift" | "ohp";
			baseWeight?: number;
		} = {},
	) => {
		for (let s = 1; s <= setsCount; s++) {
			let weight: number;
			let isPR = false;

			if (opts.lift) {
				const liftIdx = liftCounters[opts.lift];
				const totalLiftSessions = Math.floor(totalSessions / 5);

				const result = targetWeight(
					opts.lift,
					liftIdx,
					totalLiftSessions,
				);
				weight = result.weight;

				isPR =
					s === 1 &&
					liftIdx > 3 &&
					liftIdx % 8 === 0 &&
					!result.isDeload;
			} else {
				const base = opts.baseWeight ?? 20;
				const progressionStep = 1.25;
				const steps = Math.floor(sessionIndex / 6);
				weight = base + steps * progressionStep;
				const jit =
					(rand(sessionIndex * 5 + exerciseName.length) - 0.5) * 2;
				weight *= 1 + 0.03 * jit;
				weight = Math.round(weight / 1.25) * 1.25;
			}

			const rpe =
				s === setsCount ? 8.5 : s === setsCount - 1 ? 8 : 7 + s * 0.3;

			sets.push({
				sessionId,
				exerciseName,
				setNumber: s,
				weight,
				reps,
				rpe: Number(rpe.toFixed(1)),
				notes: null,
				isPR,
			});
		}

		if (opts.lift) {
			liftCounters[opts.lift]++;
		}
	};

	if (dayIndex === 1) {
		pushExercise("Bench Press", 4, 5, { lift: "bench" });
		pushExercise("Overhead Press", 4, 5, { lift: "ohp" });
		pushExercise("Incline Dumbbell Press", 3, 9, { baseWeight: 30 });
		pushExercise("Cable Flyes", 3, 13, { baseWeight: 15 });
		pushExercise("Barbell Curl", 3, 9, { baseWeight: 32 });
	} else if (dayIndex === 2) {
		pushExercise("Deadlift", 4, 4, { lift: "deadlift" });
		pushExercise("Barbell Row", 4, 6, { baseWeight: 70 });
		pushExercise("Lat Pulldown", 3, 9, { baseWeight: 58 });
		pushExercise("Hanging Leg Raises", 3, 14, { baseWeight: 0 });
	} else if (dayIndex === 3) {
		pushExercise("Barbell Squat", 5, 4, { lift: "squat" });
		pushExercise("Romanian Deadlift", 3, 9, { baseWeight: 85 });
		pushExercise("Lateral Raise", 4, 13, { baseWeight: 12 });
	} else if (dayIndex === 5) {
		pushExercise("Incline Bench Press", 4, 9, { baseWeight: 62 });
		pushExercise("Dumbbell Row", 4, 11, { baseWeight: 34 });
		pushExercise("Face Pull", 4, 17, { baseWeight: 25 });
	} else if (dayIndex === 6) {
		pushExercise("Front Squat", 4, 7, { baseWeight: 78 });
		pushExercise("Leg Press", 3, 11, { baseWeight: 165 });
		pushExercise("Calf Raise", 4, 13, { baseWeight: 62 });
	}

	return sets;
}

async function seedMeasurements() {
	await db
		.delete(bodyMeasurements)
		.where(eq(bodyMeasurements.userId, USER_ID));

	const entries: any[] = [];
	const WEEKS = 26;
	const START_DAYS_AGO = 182;

	for (let w = 0; w <= WEEKS; w++) {
		const daysBack = START_DAYS_AGO - w * 7;
		if (daysBack < 0) break;

		const progress = w / WEEKS;

		const weightNoise = (rand(w * 3 + 1) - 0.5) * 0.6;
		const weightKg = 78 - progress * 4 + weightNoise;

		const bfNoise = (rand(w * 5 + 3) - 0.5) * 0.4;
		const bodyFatPercent = 18 - progress * 5 + bfNoise;

		const noise = () => (rand(w * 7 + 11) - 0.5) * 0.2;

		entries.push({
			userId: USER_ID,
			date: daysAgo(daysBack, 7 + (w % 2), (w * 17) % 40),
			weightKg: Number(weightKg.toFixed(1)),
			bodyFatPercent: Number(bodyFatPercent.toFixed(1)),
			armsIn: Number((14.8 + progress * 1.2 + noise() * 0.3).toFixed(2)),
			forearmsIn: Number(
				(12.2 + progress * 0.6 + noise() * 0.2).toFixed(2),
			),
			thighsIn: Number(
				(22.0 + progress * 1.5 + noise() * 0.4).toFixed(2),
			),
			chestIn: Number((39.5 + progress * 1.0 + noise() * 0.3).toFixed(2)),
			waistIn: Number(
				(33.0 - progress * 1.2 + noise() * 0.25).toFixed(2),
			),
			hipsIn: Number((37.5 - progress * 0.5 + noise() * 0.2).toFixed(2)),
			notes:
				w === 0
					? "Starting measurements for this block."
					: w % 9 === 0
						? "Morning weigh-in, fasted state."
						: w % 13 === 0
							? "Waist coming down — cut is on track."
							: w % 20 === 0
								? "Trained fasted this morning, felt light."
								: null,
		});
	}

	await db.insert(bodyMeasurements).values(entries);
	console.log(`✓ Measurements seeded (${entries.length} entries)`);
}

async function seed() {
	console.log("\n🌱 Seeding 6 months of realistic photoshoot data...\n");

	await seedUser();
	const programIds = await seedPrograms();
	await seedWorkouts(programIds);
	await seedMeasurements();

	console.log("\n✅ Done!\n");
	console.log("Programs:");
	console.log("  v1 — Hypertrophy Foundation  (archived, ~4mo ago)");
	console.log("  v2 — Strength Block           (archived, ~2mo ago)");
	console.log("  v3 — Power & Peak             (active)\n");
	console.log("Lift anchors (with deloads + jitter):");
	console.log("  • Squat:    105 kg → 148 kg");
	console.log("  • Bench:     75 kg →  95 kg");
	console.log("  • Deadlift: 135 kg → 175 kg");
	console.log("  • OHP:       50 kg → 62.5 kg");
	console.log("  • Weight:    78 kg →  74 kg (±0.3 noise)");
	console.log("  • Body fat:  18% →  13%\n");

	process.exit(0);
}

seed().catch((e) => {
	console.error("❌ Seed failed:", e);
	process.exit(1);
});
