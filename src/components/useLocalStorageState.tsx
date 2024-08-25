import { useEffect, useState } from "react";
import { IWatched } from "./interfaces";

export function useLocalStorageState(initialState: IWatched[], key: string) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );
  return [value, setValue];
}
