import { useState } from "react";

export default function usePWA() {
  const [isInstalled] = useState(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOS = window.navigator.standalone === true;
    return isStandalone || isIOS;
  });

  return { isInstalled };
}