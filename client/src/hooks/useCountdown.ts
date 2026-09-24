import { useState, useEffect, useMemo, useRef } from 'react';

interface CountdownResult {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  formattedString: string;
  isExpired: boolean;
  totalSecondsRemaining: number;
}

export function useCountdown(targetIsoDate?: string, serverTimeIso?: string): CountdownResult {
  // Lock in server-to-client clock skew once
  const skewOffsetRef = useRef<number>(0);

  useEffect(() => {
    if (serverTimeIso) {
      const serverMs = new Date(serverTimeIso).getTime();
      if (!isNaN(serverMs)) {
        skewOffsetRef.current = serverMs - Date.now();
      }
    }
  }, [serverTimeIso]);

  const targetMs = useMemo(() => {
    if (!targetIsoDate) return 0;
    const ms = new Date(targetIsoDate).getTime();
    return isNaN(ms) ? 0 : ms;
  }, [targetIsoDate]);

  const computeRemainingSeconds = () => {
    if (!targetMs) return 0;
    const nowAdjusted = Date.now() + skewOffsetRef.current;
    const diff = targetMs - nowAdjusted;
    return diff > 0 ? Math.floor(diff / 1000) : 0;
  };

  const [secondsRemaining, setSecondsRemaining] = useState<number>(computeRemainingSeconds);

  useEffect(() => {
    // Synchronize immediately on target date change
    setSecondsRemaining(computeRemainingSeconds());

    if (!targetMs) return;

    const intervalId = setInterval(() => {
      const next = computeRemainingSeconds();
      setSecondsRemaining((prev) => (prev !== next ? next : prev));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetMs]);

  return useMemo(() => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const days = Math.floor(secondsRemaining / (3600 * 24));
    const hours = Math.floor((secondsRemaining % (3600 * 24)) / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    const seconds = secondsRemaining % 60;

    const dStr = pad(days);
    const hStr = pad(hours);
    const mStr = pad(minutes);
    const sStr = pad(seconds);

    return {
      days: dStr,
      hours: hStr,
      minutes: mStr,
      seconds: sStr,
      formattedString: `${dStr}d : ${hStr}h : ${mStr}m : ${sStr}s`,
      isExpired: secondsRemaining <= 0,
      totalSecondsRemaining: secondsRemaining,
    };
  }, [secondsRemaining]);
}
