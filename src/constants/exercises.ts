export const PRESET_EXERCISES = [
	// ── Upper Chest ──
	{ name: "Incline Barbell Bench Press", type: "Upper Chest" },
	{ name: "Incline Dumbbell Press", type: "Upper Chest" },
	{ name: "Incline Smith Machine Press", type: "Upper Chest" },
	{ name: "Low-to-High Cable Flyes", type: "Upper Chest" },
	{ name: "Incline Dumbbell Flyes", type: "Upper Chest" },
	{ name: "Incline Cable Flyes", type: "Upper Chest" },
	{ name: "Reverse Grip Bench Press", type: "Upper Chest" },

	// ── Mid / Lower Chest ──
	{ name: "Flat Barbell Bench Press", type: "Chest" },
	{ name: "Flat Dumbbell Bench Press", type: "Chest" },
	{ name: "Smith Machine Bench Press", type: "Chest" },
	{ name: "Machine Chest Press", type: "Chest" },
	{ name: "Push-Ups", type: "Chest" },
	{ name: "Pec Deck Flyes", type: "Chest" },
	{ name: "Cable Flyes", type: "Chest" },
	{ name: "Single-Arm Cable Flyes", type: "Chest" },
	{ name: "Decline Barbell Bench Press", type: "Lower Chest" },
	{ name: "Decline Dumbbell Press", type: "Lower Chest" },
	{ name: "High-to-Low Cable Flyes", type: "Lower Chest" },
	{ name: "Chest Dips", type: "Lower Chest" },

	// ── Front Delts ──
	{ name: "Overhead Barbell Press", type: "Front Delts" },
	{ name: "Overhead Dumbbell Press", type: "Front Delts" },
	{ name: "Arnold Press", type: "Front Delts" },
	{ name: "Machine Shoulder Press", type: "Front Delts" },
	{ name: "Landmine Press", type: "Front Delts" },
	{ name: "Dumbbell Front Raise", type: "Front Delts" },
	{ name: "Plate Front Raise", type: "Front Delts" },

	// ── Side Delts ──
	{ name: "Dumbbell Lateral Raise", type: "Side Delts" },
	{ name: "Cable Lateral Raise", type: "Side Delts" },
	{ name: "Machine Lateral Raise", type: "Side Delts" },
	{ name: "Lu Raises", type: "Side Delts" },

	// ── Rear Delts ──
	{ name: "Rear Delt Flyes", type: "Rear Delts" },
	{ name: "Face Pull", type: "Rear Delts" },
	{ name: "Reverse Cable Flyes", type: "Rear Delts" },
	{ name: "Reverse Pec Deck", type: "Rear Delts" },
	{ name: "Band Pull-Aparts", type: "Rear Delts" },

	// ── Rotator Cuff ──
	{ name: "Cable External Rotation", type: "Rotator Cuff" },
	{ name: "Dumbbell External Rotation", type: "Rotator Cuff" },
	{ name: "Cuban Press", type: "Rotator Cuff" },

	// ── Traps ──
	{ name: "Barbell Shrugs", type: "Traps" },
	{ name: "Dumbbell Shrugs", type: "Traps" },
	{ name: "Upright Row", type: "Traps" },
	{ name: "Cable Shrugs", type: "Traps" },

	// ── Neck ──
	{ name: "Neck Harness Extensions", type: "Neck" },
	{ name: "Lying Neck Flexion", type: "Neck" },
	
	// ── Lats ──
	{ name: "Lat Pulldown", type: "Lats" },
	{ name: "Pull-Ups", type: "Lats" },
	{ name: "Chin-Ups", type: "Lats" },
	{ name: "Single-Arm Dumbbell Row", type: "Lats" },
	{ name: "Single-Arm Cable Row", type: "Lats" },
	{ name: "Straight-Arm Cable Pushdown", type: "Lats" },
	{ name: "Chest-Supported Row", type: "Lats" },

	// ── Upper Back ──
	{ name: "Barbell Bent-Over Row", type: "Upper Back" },
	{ name: "Pendlay Row", type: "Upper Back" },
	{ name: "Seated Cable Row", type: "Upper Back" },
	{ name: "T-Bar Row", type: "Upper Back" },
	{ name: "Meadows Row", type: "Upper Back" },
	{ name: "Kroc Row", type: "Upper Back" },

	// ── Posterior Chain ──
	{ name: "Deadlift", type: "Posterior Chain" },
	{ name: "Rack Pulls", type: "Posterior Chain" },
	{ name: "Deficit Deadlift", type: "Posterior Chain" },
	{ name: "Stiff-Legged Deadlift", type: "Posterior Chain" },
	{ name: "Good Mornings", type: "Posterior Chain" },
	{ name: "Hyperextensions", type: "Posterior Chain" },
	{ name: "Reverse Hyperextensions", type: "Posterior Chain" },

	// ── Quads ──
	{ name: "Barbell Back Squat", type: "Quads" },
	{ name: "Front Squat", type: "Quads" },
	{ name: "Barbell Zercher Squat", type: "Quads" },
	{ name: "Leg Press", type: "Quads" },
	{ name: "Leg Extension", type: "Quads" },
	{ name: "Hack Squat", type: "Quads" },
	{ name: "Belt Squat", type: "Quads" },
	{ name: "Goblet Squat", type: "Quads" },
	{ name: "Split Squat", type: "Quads" },
	{ name: "Bulgarian Split Squat", type: "Quads" },
	{ name: "Walking Lunges", type: "Quads" },
	{ name: "Reverse Lunges", type: "Quads" },
	{ name: "Sissy Squat", type: "Quads" },
	{ name: "Step-Ups", type: "Quads" },
	{ name: "Pendulum Squat", type: "Quads" },
	{ name: "Smith Machine Squat", type: "Quads" },

	// ── Hamstrings ──
	{ name: "Romanian Deadlift", type: "Hamstrings" },
	{ name: "Lying Leg Curl", type: "Hamstrings" },
	{ name: "Seated Leg Curl", type: "Hamstrings" },
	{ name: "Standing Leg Curl", type: "Hamstrings" },
	{ name: "Nordic Hamstring Curl", type: "Hamstrings" },

	// ── Glutes ──
	{ name: "Barbell Hip Thrust", type: "Glutes" },
	{ name: "Glute Bridges", type: "Glutes" },
	{ name: "Cable Kickbacks", type: "Glutes" },
	{ name: "Abductor Machine", type: "Glutes" },

	// ── Calves ──
	{ name: "Standing Calf Raise", type: "Calves" },
	{ name: "Seated Calf Raise", type: "Calves" },
	{ name: "Donkey Calf Raise", type: "Calves" },
	{ name: "Leg Press Calf Raise", type: "Calves" },
	{ name: "Tibialis Raise", type: "Calves" },

	// ── Adductors ──
	{ name: "Adductor Machine", type: "Adductors" },
	{ name: "Copenhagen Plank", type: "Adductors" },

	// ── Biceps ──
	{ name: "Barbell Curl", type: "Biceps" },
	{ name: "EZ-Bar Curl", type: "Biceps" },
	{ name: "Spider Curl", type: "Biceps" },
	{ name: "Dumbbell Curl", type: "Biceps" },
	{ name: "Hammer Curl", type: "Biceps" },
	{ name: "Preacher Curl", type: "Biceps" },
	{ name: "Concentration Curl", type: "Biceps" },
	{ name: "Incline Dumbbell Curl", type: "Biceps" },
	{ name: "Cable Curl", type: "Biceps" },
	{ name: "Drag Cable Curl", type: "Biceps" },
	{ name: "Bayesian Cable Curl", type: "Biceps" },

	// ── Grip ──
	{ name: "Dead Hangs", type: "Grip" },
	{ name: "Plate Pinch Hold", type: "Grip" },
	{ name: "Towel Pull-Ups", type: "Grip" },
	{ name: "Hand Gripper Squeeze", type: "Grip" },
	{ name: "Farmer's Hold", type: "Grip" },
	{ name: "Barbell Hold", type: "Grip" },

	// ── Forearms ──
	{ name: "Reverse Grip Curl", type: "Forearms" },
	{ name: "Wrist Curls", type: "Forearms" },
	{ name: "Reverse Wrist Curls", type: "Forearms" },
	{ name: "Zottman Curl", type: "Forearms" },
	{ name: "Tyler Twist", type: "Forearms" },
	{ name: "Dumbbell Pronation", type: "Forearms" },
	{ name: "Dumbbell Supination", type: "Forearms" },
	{ name: "Plate Pronation", type: "Forearms" },
	{ name: "Plate Supination", type: "Forearms" },
	{ name: "Hammer Pronation", type: "Forearms" },
	{ name: "Hammer Supination", type: "Forearms" },
	{ name: "Rope Pronation", type: "Forearms" },
	{ name: "Rope Supination", type: "Forearms" },
	{ name: "Band Pronation", type: "Forearms" },
	{ name: "Band Supination", type: "Forearms" },
	{ name: "Wrist Roller", type: "Forearms" },
	{ name: "Rice Bucket Digs", type: "Forearms" },

	// ── Triceps ──
	{ name: "Tricep Pushdown", type: "Triceps" },
	{ name: "Skull Crushers", type: "Triceps" },
	{ name: "Close Grip Bench Press", type: "Triceps" },
	{ name: "Overhead Dumbbell Tricep Extension", type: "Triceps" },
	{ name: "Overhead Cable Tricep Extension", type: "Triceps" },
	{ name: "Tricep Dips", type: "Triceps" },
	{ name: "JM Press", type: "Triceps" },
	{ name: "Tate Press", type: "Triceps" },

	// ── Core ──
	{ name: "Plank", type: "Core" },
	{ name: "Bicycle Crunch", type: "Core" },
	{ name: "V-Up", type: "Core" },
	{ name: "L-Sit", type: "Core" },
	{ name: "Side Plank", type: "Core" },
	{ name: "Pallof Press", type: "Core" },
	{ name: "Hanging Leg Raises", type: "Core" },
	{ name: "Cable Crunches", type: "Core" },
	{ name: "Ab Wheel Rollout", type: "Core" },
	{ name: "Russian Twists", type: "Core" },
	{ name: "Captain's Chair Leg Raise", type: "Core" },
	{ name: "Dragon Flags", type: "Core" },
	{ name: "Suitcase Carry", type: "Core" },
	{ name: "Hollow Body Hold", type: "Core" },
	{ name: "Dead Bug", type: "Core" },

	// ── Mobility ──
	{ name: "Cat-Cow Stretch", type: "Mobility" },
	{ name: "Jefferson Curl", type: "Mobility" },
	{ name: "Foam Roller Thoracic Extension", type: "Mobility" },
	{ name: "Thoracic Rotation", type: "Mobility" },
	{ name: "Open Book Stretch", type: "Mobility" },
	{ name: "Child's Pose", type: "Mobility" },
	{ name: "Cobra Stretch", type: "Mobility" },
	{ name: "90/90 Hip Switches", type: "Mobility" },
	{ name: "Couch Stretch", type: "Mobility" },
	{ name: "Pigeon Pose", type: "Mobility" },
	{ name: "Figure-4 Stretch", type: "Mobility" },
	{ name: "Adductor Rockback", type: "Mobility" },
	{ name: "Deep Squat Hold", type: "Mobility" },
	{ name: "Band Shoulder Rotation Drill", type: "Mobility" },
	{ name: "Band Shoulder Dislocates", type: "Mobility" },
	{ name: "Wall Slides", type: "Mobility" },
	{ name: "Pass-Throughs", type: "Mobility" },
	{ name: "Sleeper Stretch", type: "Mobility" },
	{ name: "Arm Circles", type: "Mobility" },
	{ name: "Shoulder CARs", type: "Mobility" },
	{ name: "Front-To-Back Leg Swings", type: "Mobility" },
	{ name: "Lateral Leg Swings", type: "Mobility" },
	{ name: "Ankle Rocks", type: "Mobility" },
	{ name: "Ankle CARs", type: "Mobility" },
	{ name: "Calf Wall Stretch", type: "Mobility" },
	{ name: "World's Greatest Stretch", type: "Mobility" },
	{ name: "Inchworm", type: "Mobility" },
	{ name: "Bear Crawl", type: "Mobility" },
	{ name: "Downward Dog", type: "Mobility" },
	{ name: "Hip CARs", type: "Mobility" },
	{ name: "Neck CARs", type: "Mobility" },
	{ name: "Wrist CARs", type: "Mobility" },
	{ name: "Full Body Controlled Articular Rotations", type: "Mobility" },

	// ── Full Body / Olympic / Conditioning ──
	{ name: "Clean and Jerk", type: "Full Body" },
	{ name: "Snatch", type: "Full Body" },
	{ name: "Power Clean", type: "Full Body" },
	{ name: "Hang Clean", type: "Full Body" },
	{ name: "Push Press", type: "Full Body" },
	{ name: "Thruster", type: "Full Body" },
	{ name: "Kettlebell Swings", type: "Full Body" },
	{ name: "Turkish Get-Up", type: "Full Body" },
	{ name: "Burpee", type: "Full Body" },
	{ name: "Box Jumps", type: "Full Body" },
	{ name: "Farmers Carry", type: "Full Body" },
	{ name: "Sled Push/Pull", type: "Full Body" },
	{ name: "Battle Ropes", type: "Full Body" },
	{ name: "Rowing Machine", type: "Full Body" },
	{ name: "Assault Bike", type: "Full Body" },
] as const;

