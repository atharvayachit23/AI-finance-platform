import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Welth",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/logo-sm.png" sizes="any" />
        </head>
        <body className={cn(inter.className, "bg-[#050505] text-slate-200 antialiased overflow-x-hidden relative w-full")}>
          <Header />
          <main className="min-h-screen w-full">
            {children}
          </main>
          <Toaster richColors />

          {/* Obsidian Footer Overhaul */}
          <footer className="border-t border-white/5 bg-black/40 backdrop-blur-md py-12 w-full">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 mb-4" />
                
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                  Terminal_Protocol_V3.0
                </p>
                
                <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                  Engineered_by <span className="text-primary shadow-glow-sm">Group_33</span>
                </p>
                
                <div className="text-[9px] text-slate-600 font-mono mt-4">
                  © {new Date().getFullYear()} WELTH_FINANCIAL_SYSTEMS // SECURE_ENCRYPTION_ENABLED
                </div>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}