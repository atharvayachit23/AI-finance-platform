import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import HeroSection from "@/components/hero";
import Link from "next/link";
import { Zap, ShieldCheck, BarChart3, ChevronRight } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-slate-200 overflow-x-hidden">
      {/* Hero Section - The entry point */}
      <HeroSection />

      {/* Stats Section - Responsive Grid fix */}
      <section className="py-24 relative overflow-hidden border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {statsData.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-5xl font-black text-primary mb-3 tracking-tighter shadow-glow transition-transform group-hover:scale-110 duration-300">
                  {stat.value}
                </div>
                <div className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-16 md:mb-20">
             <span className="text-primary text-xs font-bold uppercase tracking-[0.4em] block mb-4">Core_Capabilities</span>
             <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
               Financial <span className="text-primary">Telemetry_</span>
             </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresData.map((feature, index) => (
              <div key={index} className="glass-card rounded-3xl p-6 md:p-8 hover:border-primary/50 transition-all group">
                <div className="mb-6 p-3 w-fit rounded-2xl bg-primary/10 border border-primary/20 text-primary group-hover:shadow-glow transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 bg-white/[0.01] border-y border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-16 md:mb-20 tracking-tighter uppercase italic">Execution_Protocol</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 relative">
            {howItWorksData.map((step, index) => (
              <div key={index} className="relative z-10 group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-black border-2 border-primary shadow-glow rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-8 transition-transform group-hover:rotate-12">
                  <span className="text-primary">{step.icon}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-4 tracking-tight">{step.title}</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-16 md:mb-24 tracking-tighter uppercase italic">User_Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonialsData.map((testimonial, index) => (
              <div key={index} className="glass-card rounded-[2rem] p-6 md:p-8 border border-white/5 relative">
                <div className="flex items-center mb-6 md:mb-8">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="rounded-xl grayscale hover:grayscale-0 transition-all md:w-[48px] md:h-[48px]"
                  />
                  <div className="ml-4 text-left">
                    <div className="font-bold text-white tracking-tight text-sm md:text-base">{testimonial.name}</div>
                    <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary font-bold">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-slate-400 italic text-sm leading-relaxed text-left">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Fixed padding/radius for mobile */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] -z-10" />
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto glass-card rounded-[2rem] md:rounded-[3rem] py-12 md:py-20 px-6 md:px-8 border-primary/20">
            <h2 className="text-3xl md:text-6xl font-black text-white mb-6 md:mb-8 tracking-tighter uppercase italic">
              Ready to initialize?
            </h2>
            <p className="text-slate-400 mb-8 md:mb-12 max-w-xl mx-auto font-medium text-sm md:text-base">
              Deploy the Welth protocol to your personal assets and gain full telemetry over your financial future.
            </p>
            <Link href="/dashboard" className="w-full sm:w-auto inline-block">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary text-black hover:bg-emerald-400 hover:scale-105 transition-all rounded-full font-black px-8 md:px-12 h-14 md:h-16 shadow-glow border-none"
              >
                ACCESS_TERMINAL <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;