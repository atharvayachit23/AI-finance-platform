"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, Zap, ShieldCheck } from "lucide-react";

const HeroSection = () => {
  const imageRef = useRef(null);

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

        {/* Hero Title - Adjusted for mobile (text-4xl) */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[115px] font-black tracking-tighter text-white mb-8 uppercase italic leading-[0.85] break-words">
          Manage <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-emerald-400">
            Intelligence
          </span>
        </h1>

        <p className="text-base md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          The definitive financial telemetry platform. Elevate your capital management with 
          <span className="text-white"> Welth</span>—precision tracking meets AI-driven insights.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-24">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-16 px-10 rounded-full bg-primary text-black font-black hover:bg-emerald-400 shadow-glow hover:scale-105 transition-all border-none group">
              ACCESS_TERMINAL <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="#features" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full h-16 px-10 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all font-bold">
              SYSTEM_PROTOCOL
            </Button>
          </Link>
        </div>

        <div className="hero-image-wrapper mt-10 md:mt-0">
          <div 
            ref={imageRef} 
            className="hero-image glass-card rounded-[2.5rem] p-2 md:p-3 bg-white/5 border-white/10 shadow-2xl relative"
          >
            <div className="absolute top-8 left-8 z-10 hidden md:flex items-center gap-3 text-primary">
               <Zap className="h-5 w-5 fill-current shadow-glow" />
               <span className="text-[10px] font-bold tracking-widest uppercase">Encryption_Active</span>
            </div>
            
            <div className="absolute bottom-8 right-8 z-10 hidden md:flex items-center gap-2 text-slate-500 font-mono text-[10px]">
               <ShieldCheck className="h-4 w-4" /> 256-BIT_SECURE
            </div>

            <div className="relative rounded-[2rem] overflow-hidden bg-black border border-white/5 aspect-video">
              <Image
                src="/banner.jpeg"
                width={1280}
                height={720}
                alt="Welth Dashboard Interface"
                className="object-cover opacity-60 hover:opacity-80 transition-opacity duration-1000"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;