import { useCallback, useRef, useState } from "react";

/**
 * ==========================================
 * 🔔 HOOK TOAST — Système de feedback léger
 * Sans dépendance externe
 * ==========================================
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  /** Retire un toast de la pile */
  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /** Ajoute un toast avec auto-dismiss */
  const push = useCallback(
    (type, message, duration = 3000) => {
      const id = ++counterRef.current;
      setToasts((prev) => [...prev, { id, type, message }]);
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  return {
    toasts,
    dismiss,
    success: useCallback((msg) => push("success", msg), [push]),
    error: useCallback((msg) => push("error", msg), [push]),
    info: useCallback((msg) => push("info", msg), [push]),
  };
}
