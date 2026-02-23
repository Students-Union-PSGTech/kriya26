"use client";

import { useState, useEffect, useCallback } from "react";

const TTL_MS = 60 * 1000; // 1 minute

const DEFAULT_CONFIG = {
  registrationClosedAll: { events: false, workshops: false, papers: false },
  registrationClosedIds: { events: [], workshops: [], papers: [] },
  paymentActionsDisabled: false,
  whatsappDisabledAll: false,
  whatsappDisabledIds: [],
};

let cachedConfig = null;
let cachedAt = 0;

export function useKillSwitch() {
  const [config, setConfig] = useState(cachedConfig ?? DEFAULT_CONFIG);
  const [loading, setLoading] = useState(!cachedConfig);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/kill-switch", { credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        const merged = { ...DEFAULT_CONFIG, ...data };
        cachedConfig = merged;
        cachedAt = Date.now();
        setConfig(merged);
      }
    } catch {
      setConfig(DEFAULT_CONFIG);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cachedConfig && Date.now() - cachedAt < TTL_MS) {
      setConfig(cachedConfig);
      setLoading(false);
      return;
    }
    fetchConfig();
  }, [fetchConfig]);

  return { config, loading, refetch: fetchConfig };
}
