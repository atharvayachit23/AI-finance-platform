"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Mail, 
  ChevronDown,
  Sparkles
} from "lucide-react";

export function GenerateReportCard() {
  const [period, setPeriod] = useState("current");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const dropdownRef = useRef(null);

  const periodOptions = [
    { value: "current", label: "Current Month" },
    { value: "previous", label: "Previous Month" },
    { value: "last3months", label: "Last 3 Months" },
    { value: "last12months", label: "Last 12 Months" }
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOption = periodOptions.find(opt => opt.value === period) || periodOptions[0];

  const handleGenerateReport = async () => {
    setLoading(true);
    setStatus(null);
    setIsDropdownOpen(false);

    try {
      const response = await fetch("/api/monthly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType: period }),
      });

      if (!response.ok) {
        throw new Error("Failed to dispatch report pipeline");
      }

      setStatus("success");
    } catch (error) {
      console.error("[REPORT_GENERATION_UI_ERROR]:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6 shadow-2xl transition-all duration-300 hover:border-emerald-500/20">
      
      {/* FIX: Ambient spotlight container set to overflow-hidden so blurs do not leak, leaving dropdown unclipped */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none" aria-hidden="true">
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/10 blur-2xl" />
      </div>

      <div className="flex items-start justify-between relative z-10">
        <h3 className="text-base sm:text-lg font-bold text-white uppercase font-mono tracking-tight flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          AI_Report_Engine
        </h3>
        <span className="text-[9px] font-bold font-mono tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
          CORE_v2.0
        </span>
      </div>
      
      <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans relative z-10">
        Generate standard telemetry reports directly into your verified email.
      </p>

      {/* Dropdown container */}
      <div className="relative mt-5 z-20" ref={dropdownRef}>
        <span className="block text-[10px] font-bold font-mono uppercase tracking-wider text-neutral-500 mb-1.5">
          TIME_HORIZON
        </span>
        <button
          type="button"
          onClick={() => !loading && setIsDropdownOpen(!isDropdownOpen)}
          disabled={loading}
          className="w-full flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/50 px-3 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 transition-all active:scale-[0.99] cursor-pointer touch-manipulation min-h-[44px]"
        >
          <span className="flex items-center gap-2 font-mono">
            <Calendar className="h-4 w-4 text-emerald-400" />
            {activeOption.label.toUpperCase()}
          </span>
          <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute left-0 right-0 z-50 mt-1 rounded-xl border border-neutral-800 bg-neutral-950 p-1 shadow-2xl animate-in fade-in duration-100">
            {periodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setPeriod(option.value);
                  setIsDropdownOpen(false);
                  setStatus(null);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs text-neutral-300 font-mono hover:bg-neutral-900 hover:text-emerald-400 transition-colors cursor-pointer min-h-[40px]"
              >
                {option.label.toUpperCase()}
                {period === option.value && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 z-10 relative">
        <button
          type="button"
          onClick={handleGenerateReport}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 active:bg-emerald-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-950 disabled:opacity-40 transition-all duration-150 cursor-pointer active:scale-[0.97] touch-manipulation min-h-[44px]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-neutral-950" />
              <span>DISPATCHING_PIPELINE...</span>
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 text-neutral-950" />
              <span>COMPILE_REPORT</span>
            </>
          )}
        </button>
      </div>

      {status === "success" && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl p-3 text-xs bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 font-mono relative z-10">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-emerald-200">PIPELINE_SUCCESSFUL</p>
            <p className="text-neutral-400 text-[11px] mt-0.5">Telemetry report is routed to your system register email.</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl p-3 text-xs bg-rose-950/30 border border-rose-500/20 text-rose-300 font-mono relative z-10">
          <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-200">PIPELINE_FAILURE</p>
            <p className="text-neutral-400 text-[11px] mt-0.5">Could not reach analysis core. Check local parameters.</p>
          </div>
        </div>
      )}
    </div>
  );
}