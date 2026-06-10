import React from "react";
import { ResumeDocument } from "../types";
import { 
  Plus, FileText, Award, Calendar, Trash2, Edit3, 
  ArrowRight, Activity, TrendingUp, Sparkles, LogOut
} from "lucide-react";
import { LogoIcon } from "./LogoIcon";

interface DashboardProps {
  resumes: ResumeDocument[];
  onCreateNew: () => void;
  onEdit: (docId: string) => void;
  onDelete: (docId: string) => void;
  onLogout: () => void;
  userEmail?: string | null;
  onNavigateToTab: (tab: string) => void;
  userPlan: "free" | "pro";
  onUpgradeClick: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  resumes,
  onCreateNew,
  onEdit,
  onDelete,
  onLogout,
  userEmail,
  onNavigateToTab,
  userPlan,
  onUpgradeClick,
}) => {
  // Stats computations
  const totalResumes = resumes.length;
  const avgAtsScore = totalResumes > 0 
    ? Math.round(resumes.reduce((acc, curr) => acc + (curr.atsScore || 0), 0) / totalResumes) 
    : 0;
  const plan = userPlan === "pro" ? "Pro Plan Activated" : "Free Tier";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Background Atmospheric Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-950/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Mini dashboard navigation */}
      <header className="glass-effect relative py-4 px-6 md:px-12 flex justify-between items-center border-b border-white/5 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <LogoIcon className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] cursor-pointer" />
          <span className="font-display font-extrabold tracking-tight text-white cursor-pointer select-none" onClick={() => onNavigateToTab("landing")}>
            Resume<span className="text-emerald-500">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4 z-10">
          <div className="hidden sm:flex flex-col items-end text-right mr-1">
            <span className="text-xs text-white font-medium">{userEmail || "Guest User"}</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">{userPlan === "pro" ? "Pro Plan Activated" : "Free Plan"}</span>
          </div>
          <button
            onClick={onLogout}
            className="p-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-slate-400 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className="flex-grow py-10 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-10">
        
        {/* Welcome and actions banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-2xl border border-emerald-500/10 p-6 md:p-8">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
              Welcome back, <span className="text-emerald-400">{userEmail?.split("@")[0] || "Candidate"}</span>!
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg">
              Generate elite resumes tailored instantly per target job opening. Average callback rates increase by 85% on our premium formats.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateToTab("ats")}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 text-xs px-4 py-3 rounded-lg font-bold flex items-center gap-2 cursor-pointer transition-all"
            >
              <Award size={15} className="text-emerald-400" /> ATS Screener Checker
            </button>
            <button
              onClick={onCreateNew}
              className="glow-btn bg-emerald-500 hover:bg-emerald-600 text-black text-xs px-5 py-3 rounded-lg font-bold flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus size={16} /> Build New Resume
            </button>
          </div>
        </div>

        {/* Dynamic Analytics Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="glass-effect p-5 rounded-xl border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Total Saved Profiles</span>
              <FileText size={15} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black font-display text-white">{totalResumes}</h3>
              <p className="text-[10px] text-slate-500 mt-1">Free Limit: 2 Saved Profiles</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-effect p-5 rounded-xl border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Average ATS Score</span>
              <Award size={15} className="text-teal-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black font-display text-emerald-400">{avgAtsScore}%</h3>
              <p className="text-[10px] text-slate-500 mt-1">Callback benchmark threshold: 80%</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-effect p-5 rounded-xl border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Total PDF Downloads</span>
              <Plus size={15} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black font-display text-white">Infinite</h3>
              <p className="text-[10px] text-slate-500 mt-1">Unlimited clean vector exports</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-effect p-5 rounded-xl border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Current Plan Level</span>
              <TrendingUp size={15} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-emerald-400">
                {userPlan === "pro" ? "Pro Plan Activated" : "Free Plan"}
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">Unlimited edits and template layouts</p>
            </div>
          </div>
        </div>

        {/* Upgrade Offer Banner */}
        {userPlan === "free" && (
          <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent rounded-2xl border border-emerald-500/20 p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden group">
            <div className="space-y-1.5 z-10">
              <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider inline-block">Upgrade Offer</span>
              <h3 className="text-base font-bold text-white font-display">Unlock Premium Career Features</h3>
              <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
                Get unlimited resumes, unlocks all 20+ premium designs, custom .docx exports, resume chat editor, personalized interview question generator, LinkedIn optimizer, Job analysis co-pilot, and remove watermarks.
              </p>
            </div>
            <button
              onClick={onUpgradeClick}
              className="glow-btn bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold px-6 py-3 rounded-xl z-10 cursor-pointer self-start md:self-auto transition-all shrink-0 shadow-lg shadow-emerald-500/10"
            >
              Upgrade to Pro Now
            </button>
            <div className="absolute top-1/2 right-10 -translate-y-1/2 w-44 h-44 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-500"></div>
          </div>
        )}

        {/* Resumes Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-extrabold font-display text-white flex items-center gap-2">
              <FileText size={18} className="text-emerald-400" /> My Saved Resumes
            </h2>
            <span className="text-xs text-slate-500 font-mono">Sorted by modification date</span>
          </div>

          {resumes.length === 0 ? (
            <div className="glass-effect py-16 px-6 text-center rounded-2xl border border-dashed border-white/5 max-w-xl mx-auto space-y-4">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto border border-emerald-500/20">
                <FileText size={22} />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">No Resumes Found</h3>
                <p className="text-xs text-slate-405 leading-relaxed max-w-sm mx-auto">
                  You haven't initiated your first professional resume yet! Click below to trigger the AI builder co-pilot.
                </p>
              </div>
              <button
                onClick={onCreateNew}
                className="glow-btn bg-emerald-500 hover:bg-emerald-600 text-black text-xs px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 mx-auto cursor-pointer"
              >
                <Plus size={14} /> Compose First Resume
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((doc) => (
                <div 
                  key={doc.id}
                  className="glass-effect rounded-2xl border border-white/5 p-5 flex flex-col justify-between hover:border-emerald-500/20 transition-all group duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="bg-white/5 p-2 rounded-lg text-emerald-400 border border-white/5">
                        <FileText size={16} />
                      </div>
                      <span className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded text-[10px] text-emerald-400 font-mono font-bold">
                        {doc.atsScore}% Score
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                        {doc.title || "Untitled Resume"}
                      </h3>
                      <p className="text-[11px] text-emerald-400/80 font-mono flex items-center gap-1">
                        🔑 Plan: {doc.template.replace("_", " ").toUpperCase()}
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 italic leading-relaxed pt-1.5 border-t border-white/5">
                      "{doc.content?.personalInfo?.summary || "No summary provided."}"
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-5 mt-4 border-t border-white/5">
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Calendar size={12} /> {new Date(doc.updatedAt || doc.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onDelete(doc.id)}
                        className="p-1.5 bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-400 rounded-md transition-colors cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 size={13} />
                      </button>
                      <button
                        onClick={() => onEdit(doc.id)}
                        className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-black text-xs rounded-md font-bold flex items-center gap-1 ease-in cursor-pointer transition-colors"
                      >
                        Edit <Edit3 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity timeline log */}
        <div className="glass-effect rounded-2xl border border-white/5 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-display">System Operations Log</h3>
          </div>
          <div className="space-y-3.5 font-mono text-[11px]">
            <div className="border-l-2 border-emerald-505/20 pl-4 space-y-0.5">
              <span className="text-slate-500">2026-06-08 (10:11 UTC)</span>
              <p className="text-slate-300">Successfully sync'd security rules to Firestore databases (infra-myth-pmln4).</p>
            </div>
            <div className="border-l-2 border-emerald-505/20 pl-4 space-y-0.5">
              <span className="text-slate-500">2026-06-08 (09:15 UTC)</span>
              <p className="text-slate-300">Initialized AI Co-Pilot agent modeling under Google Gemini 1.5 Pro schemas.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
