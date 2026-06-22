import { useCallback, useState } from "react";

/**
 * Bridges controlled and uncontrolled usage with one hook. When `value` is
 * provided the component is controlled; otherwise state is held internally and
 * seeded from `defaultValue`. `onChange` always fires on updates.
 */
export function useControlledState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [current, setValue];
}
