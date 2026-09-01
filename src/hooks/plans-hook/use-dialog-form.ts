import { useState, useCallback } from "react";

interface UseDialogFormOptions {
	initialName?: string;
	initialOpen?: boolean;
	onSuccess?: () => void | Promise<void>;
}

export function useDialogForm(options: UseDialogFormOptions = {}) {
	const { initialName = "", initialOpen = false, onSuccess } = options;

	const [open, setOpen] = useState(initialOpen);
	const [name, setName] = useState(initialName);
	const [loading, setLoading] = useState(false);

	const reset = useCallback(() => {
		setName("");
		setOpen(false);
		setLoading(false);
	}, []);

	const handleSubmit = useCallback(
		async (
			submitFn: () => void | Promise<void>,
			resetAfterSubmit = true,
		) => {
			if (loading) return;

			setLoading(true);
			try {
				await submitFn();
				if (resetAfterSubmit) {
					reset();
				}
				if (onSuccess) {
					await onSuccess();
				}
			} finally {
				setLoading(false);
			}
		},
		[loading, reset, onSuccess],
	);

	return {
		open,
		setOpen,
		name,
		setName,
		loading,
		setLoading,
		reset,
		handleSubmit,
	};
}
