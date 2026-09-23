export const PRESET_EXERCISES = [
	// Upper Chest
	{ name: "Incline Barbell Bench Press", type: "Upper Chest" },
	{ name: "Incline Dumbbell Press", type: "Upper Chest" },
	{ name: "Low-to-High Cable Flyes", type: "Upper Chest" },
	{ name: "Incline Dumbbell Flyes", type: "Upper Chest" },
	{ name: "Reverse Grip Bench Press", type: "Upper Chest" },

	// Mid / Lower Chest
	{ name: "Flat Barbell Bench Press", type: "Chest" },
	{ name: "Flat Dumbbell Bench Press", type: "Chest" },
	{ name: "Push-Ups", type: "Chest" },
	{ name: "Pec Deck Flyes", type: "Chest" },
	{ name: "Cable Flyes", type: "Chest" },
	{ name: "Decline Barbell Bench Press", type: "Lower Chest" },
	{ name: "Decline Dumbbell Press", type: "Lower Chest" },
	{ name: "High-to-Low Cable Flyes", type: "Lower Chest" },
	{ name: "Chest Dips", type: "Lower Chest" },

	// Front / Side Shoulders
	{ name: "Overhead Barbell Press", type: "Front Delts" },
	{ name: "Dumbbell Shoulder Press", type: "Front Delts" },
	{ name: "Arnold Press", type: "Front Delts" },
	{ name: "Front Raise", type: "Front Delts" },
	{ name: "Dumbbell Lateral Raise", type: "Side Delts" },
	{ name: "Cable Lateral Raise", type: "Side Delts" },
	{ name: "Machine Lateral Raise", type: "Side Delts" },
	{ name: "Upright Row", type: "Side Delts" },

	// Rear Delts & Traps
	{ name: "Rear Delt Flyes", type: "Rear Delts" },
	{ name: "Face Pull", type: "Rear Delts" },
	{ name: "Reverse Cable Flyes", type: "Rear Delts" },
	{ name: "Band Pull-Aparts", type: "Rear Delts" },
	{ name: "Barbell Shrugs", type: "Traps" },
	{ name: "Dumbbell Shrugs", type: "Traps" },

	// Lats (Back Width)
	{ name: "Lat Pulldown", type: "Lats" },
	{ name: "Pull-Ups", type: "Lats" },
	{ name: "Chin-Ups", type: "Lats" },
	{ name: "Single-Arm Dumbbell Row", type: "Lats" },
	{ name: "Straight-Arm Cable Pushdown", type: "Lats" },
	{ name: "Chest-Supported Row", type: "Lats" },

	// Upper / Mid Back (Thickness)
	{ name: "Barbell Bent-Over Row", type: "Upper Back" },
	{ name: "Seated Cable Row", type: "Upper Back" },
	{ name: "T-Bar Row", type: "Upper Back" },
	{ name: "Meadows Row", type: "Upper Back" },
	{ name: "Rack Pulls", type: "Upper Back" },

	// Lower Back
	{ name: "Deadlift", type: "Lower Back" },
	{ name: "Good Mornings", type: "Lower Back" },
	{ name: "Hyperextensions (Back Extension)", type: "Lower Back" },

	// Quadriceps
	{ name: "Barbell Back Squat", type: "Quads" },
	{ name: "Front Squat", type: "Quads" },
	{ name: "Leg Press", type: "Quads" },
	{ name: "Leg Extension", type: "Quads" },
	{ name: "Hack Squat", type: "Quads" },
	{ name: "Goblet Squat", type: "Quads" },
	{ name: "Bulgarian Split Squat", type: "Quads" },
	{ name: "Walking Lunges", type: "Quads" },
	{ name: "Reverse Lunges", type: "Quads" },
	{ name: "Sissy Squat", type: "Quads" },
	{ name: "Step-Ups", type: "Quads" },

	// Hamstrings
	{ name: "Romanian Deadlift (RDL)", type: "Hamstrings" },
	{ name: "Lying Leg Curl", type: "Hamstrings" },
	{ name: "Seated Leg Curl", type: "Hamstrings" },
	{ name: "Stiff-Legged Deadlift", type: "Hamstrings" },
	{ name: "Nordic Hamstring Curl", type: "Hamstrings" },

	// Glutes
	{ name: "Barbell Hip Thrust", type: "Glutes" },
	{ name: "Glute Bridges", type: "Glutes" },
	{ name: "Cable Kickbacks", type: "Glutes" },
	{ name: "Abductor Machine", type: "Glutes" },

	// Calves & Adductors
	{ name: "Standing Calf Raise", type: "Calves" },
	{ name: "Seated Calf Raise", type: "Calves" },
	{ name: "Donkey Calf Raise", type: "Calves" },
	{ name: "Adductor Machine", type: "Adductors" },

	// Biceps & Forearms
	{ name: "Barbell Curl", type: "Biceps" },
	{ name: "Dumbbell Curl", type: "Biceps" },
	{ name: "Hammer Curl", type: "Biceps" },
	{ name: "Preacher Curl", type: "Biceps" },
	{ name: "Concentration Curl", type: "Biceps" },
	{ name: "Incline Dumbbell Curl", type: "Biceps" },
	{ name: "Cable Curl", type: "Biceps" },
	{ name: "Reverse Grip Curl", type: "Forearms" },
	{ name: "Wrist Curls", type: "Forearms" },

	// Triceps
	{ name: "Tricep Pushdown (Rope/Bar)", type: "Triceps" },
	{ name: "Skull Crushers", type: "Triceps" },
	{ name: "Close Grip Bench Press", type: "Triceps" },
	{ name: "Overhead Dumbbell Tricep Extension", type: "Triceps" },
	{ name: "Tricep Dips", type: "Triceps" },
	{ name: "JM Press", type: "Triceps" },

	// Core / Abs
	{ name: "Plank", type: "Core" },
	{ name: "Side Plank", type: "Core" },
	{ name: "Hanging Leg Raises", type: "Core" },
	{ name: "Cable Crunches", type: "Core" },
	{ name: "Ab Rollout", type: "Core" },
	{ name: "Russian Twists", type: "Core" },
	{ name: "Captain's Chair Leg Raise", type: "Core" },
	{ name: "Dragon Flags", type: "Core" },

	// Full Body / Olympic / Conditioning
	{ name: "Clean and Jerk", type: "Full Body" },
	{ name: "Snatch", type: "Full Body" },
	{ name: "Power Clean", type: "Full Body" },
	{ name: "Thruster", type: "Full Body" },
	{ name: "Kettlebell Swing", type: "Full Body" },
	{ name: "Turkish Get-Up", type: "Full Body" },
	{ name: "Burpee", type: "Full Body" },
	{ name: "Box Jumps", type: "Full Body" },
	{ name: "Farmers Carry", type: "Full Body" },
	{ name: "Sled Push/Pull", type: "Full Body" },
] as const;

