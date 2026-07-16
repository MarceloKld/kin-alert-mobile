import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>

      {children}

      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-slideIn">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl text-white text-sm ${
              toast.type === "error"
                ? "bg-red-500"
                : toast.type === "warning"
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}