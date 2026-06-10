import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, ArrowRight, CheckCircle2, Shield, Flame, 
  Menu, Play, Users, MessageSquare, ChevronDown, Award,
  Cpu, FileCode, Check, Zap
} from "lucide-react";
import { LogoIcon } from "./LogoIcon";

interface LandingPageProps {
  onStartBuilding: () => void;
  onLogin: () => void;
  userEmail?: string | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartBuilding, onLogin, userEmail }) => {
  // Before/After comparison slider percentage state
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  
  // ATS simulation animation score
  const [atsScore, setAtsScore] = useState<number>(34);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Live Builder Typing simulation state
  const [simulatedJobText, setSimulatedJobText] = useState<string>("");
  const targetDemoText = "Led visual architecture rebuilds, scaling responsive microfrontends. Reduced first contentful paint by 42% and accelerated customer conversions by 25% across 14 landing portals.";

  useEffect(() => {
    // ATS count simulator looping
    const interval = setInterval(() => {
      setAtsScore(prev => {
        if (prev >= 98) {
          setTimeout(() => setAtsScore(34), 2000);
          return 98;
        }
        return prev + 2;
      });
    }, 120);

    // Typing simulated text looping
    let currentIdx = 0;
    const typingInterval = setInterval(() => {
      setSimulatedJobText(targetDemoText.slice(0, currentIdx));
      currentIdx++;
      if (currentIdx > targetDemoText.length + 30) {
        currentIdx = 0;
      }
    }, 45);

    return () => {
      clearInterval(interval);
      clearInterval(typingInterval);
    };
  }, []);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let clientX = 0;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const relativeX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
    setSliderPos(percentage);
  };

  const faqItems = [
    {
      q: "How does the AI optimize resumes for Applicant Tracking Systems?",
      a: "Our models analyze target job descriptions in real-time, matching missing keywords, required credentials, and core competencies, giving you clear warnings and high-impact suggestions that pass strict screeners."
    },
    {
      q: "Can I try it without paying or connecting any cards?",
      a: "Absolutely! You get up to 2 free AI-optimized resumes on our Free plan. Unlocking our elite themes and infinite generations is available under our premium Pro license."
    },
    {
      q: "How does the interactive AI chat editor refine specific text segments?",
      a: "You can talk directly with the co-pilot (e.g. 'rewrite my summaries to sound more confident' or 'make my engineering bullet points highlight cloud migration size'). AI modifies the raw fields in-place in real-time."
    },
    {
      q: "Is there a PDF vector layout restriction during printing?",
      a: "No! We've styled our print files using pure vector CSS stylesheets. When clicking PDF Export, the resume scales crisply to standard A4/Letter configurations without text distortion."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-400 relative overflow-hidden">
      {/* Background Atmospheric Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-950/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* 1. Header Navigation Bar */}
      <nav className="glass-effect relative py-5 px-6 md:px-12 flex justify-between items-center border-b border-white/5 backdrop-blur-md z-20">
        <div className="flex items-center gap-2 select-none">
          <LogoIcon className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          <span className="font-display font-extrabold text-xl tracking-tight text-white flex items-center">
            Resume<span className="text-emerald-500">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:inline-block text-xs font-mono bg-white/5 border border-white/5 px-3 py-1 rounded-full text-slate-300">
            Current Server UTC: 2026-06-08
          </span>
          {userEmail ? (
            <button
              onClick={onStartBuilding}
              className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-emerald-500 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-emerald-500/30 font-display cursor-pointer"
            >
              Go to Dashboard
            </button>
          ) : (
            <div className="flex items-center gap-5">
              <button 
                onClick={onLogin} 
                className="text-white/60 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={onStartBuilding}
                className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-emerald-500 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-emerald-500/30 font-display cursor-pointer"
              >
                Build My Resume Free
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Glow circles */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-400/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
            <Sparkles size={14} className="text-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-medium text-emerald-400 tracking-wider uppercase">
              Powered by Gemini 1.5 Pro AI
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display leading-[1.05] tracking-tight text-white">
            Land Your Dream Job with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">ResumeAI</span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-xl leading-relaxed">
            The premium AI resume composer trusted by specialists heading to Vercel, Stripe, and Apple. Write metric-driven bullet points, maximize ATS keyword coverage, and export pixel-perfect formats.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={onStartBuilding}
              className="glow-btn bg-emerald-500 hover:bg-emerald-600 text-black px-6 py-3.5 rounded-xl font-bold tracking-wide text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              Build My Resume Free <ArrowRight size={16} />
            </button>
            <button
              onClick={() => {
                const element = document.getElementById("features");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-white/5 hover:bg-white/10 active:scale-95 text-white border border-white/10 hover:border-white/20 px-6 py-3.5 rounded-xl font-medium text-sm flex items-center gap-1.5 cursor-pointer transition-all"
            >
              Explore Features
            </button>
          </div>

          <div className="flex items-center gap-6 pt-6 border-t border-white/5 text-slate-400 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" /> Instant PDF Export
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" /> Interactive AI Co-Pilot
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" /> ATS Analyzer Inside
            </div>
          </div>
        </div>

        {/* Hero Interactive Demo Widget */}
        <div className="lg:col-span-5 relative">
          <div className="glass-effect rounded-2xl border border-white/10 p-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500 creative-gradient-bg" />

            {/* Simulated Live Builder */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span className="text-[10px] font-mono text-slate-400">ResumeAI Agent Co-Pilot</span>
              <span className="text-[10px] font-mono bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-400 border border-emerald-500/20 uppercase font-bold animate-pulse">Streaming</span>
            </div>

            <div className="space-y-4">
              <div>
                <dt className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">User Prompt Input</dt>
                <dd className="bg-slate-900 border border-white/5 rounded-lg p-3 text-xs text-slate-200 flex items-start gap-2 italic">
                  <span className="text-emerald-400 font-bold font-mono">CMD:</span> "Rewrite my engineering bullets to highlight visual performance metrics."
                </dd>
              </div>

              <div>
                <dt className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Dynamic Resume Render</dt>
                <div className="bg-[#ffffff] text-slate-900 rounded-lg p-4 font-sans text-xs shadow-inner min-h-[140px] flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold font-display uppercase tracking-wider text-slate-900 border-b border-slate-150 pb-0.5 mb-2">Google — Software Engineer</h4>
                    <p className="font-mono text-[9px] text-slate-500 font-bold mb-1.5">Present Work Experience</p>
                    <p className="text-slate-700 leading-relaxed min-h-[60px] font-serif transition-all duration-300">
                      • {simulatedJobText}
                      <span className="inline-block w-1.5 h-3 bg-emerald-500 ml-0.5 animate-pulse" />
                    </p>
                  </div>
                  <div className="flex gap-1 flex-wrap pt-2 mt-2 border-t border-slate-100">
                    <span className="bg-emerald-50 text-emerald-700 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border border-emerald-100">Metric Enhanced</span>
                    <span className="bg-indigo-50 text-indigo-700 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border border-indigo-100">High Score</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floater Stats Widget */}
          <div className="absolute -bottom-8 -left-8 glass-effect rounded-2xl border border-white/10 p-4 shadow-2xl flex items-center gap-3 backdrop-blur-md">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <Award size={20} />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Interactive ATS Match</p>
              <h4 className="text-lg font-bold text-white font-display">
                {atsScore}% <span className="text-xs text-emerald-400 font-mono font-normal">Success</span>
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Before / After Resume Slider */}
      <section className="py-20 bg-gradient-to-b from-[#0a0a0f] to-[#0c0c14] border-y border-white/5 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight text-white">
            Visual Harmony: Before vs After
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Drag the handle or click to witness standard boring templates transition into elite, high-visibility visual layouts.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Interactive slider platform */}
          <div 
            className="relative h-[480px] w-full rounded-2xl border border-white/10 overflow-hidden cursor-ew-resize select-none shadow-2xl"
            onMouseMove={handleSliderMove}
            onTouchMove={handleSliderMove}
            onClick={handleSliderMove}
          >
            {/* 1. Behind Template: Executive Premium */}
            <div className="absolute inset-0 bg-white text-gray-900 p-8 sm:p-12 font-sans flex flex-col justify-between">
              <div>
                <div className="border-b border-gray-200 pb-5 mb-5 uppercase">
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900">David Henderson</h3>
                  <p className="text-xs font-mono font-bold text-emerald-600 mt-1 uppercase">Lead Distributed Systems Developer</p>
                  <p className="text-xs text-gray-500 max-w-xl leading-relaxed mt-2 italic font-serif">"Empowering products with structured Rust, WebAssembly frameworks, causing speedups."</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-emerald-600 uppercase border-b border-gray-100 pb-0.5 mb-2">Highlighted Projects</h4>
                    <span className="text-xs font-bold text-gray-900">Developed high performance index query parser engine in Go/Rust</span>
                    <p className="text-xs text-gray-600 mt-1">Accelerated core query resolving latency thresholds by 45%. Enabled fully sandboxed container structures executing complex state synchronizations across clusters without thread locks.</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900">Refactored legacy UI components inside billing portal</span>
                    <p className="text-xs text-gray-600 mt-1">Reconfigured cache protocols saving $25k monthly hosting fees while sustaining high loading concurrency bounds.</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 font-mono text-[9px] text-gray-400">
                <span>San Jose, CA</span> | <span>david.h@dev.dev</span> | <span>+1 (555) 019-2834</span>
              </div>
            </div>

            {/* 2. Clipping Frame: Ugly Resume Cover */}
            <div 
              className="absolute inset-y-0 left-0 right-0 bg-zinc-900 text-zinc-400 p-8 sm:p-12 font-mono text-xs flex flex-col justify-between"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="min-w-[600px]">
                <div className="border-b border-zinc-750 pb-5 mb-5 uppercase text-zinc-300">
                  <h3 className="text-xl font-bold font-sans">Resume - Dave Henderson</h3>
                  <p className="text-[10px] mt-1">Looking for a role. Web dev and backend coder.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-zinc-300 font-bold uppercase underline">Stuff I worked on</h4>
                    <span className="text-[11px] font-bold">Main Engineer — Startup</span>
                    <p className="text-zinc-400 mt-1">Did things with Rust. Rewrote parsing. Fixed database lags. Also fixed visual pages. Team liked it.</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold">Helper Developer</span>
                    <p className="text-zinc-400 mt-1">Maintained dashboard and wrote some React stuff to billing. Reduced bugs.</p>
                  </div>
                </div>
              </div>
              <div className="min-w-[600px] text-[10px]">
                <span>Work email contact here: davie@gmail</span>
              </div>
            </div>

            {/* Slider bar line */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-emerald-500 cursor-ew-resize group shadow-[0_0_15px_rgba(16,185,129,0.8)]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-slate-950 font-bold text-xs select-none shadow-lg shadow-emerald-500/50">
                ↔️
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core SaaS Feature Grid Cards */}
      <section id="features" className="py-20 px-6 md:px-12 max-w-7xl mx-auto relative">
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono px-3 py-1 rounded-full uppercase font-medium">
            Next-Gen Suite AI
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-white">
            Everything You Need to Dominate
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            A premium full-stack ecosystem engineered to elevate your job search metrics. No generic filler content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-effect p-6 rounded-2xl hover:border-emerald-500/30 transition-all group hover:bg-white/[0.01]">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
              <Sparkles size={18} />
            </div>
            <h3 className="text-lg font-bold text-white font-display mb-2 flex items-center justify-between">
              AI Resume Generator
              <span className="text-[9px] font-mono bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-400 font-bold uppercase">Streaming</span>
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Fill out a simple background draft and our advanced models write professional metric-driven highlights across 4 writing styles instantly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-effect p-6 rounded-2xl hover:border-emerald-500/30 transition-all group hover:bg-white/[0.01]">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
              <Award size={18} />
            </div>
            <h3 className="text-lg font-bold text-white font-display mb-2 flex items-center justify-between">
              20+ Premium Templates
              <span className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded text-slate-300 font-bold uppercase">Premium</span>
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Modern Minimal, Executive Indigo, Creative Gradient, and ATS-Friendly Clean blueprints configured for responsive desktop presentation or crisp print-outs.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-effect p-6 rounded-2xl hover:border-emerald-500/30 transition-all group hover:bg-white/[0.01]">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
              <Users size={18} />
            </div>
            <h3 className="text-lg font-bold text-white font-display mb-2 flex items-center justify-between">
              AI Cover Letter Suite
              <span className="text-[9px] font-mono bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-400 font-bold uppercase font-bold">1-Click</span>
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Match your resume directly against targeted postings, generating magnetic introductory narratives styled across high-conversion tones.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-effect p-6 rounded-2xl hover:border-emerald-500/30 transition-all group hover:bg-white/[0.01]">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
              <Shield size={18} />
            </div>
            <h3 className="text-lg font-bold text-white font-display mb-2 flex items-center justify-between">
              ATS Score Gauge
              <span className="text-[9px] font-mono bg-red-400/10 px-2 py-0.5 rounded text-red-400 font-bold uppercase font-bold">Scanner</span>
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Analyze keyword matching percentages instantly. Underline missing skills, required certifications, and retrieve actionable fixes to maximize your callback counts.
            </p>
          </div>

          {/* Card 5 */}
          <div className="glass-effect p-6 rounded-2xl hover:border-emerald-500/30 transition-all group hover:bg-white/[0.01]">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
              <MessageSquare size={18} />
            </div>
            <h3 className="text-lg font-bold text-white font-display mb-2 flex items-center justify-between">
              Interactive AI Chat Editor
              <span className="text-[9px] font-mono bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-400 font-bold uppercase font-bold">Live</span>
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Command corrections via conversational chat. Instruct: "Make my leadership bullets reflect more metrics" or "add rust skills" and watch the content auto-correct in real-time.
            </p>
          </div>

          {/* Card 6 */}
          <div className="glass-effect p-6 rounded-2xl hover:border-emerald-500/30 transition-all group hover:bg-white/[0.01]">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
              <Cpu size={18} />
            </div>
            <h3 className="text-lg font-bold text-white font-display mb-2 flex items-center justify-between">
              LinkedIn Optimizer
              <span className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded text-slate-300 font-bold uppercase">Optimized</span>
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Re-engineer raw resumes into search-optimized LinkedIn profiles, composing punchy professional summaries, high SEO scores and copy-paste ready profiles.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Pricing Monetization Plans */}
      <section className="py-20 bg-gradient-to-[#0a0a0f] to-[#0a0a0f] px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono px-3 py-1 rounded-full uppercase font-medium">
            Monetization Plans
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-white">
            Unlock Unlimited Potential
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Choose the plan optimized for your current phase of business growth. Cancel anytime.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

          {/* Standard Plan */}
          <div className="glass-effect rounded-2xl border border-white/5 p-8 relative flex flex-col justify-between">
            <div>
              <span className="text-slate-400 text-xs font-mono uppercase tracking-widest block mb-1">Standard License</span>
              <h3 className="text-2xl font-bold text-white font-display flex items-baseline gap-2">
                Free Tier <span className="text-slate-500 text-xs font-normal">Active</span>
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mt-4">
                Perfect for drafting your initial resume structure and testing out our generative AI templates.
              </p>

              <div className="border-t border-white/5 my-6 pt-6 space-y-3.5">
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Check size={14} className="text-emerald-400" /> Max 2 saved resumes
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Check size={14} className="text-emerald-400" /> Access to 3 basic templates
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Check size={14} className="text-emerald-400" /> Basic ATS matching tests
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-400 line-through">
                  × Cover Letter Creator
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-400 line-through">
                  × Premium Vector Print-Styles (No Watermark)
                </div>
              </div>
            </div>

            <button 
              onClick={onStartBuilding}
              className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium text-xs rounded-xl py-3 cursor-pointer"
            >
              Get Started for Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="glass-effect rounded-2xl border-2 border-emerald-500/30 p-8 relative overflow-hidden flex flex-col justify-between glow-emerald">
            <div className="absolute top-0 right-0 bg-emerald-500 text-black font-mono font-bold text-[9px] tracking-wide uppercase px-3.5 py-1 rounded-bl-xl shadow-lg shadow-emerald-500/20 animate-pulse">
              Highly Recommended
            </div>

            <div>
              <span className="text-emerald-400 text-xs font-mono uppercase tracking-widest block mb-1">Elite Lifetime Access</span>
              <h3 className="text-2xl font-bold text-white font-display flex items-baseline gap-2">
                $9 <span className="text-slate-400 text-xs font-normal">/ month</span>
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed mt-4">
                Designed to place candidates in top-tier global software companies. Instant high priority access.
              </p>

              <div className="border-t border-emerald-500/10 my-6 pt-6 space-y-3.5">
                <div className="flex items-center gap-2.5 text-xs text-white font-medium">
                  <Zap size={14} className="text-emerald-400 fill-emerald-400" /> **Unlimited Saved Resumes**
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Check size={14} className="text-emerald-400" /> Unlocks all 20+ Premium templates
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Check size={14} className="text-emerald-400" /> Actionable key-phrase ATS checker
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Check size={14} className="text-emerald-400" /> matching Cover Letter Generator
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Check size={14} className="text-emerald-400" /> Custom LinkedIn Optimization
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-bold text-emerald-400">
                  <Check size={14} className="text-emerald-400" /> Zero branding Watermarks
                </div>
              </div>
            </div>

            <button 
              onClick={onStartBuilding}
              className="w-full glow-btn bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded-xl py-3 cursor-pointer"
            >
              Get Pro Elite Access
            </button>
          </div>
        </div>
      </section>

      {/* 6. Accordion Frequently Asked Questions (FAQ) */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-extrabold font-display text-center mb-10 text-white">
          Frequently Answered Inquiries
        </h2>

        <div className="space-y-4">
          {faqItems.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className="glass-effect rounded-xl border border-white/5 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between text-sm font-semibold text-slate-200 hover:text-white cursor-pointer"
                >
                  {faq.q}
                  <ChevronDown 
                    size={16} 
                    className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-emerald-400" : ""}`} 
                  />
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Micro-Stats */}
      <footer className="relative z-10 px-6 md:px-10 py-6 border-t border-white/5 flex flex-col md:flex-row gap-6 items-center justify-between backdrop-blur-md bg-[#0a0a0f]/50">
        <div className="flex flex-wrap items-center gap-6 md:gap-10">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-white/30 font-bold tracking-widest">Users Hired</span>
            <span className="text-sm font-medium">12,402 this month</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-white/30 font-bold tracking-widest">Avg. Salary Increase</span>
            <span className="text-sm font-medium text-emerald-400">+42%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-white/30 font-bold tracking-widest">Premium Templates</span>
            <span className="text-sm font-medium">20+ Designer Curated</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#0a0a0f] bg-slate-500 shadow-lg"></div>
            <div className="w-8 h-8 rounded-full border-2 border-[#0a0a0f] bg-emerald-500 shadow-lg"></div>
            <div className="w-8 h-8 rounded-full border-2 border-[#0a0a0f] bg-indigo-500 shadow-lg"></div>
          </div>
          <span className="text-xs text-white/45 font-medium">Joined by 2,000+ professionals today</span>
        </div>
      </footer>

      {/* 7. Footer Accent Block */}
      <footer className="mt-auto py-8 text-center border-t border-white/5 text-slate-500 text-xs font-mono bg-[#06060a]/90 relative z-10">
        <p>© 2026 ResumeAI SaaS Corp. English Only. Crafted sequentially for enterprise callback results.</p>
      </footer>
    </div>
  );
};
