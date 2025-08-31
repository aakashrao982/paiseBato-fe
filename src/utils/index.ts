export type ClassNameInput =
  | string
  | Record<string, boolean | null | undefined>
  | null
  | undefined;

export const classNames = (...args: ClassNameInput[]): string => {
  return args
    .reduce((initialValue: string[], currentValue: ClassNameInput) => {
      if (currentValue != null) {
        if (typeof currentValue === "string") {
          initialValue.push(currentValue);
        } else {
          for (const key in currentValue) {
            if (currentValue[key]) {
              initialValue.push(key);
            }
          }
        }
      }
      return initialValue;
    }, [])
    .join(" ");
};

export const throttle = <TArgs extends unknown[]>(
  mainFunction: (...args: TArgs) => void,
  delay: number
) => {
  let timerFlag: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: TArgs) {
    if (timerFlag === null) {
      mainFunction.apply(this, args);
      timerFlag = setTimeout(() => {
        timerFlag = null;
      }, delay);
    }
  };
};

export const interpolateString = (
  template: string,
  values: Record<string, string | boolean>
): string => {
  return template?.replace(/#{(.*?)}/g, (_, key) => {
    const replacement = values[key.trim()];
    return replacement !== undefined ? String(replacement) : "";
  });
};
