import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const PREFIX = 'rooster_';

function getSavedValue<T>(key: string, initialValue: T) {
  if (typeof window !== 'object') return null;

  const savedValue = JSON.parse(
    String(localStorage.getItem(`${PREFIX}${key}`))
  );

  if (savedValue !== null) {
    return savedValue as T;
  }

  if (initialValue instanceof Function) return initialValue();
  return initialValue;
}

export default function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => getSavedValue(key, initialValue));

  useEffect(() => {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return [value, setValue] as [T, Dispatch<SetStateAction<T>>];
}
