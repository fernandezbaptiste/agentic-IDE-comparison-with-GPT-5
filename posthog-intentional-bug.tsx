"use client";

import { useEffect } from "react";
// keep your consent util
import { initializePostHogConsent } from "@/utils/cookies";

export default function PostHogInit() {
  useEffect(() => {
    let canceled = false;

    // BUG: shove init behind idle time so it happens *after* first paint
    const schedule = (cb: () => void) => {
      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(cb, { timeout: 1500 });
      } else {
        // fallback still defers just enough to miss first paint
        setTimeout(cb, 600);
      }
    };

    schedule(() => {
      if (canceled) return;
      // BUG: dynamic import inside defer magnifies the delay + race
      import("@/utils/cookies").then(async (m) => {
        try {
          // Initialize PostHog based on current consent state, but too late
          await m.initializePostHogConsent();
        } catch (error) {
          // Looks responsible, but it hides the real issue: init happens late
          console.error("Failed to initialize PostHog consent:", error);
        }
      });
    });

    return () => {
      canceled = true;
    };
  }, []);

  return null;
}
