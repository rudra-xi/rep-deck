// hooks/useQuickAddMeasurement.ts
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { createMeasurement } from "@/actions/metrics";

interface FormData {
	weightKg: string;
	bodyFatPercent: string;
	armsIn: string;
	forearmsIn: string;
	thighsIn: string;
	chestIn: string;
	waistIn: string;
	hipsIn: string;
	notes: string;
}

export function useQuickAddMeasurement() {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(),
	);
	const [formData, setFormData] = useState<FormData>({
		weightKg: "",
		bodyFatPercent: "",
		armsIn: "",
		forearmsIn: "",
		thighsIn: "",
		chestIn: "",
		waistIn: "",
		hipsIn: "",
		notes: "",
	});

	// Handle both input and textarea changes
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const resetForm = () => {
		setSelectedDate(new Date());
		setFormData({
			weightKg: "",
			bodyFatPercent: "",
			armsIn: "",
			forearmsIn: "",
			thighsIn: "",
			chestIn: "",
			waistIn: "",
			hipsIn: "",
			notes: "",
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedDate) {
			toast.error("Please select a date");
			return;
		}

		// Check if at least one measurement is provided
		const hasAnyMeasurement = Object.values(formData).some(
			(val) => val && parseFloat(val) > 0,
		);

		if (!hasAnyMeasurement) {
			toast.error("Please fill in at least one measurement");
			return;
		}

		setLoading(true);
		setSuccess(false);

		const parseNum = (val: string) => (val ? parseFloat(val) : null);

		try {
			const res = await createMeasurement({
				date: selectedDate,
				weightKg: parseNum(formData.weightKg),
				bodyFatPercent: parseNum(formData.bodyFatPercent),
				armsIn: parseNum(formData.armsIn),
				forearmsIn: parseNum(formData.forearmsIn),
				thighsIn: parseNum(formData.thighsIn),
				chestIn: parseNum(formData.chestIn),
				waistIn: parseNum(formData.waistIn),
				hipsIn: parseNum(formData.hipsIn),
				notes: formData.notes || undefined,
			});

			setLoading(false);

			if (res.success) {
				setSuccess(true);
				// Format date as "Sep 10, 2026"
				const formattedDate = format(selectedDate, "MMM d, yyyy");
				toast.success("Measurement saved successfully!", {
					description: `Logged for ${formattedDate}`,
					duration: 4000,
				});
				resetForm();
				setTimeout(() => setSuccess(false), 3000);
			} else {
				toast.error("Failed to save measurement", {
					description: res.error || "Please try again",
					duration: 4000,
				});
			}
		} catch (error) {
			setLoading(false);
			toast.error("Something went wrong", {
				description:
					error instanceof Error ? error.message : "Please try again",
				duration: 4000,
			});
		}
	};

	return {
		loading,
		success,
		selectedDate,
		setSelectedDate,
		formData,
		handleChange,
		handleSubmit,
	};
}
