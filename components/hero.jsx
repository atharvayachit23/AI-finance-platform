"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Zap, ShieldCheck } from "lucide-react";

const HeroSection = () => {
  const imageRef = useRef(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative pt-48 pb-32 px-4 overflow-hidden">
      {/* Background Accent Glows - Fixed width for mobile */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-primary/10 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 mb-10 transition-all hover:border-primary/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            WELTH_CORE_SYSTEM_v2.0
          </span>
        </div>

        {/* Hero Title - Configured with padding right to prevent italic clipping of "E" */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[110px] xl:text-[115px] font-black tracking-tight text-white mb-8 uppercase italic leading-[1.02] sm:leading-[0.98] lg:leading-[0.95] pr-4">
          Manage <br />
          {/* Added 'inline-block', 'pr-6', and 'pb-2' to the span. 
            This expands the bounding box calculation for the gradient clip,
            completely preventing the italicized slant of the final "e" from being clipped.
          */}
          <span className="inline-block pr-6 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-emerald-400 select-none">
            Finance
          </span>
        </h1>

        <p className="text-base md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Your personal finance companion. Track spending, manage budgets, and make
            better financial decisions with{" "}
            <span className="text-white">Welth's AI-powered insights.</span>
          </p>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-24">
          <a href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-16 px-10 rounded-full bg-primary text-black font-black hover:bg-emerald-400 shadow-glow hover:scale-105 transition-all border-none group">
              DASHBOARD <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
          <a href="#features" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full h-16 px-10 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all font-bold">
              FEATURES
            </Button>
          </a>
        </div>

        <div className="hero-image-wrapper mt-10 md:mt-0 w-full flex justify-center">
          <div 
            ref={imageRef} 
            className="hero-image glass-card rounded-[2.5rem] p-2 md:p-3 bg-white/5 border-white/10 shadow-2xl relative w-full max-w-5xl"
          >
            <div className="absolute top-8 left-8 z-10 hidden md:flex items-center gap-3 text-primary">
               <Zap className="h-5 w-5 fill-current shadow-glow" />
               <span className="text-[10px] font-bold tracking-widest uppercase">Encryption_Active</span>
            </div>
            
            <div className="absolute bottom-8 right-8 z-10 hidden md:flex items-center gap-2 text-slate-500 font-mono text-[10px]">
               <ShieldCheck className="h-4 w-4" /> 256-BIT_SECURE
            </div>

            {/* Premium cover interface wrapper */}
            <div className="relative rounded-[2rem] overflow-hidden bg-black border border-white/5 aspect-[16/9] w-full">
              {!imgError ? (
                <img
                  src="/banner.jpeg"
                  alt="Welth Dashboard Interface"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 hover:opacity-85 transition-opacity duration-1000"
                  onError={() => setImgError(true)}
                />
              ) : (
                /* Sleek Emerald Vector Dashboard Fallback if banner.jpeg is local & missing in sandbox */
                <div className="absolute inset-0 w-full h-full bg-neutral-950 p-6 flex flex-col justify-between font-mono text-[10px] text-neutral-500 select-none">
                  {/* Top Bar */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/40" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                      </div>
                      <span className="text-white font-bold text-[11px] tracking-tight">TERMINAL_INSIGHTS // CONSOLE_v2.0</span>
                    </div>
                    <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">STATUS: SECURE</span>
                  </div>

                  {/* Mock Charts & Cards */}
                  <div className="grid grid-cols-12 gap-4 my-auto h-4/5 items-stretch">
                    {/* Left Chart Area */}
                    <div className="col-span-8 border border-white/5 rounded-xl bg-neutral-900/20 p-4 flex flex-col justify-between relative overflow-hidden">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-neutral-300 font-bold uppercase tracking-wider text-[9px]">FLOW_METRIC_TELEMETRY</span>
                        <span className="text-emerald-400 font-semibold text-[9px]">+14.2% THIS_MONTH</span>
                      </div>
                      
                      {/* Responsive Mock Line Chart SVG */}
                      <svg viewBox="0 0 400 150" className="w-full h-24 overflow-visible">
                        <path
                          d="M0 120 Q50 90 100 110 T200 40 T300 70 T400 20"
                          fill="none"
                          stroke="rgba(16, 185, 129, 0.4)"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <path
                          d="M0 120 Q50 90 100 110 T200 40 T300 70 T400 20 L400 150 L0 150 Z"
                          fill="url(#grad)"
                          opacity="0.05"
                        />
                        <defs>
                          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#000" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.02)" strokeDasharray="3" />
                        <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.02)" strokeDasharray="3" />
                      </svg>

                      <div className="flex justify-between items-center text-[8px] text-neutral-600 mt-2 border-t border-white/5 pt-2">
                        <span>WK_01</span>
                        <span>WK_02</span>
                        <span>WK_03</span>
                        <span>WK_04</span>
                      </div>
                    </div>

                    {/* Right Info Panels */}
                    <div className="col-span-4 flex flex-col gap-3 justify-between">
                      <div className="border border-white/5 rounded-xl bg-neutral-900/20 p-3 flex flex-col justify-between">
                        <span className="text-neutral-500 font-bold uppercase tracking-wider text-[8px]">ACTIVE_VAULT_BALANCE</span>
                        <span className="text-white font-extrabold text-sm sm:text-base mt-1 text-emerald-400">₹4,28,450.00</span>
                        <span className="text-[8px] text-neutral-600 mt-0.5">VAULT_ID // IN_A042</span>
                      </div>
                      <div className="border border-white/5 rounded-xl bg-neutral-900/20 p-3 flex flex-col justify-between">
                        <span className="text-neutral-500 font-bold uppercase tracking-wider text-[8px]">BUDGET_CAP_THRESHOLD</span>
                        <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                          <div className="bg-emerald-500 h-full w-[65%] rounded-full animate-pulse" />
                        </div>
                        <span className="text-[8px] text-emerald-400/80 mt-1 font-semibold">65% SYSTEM_LOAD // ON TRACK</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Security Info */}
                  <div className="flex justify-between text-neutral-600 text-[8px] border-t border-white/5 pt-3">
                    <span>SECURITY_HASH: MD5_5F4DCC3B5AA765D61D8327DEB882CF99</span>
                    <span>© {new Date().getFullYear()} WELTH INC. ALL RIGHTS RESERVED.</span>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;