export interface Challenge {
	id: string;
	title: string;
	description: string;
	target: string;
	category:
		| "Grip"
		| "Core"
		| "Endurance"
		| "Legs"
		| "Balance"
		| "Shoulders"
		| "Back"
		| "Cardio"
		| "Mobility";
	difficulty: "Easy" | "Medium" | "Hard";
}

export const CHALLENGES: Challenge[] = [
	{
		id: "handstand-hold",
		title: "Wall-Supported Handstand Hold",
		description:
			"Kick up into a wall-assisted handstand, keeping core and glutes squeezed tight.",
		target: "30–45 sec",
		category: "Shoulders",
		difficulty: "Hard",
	},
	{
		id: "arm-circles",
		title: "Arm Circles",
		description:
			"Extend arms sideways and make small, controlled circular motions forward, then backward.",
		target: "60 sec total",
		category: "Shoulders",
		difficulty: "Easy",
	},
	{
		id: "pistol-squats",
		title: "Single-Leg Pistol Squat",
		description:
			"Perform a deep single-leg squat with the non-working leg extended out front.",
		target: "5 Reps / leg",
		category: "Legs",
		difficulty: "Hard",
	},
	{
		id: "wall-slides",
		title: "Wall Slides",
		description:
			"Stand with head, upper back, and glutes against the wall; slide arms up and down overhead.",
		target: "15 Reps",
		category: "Mobility",
		difficulty: "Easy",
	},
	{
		id: "dead-hang",
		title: "Dead Hang Max",
		description:
			"Hang from a pull-up bar for as long as possible. Aim to beat your last time.",
		target: "Max Time",
		category: "Grip",
		difficulty: "Medium",
	},
	{
		id: "jumping-jacks-burst",
		title: "Jumping Jack Burst",
		description:
			"Perform light, continuous jumping jacks to raise heart rate and prime shoulders.",
		target: "60 sec",
		category: "Cardio",
		difficulty: "Easy",
	},
	{
		id: "human-flag-hold",
		title: "Human Flag Hold",
		description:
			"Grip a vertical pole and suspend your entire body horizontally off the ground.",
		target: "5–10 sec",
		category: "Core",
		difficulty: "Hard",
	},
	{
		id: "air-squat-ladder",
		title: "Air Squat Ladder",
		description:
			"Complete 10, 15, then 20 air squats with 30 seconds rest between sets.",
		target: "3 Sets",
		category: "Legs",
		difficulty: "Medium",
	},
	{
		id: "bird-dog",
		title: "Bird-Dog Hold",
		description:
			"On hands and knees, extend opposite arm and leg straight out while maintaining a neutral spine.",
		target: "10 Reps / side",
		category: "Core",
		difficulty: "Easy",
	},
	{
		id: "one-arm-pushup",
		title: "One-Arm Push-Up",
		description:
			"Lower and press back up on a single arm with feet spread wide for balance.",
		target: "3 Reps / arm",
		category: "Endurance",
		difficulty: "Hard",
	},
	{
		id: "plank-hold",
		title: "Plank Hold",
		description: "Hold a strict plank with core engaged and neutral spine.",
		target: "60–90 sec",
		category: "Core",
		difficulty: "Medium",
	},
	{
		id: "seated-thoracic-rotation",
		title: "Seated Thoracic Rotation",
		description:
			"Sit upright with hands behind head and rotate mid-back side to side without moving hips.",
		target: "10 Reps / side",
		category: "Mobility",
		difficulty: "Easy",
	},
	{
		id: "wall-sit",
		title: "Wall Sit",
		description:
			"Back flat against the wall, knees bent at a strict 90° angle.",
		target: "60+ sec",
		category: "Legs",
		difficulty: "Medium",
	},
	{
		id: "plyo-pushups",
		title: "Explosive Clap Push-Ups",
		description:
			"Push up with enough explosive power to lift hands off the floor and clap mid-air.",
		target: "8–12 Reps",
		category: "Endurance",
		difficulty: "Hard",
	},
	{
		id: "glute-bridge",
		title: "Glute Bridge Hold",
		description:
			"Lie flat on your back, bend knees, and lift hips up toward the ceiling.",
		target: "45–60 sec",
		category: "Core",
		difficulty: "Easy",
	},
	{
		id: "mountain-climber-sprint",
		title: "Mountain Climber Sprint",
		description:
			"Drive knees toward chest as fast as possible while maintaining a solid high plank posture.",
		target: "45 sec",
		category: "Cardio",
		difficulty: "Medium",
	},
	{
		id: "single-leg-wall-sit",
		title: "Single-Leg Wall Sit",
		description:
			"Hold a standard wall sit position while extending one leg out parallel to the floor.",
		target: "20–30s / leg",
		category: "Legs",
		difficulty: "Hard",
	},
	{
		id: "farmers-carry",
		title: "Farmer's Carry",
		description:
			"Walk heel-to-toe in a straight line with arms at sides and core tight.",
		target: "30–45 sec",
		category: "Balance",
		difficulty: "Medium",
	},
	{
		id: "hollow-body",
		title: "Hollow Body Hold",
		description:
			"Press lower back into the floor and hold a tight hollow body position.",
		target: "30–45 sec",
		category: "Core",
		difficulty: "Medium",
	},
	{
		id: "towel-hang",
		title: "Towel Dead Hang",
		description:
			"Loop towels over a pull-up bar, grip the towels, and hang as long as possible.",
		target: "Max Time",
		category: "Grip",
		difficulty: "Hard",
	},
	{
		id: "calf-raises",
		title: "Standing Calf Raise Hold",
		description:
			"Raise up onto the balls of your feet, pause at the top, and maintain balance.",
		target: "20 Reps",
		category: "Legs",
		difficulty: "Easy",
	},
	{
		id: "side-plank-raises",
		title: "Side Plank Hip Dips",
		description:
			"Hold a side plank while slowly dipping and driving your bottom hip toward the ceiling.",
		target: "12 Reps / side",
		category: "Core",
		difficulty: "Medium",
	},
	{
		id: "single-leg-balance",
		title: "Single-Leg Balance",
		description:
			"Stand on one leg with eyes closed. Maintain strict posture.",
		target: "20–30s / leg",
		category: "Balance",
		difficulty: "Easy",
	},
	{
		id: "jump-rope-sprint",
		title: "High-Knee Jump Rope",
		description:
			"Jump rope continuously with high knees, maintaining a fast, steady rhythm.",
		target: "60 sec",
		category: "Cardio",
		difficulty: "Medium",
	},
	{
		id: "l-sit-hold",
		title: "L-Sit Hold",
		description:
			"Support your weight on parallel bars or dip handles with legs extended straight out in front.",
		target: "15–30 sec",
		category: "Core",
		difficulty: "Hard",
	},
	{
		id: "ankle-alphabet",
		title: "Ankle Alphabet",
		description:
			"Lift one foot in the air and trace letters A to Z in the air using only your ankle.",
		target: "A–Z / leg",
		category: "Mobility",
		difficulty: "Easy",
	},
	{
		id: "reverse-plank",
		title: "Reverse Plank Hold",
		description:
			"Drive hips high with arms extended behind you. Keep glutes engaged.",
		target: "30–45 sec",
		category: "Core",
		difficulty: "Medium",
	},
	{
		id: "dragon-flag-negatives",
		title: "Dragon Flag Negatives",
		description:
			"Lower your body from a shoulder stand position in a straight line as slowly as possible.",
		target: "5 Reps",
		category: "Core",
		difficulty: "Hard",
	},
	{
		id: "doorframe-row",
		title: "Doorframe Isometric Row",
		description:
			"Hold onto a sturdy doorframe and lean back, pulling your chest to the frame.",
		target: "30–45 sec",
		category: "Back",
		difficulty: "Easy",
	},
	{
		id: "pushup-sprint",
		title: "Push-Up Sprint",
		description:
			"Perform as many clean, full range-of-motion push-ups as possible.",
		target: "60 seconds",
		category: "Endurance",
		difficulty: "Medium",
	},
	{
		id: "strict-pullups",
		title: "Max Strict Pull-Ups",
		description:
			"Perform dead-stop pull-ups without kipping until form breaks.",
		target: "Max Reps",
		category: "Back",
		difficulty: "Hard",
	},
	{
		id: "burpee-burst",
		title: "Burpee Burst",
		description:
			"Perform clean burpees as fast as possible with good form.",
		target: "10 Reps",
		category: "Endurance",
		difficulty: "Medium",
	},
];
