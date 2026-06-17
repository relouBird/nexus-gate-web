// ─── Timer renvoi ─────────────────────────────────────────────

import { useState, useEffect } from "react";

const RESEND_COOLDOWN = 60; // secondes

export function useResendTimer(COUNTDOW: number = RESEND_COOLDOWN) {
  const [seconds, setSeconds] = useState(COUNTDOW);

  const canResend = seconds <= 0;

  useEffect(() => {
    if (seconds <= 0) return;

    const id = setTimeout(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [seconds]);

  function reset() {
    setSeconds(COUNTDOW);
  }

  return { seconds, canResend, reset };
}
