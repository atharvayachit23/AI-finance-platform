import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard, Zap, Globe, MessageSquare } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
  await checkUser();

  return (
    <header className="fixed top-4 left-0 right-0 w-full z-50 flex justify-center px-4">
      <nav className="container glass-card rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300 hover:border-primary/40">
        
        {/* Brand Section - Swapped AXON for WELTH */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-glow group-hover:rotate-12 transition-transform duration-300">
            <Zap className="h-5 w-5 text-black fill-current" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">
            WELTH<span className="text-primary">_</span>
          </span>
        </Link>

        {/* Right-aligned Navigation & Actions Wrapper */}
        <div className="flex items-center gap-3">
          
          {/* Navigation Links - Now moved to the right side next to buttons */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5 mr-2">
            <SignedOut>
              <a href="#features" className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center gap-2">
                <Globe size={12} /> Protocol
              </a>
              <a href="#testimonials" className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center gap-2">
                <MessageSquare size={12} /> Feedback
              </a>
            </SignedOut>
            
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="ghost" className="rounded-full text-slate-300 hover:text-primary hover:bg-primary/10 gap-2 h-9 text-xs font-bold uppercase tracking-wider">
                  <LayoutDashboard size={14} />
                  <span>Insights</span>
                </Button>
              </Link>
            </SignedIn>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <SignedIn>
              <Link href="/transaction/create">
                <Button className="hidden sm:flex items-center gap-2 bg-primary text-black hover:bg-emerald-400 rounded-full font-black text-xs uppercase tracking-tighter shadow-glow border-none transition-all active:scale-95 h-9 px-5">
                  <PenBox size={14} />
                  <span>New_Record</span>
                </Button>
              </Link>
            </SignedIn>

            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <Button className="bg-white text-black hover:bg-slate-200 rounded-full font-black text-xs uppercase tracking-widest px-6 h-9 border-none transition-all">
                  Login
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="border-l border-white/10 pl-3 ml-1">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 rounded-xl border-2 border-primary/20 hover:border-primary transition-all shadow-sm",
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;