export type PresetExercise = (typeof PRESET_EXERCISES)[number];

// ─────────────────────────────────────────────────────────────
// Rep Ranges
// ─────────────────────────────────────────────────────────────
export const PRESET_REP_RANGES = [
	// Pure strength
	"1-2",
	"2-3",
	"3-5",
	"3-6",
	"4-6",

	// Strength–hypertrophy overlap
	"4-8",
	"5-8",
	"6-8",
	"6-10",

	// Hypertrophy
	"8-10",
	"8-12",
	"10-12",
	"10-15",
	"12-16",
	"12-15",

	// Endurance & pump
	"15-20",
	"16-20",
	"20-26",
	"25+",

	// Intensity markers
	"RIR 0",
	"RIR 1-2",
	"RIR 2-3",
	"AMRAP",
	"Failure",

	// Timed Sets & Isometric Holds
	"15s",
	"30s",
	"45s",
	"60s",
	"90s",
	"2m",
	"3m",
] as const;

// ─────────────────────────────────────────────────────────────
// Weekly benchmark (used by training-frequency radar)
// ─────────────────────────────────────────────────────────────
export const WEEK_DAYS = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun",
] as const;

export type WeekDay = (typeof WEEK_DAYS)[number];

export const TWELVE_WEEK_BENCHMARK: Record<WeekDay, number> = {
	Mon: 12,
	Tue: 12,
	Wed: 12,
	Thu: 12,
	Fri: 12,
	Sat: 12,
	Sun: 12,
};

// ─────────────────────────────────────────────────────────────
// Measurement guide (used by MeasurementGuide card)
// ─────────────────────────────────────────────────────────────
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
		instruction:
			"Midpoint between shoulder and elbow, arm relaxed at side.",
	},
	{
		label: "Forearms",
		instruction: "At the thickest part near the elbow, arm relaxed.",
	},
	{
		label: "Chest",
		instruction: "At nipple line, arms relaxed at sides, exhale normally.",
	},
	{
		label: "Waist",
		instruction: "Narrowest point or at belly button, exhale normally.",
	},
	{
		label: "Hips",
		instruction: "Widest point around glutes, feet together.",
	},
	{
		label: "Thighs",
		instruction:
			"Midpoint between hip and knee, legs relaxed and shoulder-width.",
	},
	{
		label: "Calves",
		instruction: "At the thickest part, standing relaxed.",
	},
];
