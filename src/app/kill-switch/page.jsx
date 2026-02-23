"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";

const DEFAULT_CONFIG = {
  registrationClosedAll: { events: false, workshops: false, papers: false },
  registrationClosedIds: { events: [], workshops: [], papers: [] },
  paymentActionsDisabled: false,
  whatsappDisabledAll: false,
  whatsappDisabledIds: [],
};

function mergeConfig(data) {
  return {
    registrationClosedAll: { ...DEFAULT_CONFIG.registrationClosedAll, ...data?.registrationClosedAll },
    registrationClosedIds: {
      events: Array.isArray(data?.registrationClosedIds?.events) ? data.registrationClosedIds.events : [],
      workshops: Array.isArray(data?.registrationClosedIds?.workshops) ? data.registrationClosedIds.workshops : [],
      papers: Array.isArray(data?.registrationClosedIds?.papers) ? data.registrationClosedIds.papers : [],
    },
    paymentActionsDisabled: Boolean(data?.paymentActionsDisabled),
    whatsappDisabledAll: Boolean(data?.whatsappDisabledAll),
    whatsappDisabledIds: Array.isArray(data?.whatsappDisabledIds) ? data.whatsappDisabledIds : [],
  };
}

export default function KillSwitchPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [sessionChecking, setSessionChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [config, setConfig] = useState(mergeConfig(null));
  const [configLoading, setConfigLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const verifySession = useCallback(async () => {
    try {
      const res = await fetch("/api/kill-switch/verify", { credentials: "include" });
      const data = await res.json();
      setAuthenticated(res.ok && data.ok);
    } catch {
      setAuthenticated(false);
    } finally {
      setSessionChecking(false);
    }
  }, []);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  const fetchConfig = useCallback(async () => {
    setConfigLoading(true);
    try {
      const res = await fetch("/api/kill-switch", { credentials: "include" });
      const data = await res.json();
      if (res.ok) setConfig(mergeConfig(data));
    } catch {
      setConfig(mergeConfig(null));
    } finally {
      setConfigLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchConfig();
  }, [authenticated, fetchConfig]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await fetch("/api/kill-switch/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthenticated(true);
        setPassword("");
      } else {
        setAuthError(data.message || "Invalid password.");
      }
    } catch {
      setAuthError("Request failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const updateRegistrationClosedAll = (key, value) => {
    setConfig((prev) => ({
      ...prev,
      registrationClosedAll: { ...prev.registrationClosedAll, [key]: value },
    }));
  };

  const addClosedId = (type, id) => {
    const trimmed = (id || "").trim();
    if (!trimmed) return;
    setConfig((prev) => ({
      ...prev,
      registrationClosedIds: {
        ...prev.registrationClosedIds,
        [type]: prev.registrationClosedIds[type].includes(trimmed)
          ? prev.registrationClosedIds[type]
          : [...prev.registrationClosedIds[type], trimmed],
      },
    }));
  };

  const removeClosedId = (type, id) => {
    setConfig((prev) => ({
      ...prev,
      registrationClosedIds: {
        ...prev.registrationClosedIds,
        [type]: prev.registrationClosedIds[type].filter((x) => x !== id),
      },
    }));
  };

  const addWhatsAppDisabledId = (id) => {
    const trimmed = (id || "").trim();
    if (!trimmed) return;
    setConfig((prev) => ({
      ...prev,
      whatsappDisabledIds: prev.whatsappDisabledIds.includes(trimmed)
        ? prev.whatsappDisabledIds
        : [...prev.whatsappDisabledIds, trimmed],
    }));
  };

  const removeWhatsAppDisabledId = (id) => {
    setConfig((prev) => ({
      ...prev,
      whatsappDisabledIds: prev.whatsappDisabledIds.filter((x) => x !== id),
    }));
  };

  const handleSave = async () => {
    setSaveStatus(null);
    setSaveLoading(true);
    try {
      const res = await fetch("/api/kill-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveStatus({ type: "success", text: "Settings saved." });
      } else {
        if (res.status === 401) {
          setAuthenticated(false);
          setSaveStatus({ type: "error", text: "Session expired. Please log in again." });
        } else {
          setSaveStatus({ type: "error", text: data.message || "Failed to save." });
        }
      }
    } catch {
      setSaveStatus({ type: "error", text: "Request failed." });
    } finally {
      setSaveLoading(false);
    }
  };

  if (sessionChecking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse font-general uppercase tracking-wider">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black text-white pt-28 pb-20 px-4">
        <Navbar />
        <div className="max-w-md mx-auto mt-20">
          <h1 className="special-font text-2xl md:text-3xl uppercase mb-2">Kill Switch</h1>
          <p className="text-gray-400 text-sm mb-6">Enter password to continue.</p>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              autoFocus
            />
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-general uppercase tracking-wider"
            >
              {authLoading ? "Checking..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20 px-4 md:px-8">
      <Navbar />
      <div className="max-w-3xl mx-auto">
        <h1 className="special-font text-3xl md:text-4xl uppercase mb-2">Kill Switch</h1>
        <p className="text-gray-400 text-sm mb-8">Control registration, payment actions, and WhatsApp links.</p>

        {configLoading ? (
          <div className="py-12 text-gray-400 uppercase tracking-wider">Loading settings...</div>
        ) : (
          <div className="space-y-8">
            {/* Registration */}
            <section className="border border-white/10 rounded-xl p-6 bg-white/5">
              <h2 className="special-font text-xl uppercase mb-4">Registration</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.registrationClosedAll.events}
                    onChange={(e) => updateRegistrationClosedAll("events", e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-white/30 bg-white/5 accent-red-500"
                  />
                  <span>Close all events</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.registrationClosedAll.workshops}
                    onChange={(e) => updateRegistrationClosedAll("workshops", e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-white/30 bg-white/5 accent-red-500"
                  />
                  <span>Close all workshops</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.registrationClosedAll.papers}
                    onChange={(e) => updateRegistrationClosedAll("papers", e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-white/30 bg-white/5 accent-red-500"
                  />
                  <span>Close all paper presentations</span>
                </label>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-gray-400 text-sm mb-2">Close specific IDs (optional)</p>
                {["events", "workshops", "papers"].map((type) => (
                  <div key={type} className="mb-4">
                    <p className="text-xs uppercase text-gray-500 mb-1">{type}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {config.registrationClosedIds[type].map((id) => (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-sm"
                        >
                          {id}
                          <button
                            type="button"
                            onClick={() => removeClosedId(type, id)}
                            className="text-red-400 hover:text-red-300"
                            aria-label={`Remove ${id}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Add ${type.slice(0, -1)} ID`}
                        className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/20 text-sm focus:border-blue-500 focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addClosedId(type, e.target.value);
                            e.target.value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          addClosedId(type, input?.value);
                          if (input) input.value = "";
                        }}
                        className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-sm uppercase"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Payment */}
            <section className="border border-white/10 rounded-xl p-6 bg-white/5">
              <h2 className="special-font text-xl uppercase mb-4">Payment</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.paymentActionsDisabled}
                  onChange={(e) => setConfig((prev) => ({ ...prev, paymentActionsDisabled: e.target.checked }))}
                  className="w-5 h-5 rounded border-2 border-white/30 bg-white/5 accent-red-500"
                />
                <span>Disable Pay Now and Check Payment Status</span>
              </label>
            </section>

            {/* WhatsApp */}
            <section className="border border-white/10 rounded-xl p-6 bg-white/5">
              <h2 className="special-font text-xl uppercase mb-4">WhatsApp</h2>
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={config.whatsappDisabledAll}
                  onChange={(e) => setConfig((prev) => ({ ...prev, whatsappDisabledAll: e.target.checked }))}
                  className="w-5 h-5 rounded border-2 border-white/30 bg-white/5 accent-red-500"
                />
                <span>Disable WhatsApp group for all events/workshops/papers</span>
              </label>
              <div>
                <p className="text-gray-400 text-sm mb-2">Disable WhatsApp for specific IDs (optional)</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {config.whatsappDisabledIds.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-sm"
                    >
                      {id}
                      <button
                        type="button"
                        onClick={() => removeWhatsAppDisabledId(id)}
                        className="text-red-400 hover:text-red-300"
                        aria-label={`Remove ${id}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add event/workshop/paper ID"
                    className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/20 text-sm focus:border-blue-500 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addWhatsAppDisabledId(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      addWhatsAppDisabledId(input?.value);
                      if (input) input.value = "";
                    }}
                    className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-sm uppercase"
                  >
                    Add
                  </button>
                </div>
              </div>
            </section>

            {saveStatus && (
              <p
                className={
                  saveStatus.type === "success"
                    ? "text-emerald-400 text-sm"
                    : "text-red-400 text-sm"
                }
              >
                {saveStatus.text}
              </p>
            )}
            <button
              onClick={handleSave}
              disabled={saveLoading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-general uppercase tracking-wider"
            >
              {saveLoading ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
