import { useState, useCallback } from "react";

export function useFormField<T = string>(initialValue: T) {
	const [value, setValue] = useState<T>(initialValue);
	const reset = useCallback(() => setValue(initialValue), [initialValue]);

	return {
		value,
		setValue,
		reset,
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
			setValue(e.target.value as T);
		},
	};
}
