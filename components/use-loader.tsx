import { useEffect, useState } from "react";

interface State {
  loading: boolean;
}

let memoryState: State = { loading: false };

const listeners: Array<(state: State) => void> = [];

function dispatch(action: "SHOW" | "HIDE") {
  memoryState = {
    ...memoryState,
    loading: action === "SHOW",
  };
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function showLoader() {
  dispatch("SHOW");
}

function hideLoader() {
  dispatch("HIDE");
}

function useLoader() {
  const [state, setState] = useState<State>(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    showLoader,
    hideLoader,
  };
}

export { useLoader };
