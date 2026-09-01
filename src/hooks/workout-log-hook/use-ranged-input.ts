import { useState, useCallback } from "react";

export function useRangedInput(
  initialValue: string = "",
  min: number,
  max: number,
  autoCorrect: boolean = true
) {
  const [value, setValue] = useState(initialValue);
  const [wasCorrected, setWasCorrected] = useState(false);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setWasCorrected(false);
    
    if (newValue === "") {
      setValue("");
      return;
    }
    
    const num = parseFloat(newValue);
    if (!isNaN(num)) {
      if (autoCorrect) {
        if (num > max) {
          setValue(max.toString());
          setWasCorrected(true);
        } else if (num < min) {
          setValue(min.toString());
          setWasCorrected(true);
        } else {
          setValue(newValue);
        }
      } else {
        // Just validate without auto-correction
        if (num >= min && num <= max) {
          setValue(newValue);
        }
      }
    }
  }, [min, max, autoCorrect]);

  const reset = useCallback(() => {
    setValue("");
    setWasCorrected(false);
  }, []);

  return {
    value,
    onChange,
    reset,
    wasCorrected,
    setValue,
  };
}
