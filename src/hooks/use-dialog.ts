import { useState, useCallback } from "react";

export function useDialog(initialOpen = false) {
	const [open, setOpen] = useState(initialOpen);
	const [loading, setLoading] = useState(false);

	const openDialog = useCallback(() => setOpen(true), []);
	const closeDialog = useCallback(() => setOpen(false), []);
	const toggleDialog = useCallback(() => setOpen((prev) => !prev), []);

	return {
		open,
		setOpen,
		openDialog,
		closeDialog,
		toggleDialog,
		loading,
		setLoading,
	};
}
