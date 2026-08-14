import { supabase } from "@/lib/supabase";

export default async function DashboardPage() {
	try {
		// Fetch all data in parallel
		const [usersRes, programsRes, workoutsRes, measurementsRes] =
			await Promise.all([
				supabase.from("users").select("*"),
				supabase.from("program_templates").select("*"),
				supabase
					.from("workout_sessions")
					.select(
						`
        *,
        workout_sets (*)
      `,
					)
					.order("date", { ascending: false })
					.limit(5),
				supabase
					.from("body_measurements")
					.select(
						`
        *,
        users (*)
      `,
					)
					.order("date", { ascending: false })
					.limit(5),
			]);

		// Check for errors
		if (usersRes.error) throw usersRes.error;
		if (programsRes.error) throw programsRes.error;
		if (workoutsRes.error) throw workoutsRes.error;
		if (measurementsRes.error) throw measurementsRes.error;

		const users = usersRes.data || [];
		const programs = programsRes.data || [];
		const workouts = workoutsRes.data || [];
		const measurements = measurementsRes.data || [];

		console.log("📊 Dashboard Data:");
		console.log("Users:", users);
		console.log("Programs:", programs);
		console.log("Workouts:", workouts);
		console.log("Measurements:", measurements);

		return (
			<div className="p-6 max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold mb-6">Dashboard</h1>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
					<div className="bg-white p-4 rounded-lg shadow">
						<p className="text-sm text-gray-500">Users</p>
						<p className="text-2xl font-bold text-red-600">
							{users.length}
						</p>
					</div>
					<div className="bg-white p-4 rounded-lg shadow">
						<p className="text-sm text-gray-500">Programs</p>
						<p className="text-2xl font-bold text-red-600">
							{programs.length}
						</p>
					</div>
					<div className="bg-white p-4 rounded-lg shadow">
						<p className="text-sm text-gray-500">Total Workouts</p>
						<p className="text-2xl font-bold text-red-600">
							{workouts.length}
						</p>
					</div>
					<div className="bg-white p-4 rounded-lg shadow">
						<p className="text-sm text-gray-500">Measurements</p>
						<p className="text-2xl font-bold text-red-600">
							{measurements.length}
						</p>
					</div>
				</div>

				{/* Users Section */}
				{users.length > 0 && (
					<div className="bg-white p-6 rounded-lg shadow mb-6">
						<h2 className=" text-red-600 text-xl font-semibold mb-4">
							Users
						</h2>
						<div className="space-y-2">
							{users.map((user: any) => (
								<div key={user.id} className="border-b pb-2">
									<p className="font-medium text-red-600">
										{user.name}
									</p>
									<p className="text-sm text-gray-600">
										{user.email}
									</p>
									<p className="text-xs text-gray-400">
										Joined:{" "}
										{new Date(
											user.created_at,
										).toLocaleDateString()}
									</p>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Programs Section */}
				{programs.length > 0 && (
					<div className="bg-white p-6 rounded-lg shadow mb-6">
						<h2 className="text-red-600 text-xl font-semibold mb-4">
							Programs
						</h2>
						<div className="space-y-2">
							{programs.map((program: any) => (
								<div key={program.id} className="border-b pb-2">
									<p className="font-medium text-red-600">
										{program.name}
									</p>
									<p className="text-sm text-gray-600">
										Version {program.version} •
										{program.active
											? " ✅ Active"
											: " ❌ Inactive"}
									</p>
									<p className="text-xs text-gray-400">
										Started:{" "}
										{new Date(
											program.start_date,
										).toLocaleDateString()}
									</p>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Workouts Section */}
				{workouts.length > 0 && (
					<div className="bg-white p-6 rounded-lg shadow mb-6">
						<h2 className="text-xl font-semibold mb-4 text-red-600">
							Recent Workouts
						</h2>
						{workouts.map((workout: any) => (
							<div
								key={workout.id}
								className="border-b pb-3 mb-3"
							>
								<div className="flex justify-between items-start">
									<div>
										<p className="font-medium text-red-600">
											{new Date(
												workout.date,
											).toLocaleDateString()}
										</p>
										<p className="text-sm text-gray-600">
											Day {workout.day_index}
										</p>
									</div>
									<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
										{workout.workout_sets?.length || 0} sets
									</span>
								</div>
								{workout.notes && (
									<p className="text-sm text-gray-500 italic">
										"{workout.notes}"
									</p>
								)}
								{workout.workout_sets &&
									workout.workout_sets.length > 0 && (
										<div className="mt-2">
											<p className="text-sm font-medium text-gray-700">
												Sets:
											</p>
											<ul className="text-sm text-gray-600 space-y-1">
												{workout.workout_sets.map(
													(set: any) => (
														<li
															key={set.id}
															className="flex items-center gap-2"
														>
															<span className="font-medium">
																{
																	set.exercise_name
																}
															</span>
															<span>
																{set.weight}kg ×{" "}
																{set.reps} reps
															</span>
															{set.rpe && (
																<span className="text-xs text-gray-400">
																	RPE:{" "}
																	{set.rpe}
																</span>
															)}
															{set.notes && (
																<span className="text-xs text-gray-400">
																	-{" "}
																	{set.notes}
																</span>
															)}
														</li>
													),
												)}
											</ul>
										</div>
									)}
							</div>
						))}
					</div>
				)}

				{/* Body Measurements */}
				{measurements.length > 0 && (
					<div className="bg-white p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4 text-red-600">
							Body Measurements
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{measurements.map((m: any) => (
								<div key={m.id} className="border p-4 rounded">
									<div className="flex justify-between items-start">
										<p className="font-medium text-red-600">
											{new Date(
												m.date,
											).toLocaleDateString()}
										</p>
										<span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
											{m.users?.name || "Unknown"}
										</span>
									</div>
									<div className="text-sm text-gray-600 grid grid-cols-2 gap-1 mt-2">
										{m.weight_kg && (
											<p>Weight: {m.weight_kg}kg</p>
										)}
										{m.body_fat_percent && (
											<p>
												Body Fat: {m.body_fat_percent}%
											</p>
										)}
										{m.arms_cm && (
											<p>Arms: {m.arms_cm}cm</p>
										)}
										{m.chest_cm && (
											<p>Chest: {m.chest_cm}cm</p>
										)}
										{m.waist_cm && (
											<p>Waist: {m.waist_cm}cm</p>
										)}
										{m.hips_cm && (
											<p>Hips: {m.hips_cm}cm</p>
										)}
										{m.thighs_cm && (
											<p>Thighs: {m.thighs_cm}cm</p>
										)}
									</div>
									{m.notes && (
										<p className="text-xs text-gray-400 mt-2">
											"{m.notes}"
										</p>
									)}
								</div>
							))}
						</div>
					</div>
				)}

				{/* No Data Message */}
				{users.length === 0 &&
					programs.length === 0 &&
					workouts.length === 0 && (
						<div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
							<h3 className="text-lg font-semibold text-yellow-800">
								No Data Found
							</h3>
							<p className="text-yellow-700 mt-2">
								Run your SQL script in Supabase to insert mock
								data.
							</p>
							<div className="mt-4">
								<a
									href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/sql`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:underline"
								>
									Open Supabase SQL Editor →
								</a>
							</div>
						</div>
					)}
			</div>
		);
	} catch (error: any) {
		console.error("Error fetching data:", error);
		return (
			<div className="p-8">
				<h1 className="text-2xl font-bold text-red-600 mb-4">
					Error Loading Dashboard
				</h1>
				<div className="bg-red-50 p-4 rounded border border-red-200">
					<p className="text-red-700">{error.message}</p>
					<p className="text-sm text-gray-600 mt-2">
						Check the console for more details.
					</p>
				</div>
			</div>
		);
	}
}