export type PresetExercise = (typeof PRESET_EXERCISES)[number];

export const PRESET_REP_RANGES = [
	// Pure strength
	"1-2",
	"2-3",
	"3-5",
	"4-6",

	// Strength–hypertrophy overlap
	"5-8",
	"6-8",

	// Hypertrophy
	"8-10",
	"8-12",
	"10-12",
	"12-15",

	// Endurance & pump
	"15-20",
	"20-25",
	"25+",

	// Intensity markers
	"RIR 0",
	"RIR 1-2",
	"AMRAP",
] as const;

export const TWELVE_WEEK_BENCHMARK: Record<string, number> = {
	Mon: 12,
	Tue: 12,
	Wed: 12,
	Thu: 12,
	Fri: 12,
	Sat: 12,
	Sun: 0,
};

export const GUIDE_ITEMS = [
	{
		label: "Weight",
		instruction: "Morning, after bathroom, before food, minimal clothing.",
	},
	{
		label: "Body Fat",
		instruction: "Same time of day, same device (2–3 readings averaged).",
	},
	{
		label: "Arms",
		instruction: "Midpoint between shoulder and elbow, arm relaxed.",
	},
	{
		label: "Forearms",
		instruction: "At the thickest part near the elbow.",
	},
	{
		label: "Thighs",
		instruction: "Midpoint between hip and knee, legs relaxed.",
	},
	{
		label: "Waist",
		instruction: "Narrowest point or at belly button, exhale normally.",
	},
];
