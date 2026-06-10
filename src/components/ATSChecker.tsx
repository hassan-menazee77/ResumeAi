import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ResumeDocument, ATSCheckResult, JobAnalysisResult } from "../types";
import { 
  Award, ArrowLeft, Shield, AlertTriangle, CheckCircle2, 
  BookOpen, RefreshCw, Sparkles, HelpCircle, FileText, ChevronRight
} from "lucide-react";

interface ATSCheckerProps {
  resumes: ResumeDocument[];
  onBack: () => void;
  onNavigateToTab: (tab: string) => void;
  userPlan: "free" | "pro";
  onUpgradeClick: () => void;
}

export const ATSChecker: React.FC<ATSCheckerProps> = ({ resumes, onBack, onNavigateToTab, userPlan, onUpgradeClick }) => {
  const [jobDescription, setJobDescription] = useState<string>("");
  const [resumeText, setResumeText] = useState<string>("");
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  
  // Scans outputs
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [atsResult, setAtsResult] = useState<ATSCheckResult | null>(null);
  const [jobResult, setJobResult] = useState<JobAnalysisResult | null>(null);

  // Helper load resume
  const handleLoadResume = (id: string) => {
    const doc = resumes.find(r => r.id === id);
    if (doc) {
      // Serialize a text representation for standard raw scanning
      const personal = doc.content.personalInfo;
      const skills = doc.content.skills.join(", ");
      const exp = doc.content.experience.map(e => `${e.position} at ${e.company}: ${e.description}`).join("\n");
      const edu = doc.content.education.map(ed => `${ed.degree} inside ${ed.fieldOfStudy} at ${ed.institution}`).join("\n");
      
      const fullRepr = `
        ${personal.fullName} - ${personal.headline}
        Summary: ${personal.summary}
        Skills: ${skills}
        Experience:
        ${exp}
        Education:
        ${edu}
      `;
      setResumeText(fullRepr.trim());
      setSelectedResumeId(id);
    }
  };

  const handleRunScanner = async () => {
    if (userPlan === "free") {
      alert("AI Job Description Analyzer & Keyword-level ATS Check are premium Pro features. Please upgrade to Pro to run infinite scans and lock in high callback rates!");
      onUpgradeClick();
      return;
    }
    if (!jobDescription || !resumeText) return;
    setIsScanning(true);
    setAtsResult(null);
    setJobResult(null);

    try {
      // 1. Run ATS rating comparison
      const atsRes = await fetch("/api/ats/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeContent: { text: resumeText },
          jobDescription,
        }),
      });
      const atsData = await atsRes.json();

      // 2. Run Job Description Analyzer
      const jobRes = await fetch("/api/job/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });
      const jobData = await jobRes.json();

      if (atsData.success && atsData.data) {
        setAtsResult(atsData.data);
      }
      if (jobData.success && jobData.data) {
        setJobResult(jobData.data);
      }
    } catch (error) {
      console.error("Scanning fails:", error);
    } finally {
      setIsScanning(false);
    }
  };

  // SVGCircle stroke computations
  const radius = 50;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = atsResult 
    ? circumference - (atsResult.score / 100) * circumference 
    : circumference;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Background Atmospheric Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-950/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Upper header */}
      <nav className="glass-effect py-4 px-6 md:px-10 flex justify-between items-center border-b border-white/5 backdrop-blur-md shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 border border-white/10 hover:border-white/20 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft size={15} />
          </button>
          <div className="text-left">
            <h1 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest leading-none font-display">Optimization Portal</h1>
            <p className="text-sm font-bold text-white mt-1">ATS Screener & Description Analyzer</p>
          </div>
        </div>

        <button 
          onClick={() => onNavigateToTab("dashboard")}
          className="text-xs font-mono text-emerald-400 font-bold tracking-wider hover:text-emerald-300 transition-colors uppercase cursor-pointer"
        >
          My Dashboard
        </button>
      </nav>

      <main className="flex-grow py-10 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 overflow-y-auto">
        
        {/* INPUT PANEL: Paste description + load resume */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-effect rounded-2xl border border-white/5 p-5 md:p-6 space-y-5">
            <div>
              <h2 className="text-base font-extrabold font-display text-white">Compare Artifacts</h2>
              <p className="text-xs text-slate-400 mt-1">Check keyword densities against automated Applicant Tracking Systems.</p>
            </div>

            {/* Quick Saved Resume Loader */}
            {resumes.length > 0 && (
              <div className="space-y-1.5 pt-3 border-t border-white/5">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Load Saved Document</label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => handleLoadResume(e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded-lg p-2.5 text-xs text-slate-300 outline-none"
                >
                  <option value="">-- Choose one of your saved resumes --</option>
                  {resumes.map(r => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Raw resume text copy paste */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase block">Resume Content (Raw text data)</label>
              <textarea
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your compiled resume text here, or select your document from the loader dropdown above..."
                className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/50 rounded-lg p-3 text-xs text-slate-200 outline-none resize-none font-mono"
              />
            </div>

            {/* Job posting description paste */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase block">Target Job Description posting</label>
              <textarea
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target corporate job opening, responsibilities and skills keywords listed on their portals..."
                className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/50 rounded-lg p-3 text-xs text-slate-200 outline-none resize-none font-mono"
              />
            </div>

            <button
              onClick={handleRunScanner}
              disabled={isScanning || !jobDescription || !resumeText}
              className="w-full glow-btn bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:opacity-50 text-black rounded-lg py-3.5 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isScanning ? (
                <>
                  <RefreshCw size={13} className="animate-spin text-black" /> Evaluating Densities...
                </>
              ) : (
                <>
                  <Sparkles size={13} /> Optimize ATS Score Match
                </>
              )}
            </button>
          </div>
        </div>

        {/* RESULTS PANEL: Visual statistics breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {!atsResult && !jobResult ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full glass-effect rounded-2xl border border-dashed border-white/5 p-12 flex flex-col justify-center items-center text-center space-y-4"
              >
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse">
                  <Shield size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">Launch Analysis Scan</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed mt-1">
                    Fill the compare artifacts blocks on the left, and click search. Gemini will verify scores, keyword ratios, and required credentials.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* 1. Score and Core Parameters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Circular ATS Gauge */}
                  {atsResult && (
                    <div className="glass-effect rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3">
                        <Award size={15} className="text-emerald-500 animate-pulse" />
                      </div>

                      <div className="relative h-28 w-28 flex items-center justify-center">
                        <svg className="h-full w-full transform -rotate-90">
                          <circle
                            stroke="rgba(255, 255, 255, 0.05)"
                            fill="transparent"
                            strokeWidth={stroke}
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                          />
                          <circle
                            stroke="#10b981"
                            fill="transparent"
                            strokeWidth={stroke}
                            strokeDasharray={circumference + " " + circumference}
                            style={{ strokeDashoffset }}
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-3xl font-black font-display text-white">{atsResult.score}</span>
                          <span className="text-[10px] uppercase text-slate-500 font-mono">Match Score</span>
                        </div>
                      </div>

                      <h3 className="text-xs font-bold text-white mt-4 font-display">
                        {atsResult.score >= 80 ? "🔥 Excellent Matching Ratio" : atsResult.score >= 60 ? "⚠️ Calibrations Recommended" : "🚨 Priority Recasts Needed"}
                      </h3>
                      <p className="text-[11px] text-slate-405 leading-relaxed mt-1 max-w-xs">
                        {atsResult.score >= 80 ? "Your profile contains rich credentials qualifying for automatic screener promotions!" : "You are currently missing crucial technical keys highlighted during scanning."}
                      </p>
                    </div>
                  )}

                  {/* Job extracted details */}
                  {jobResult && (
                    <div className="glass-effect rounded-2xl border border-white/5 p-6 space-y-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 block">Candidate Target</span>
                        <h3 className="text-base font-extrabold text-white font-display mt-0.5">Role Parameters</h3>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-white/5 text-xs">
                        <div className="flex justify-between items-baseline font-mono text-[11px]">
                          <span className="text-slate-500">Exp Threshold:</span>
                          <span className="text-slate-200 font-bold">{jobResult.experienceLevel || "Not detailed"}</span>
                        </div>
                        <div className="flex justify-between items-baseline font-mono text-[11px]">
                          <span className="text-slate-500">Screener Quality:</span>
                          <span className="text-emerald-400 font-bold">Standard Cloud ATS</span>
                        </div>
                        <div className="flex justify-between items-baseline font-mono text-[11px]">
                          <span className="text-slate-500">Relevance:</span>
                          <span className="text-slate-400">{atsResult && atsResult.score >= 70 ? "Ready to Submit" : "Refinement Advisable"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Color-Coded Keywords Matching Map */}
                {atsResult && (
                  <div className="glass-effect rounded-2xl border border-white/5 p-6 space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-white font-display">Keyword Matching Map</h3>
                      <p className="text-xs text-slate-400 mt-1">Visual catalog mapping parsed technical terms.</p>
                    </div>

                    <div className="space-y-4 pt-3 border-t border-white/5">
                      {/* Matched keywords in Green */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Matched terms ({atsResult.keywords.matched.length})</span>
                        <div className="flex flex-wrap gap-1.5">
                          {atsResult.keywords.matched.map((term, i) => (
                            <span key={i} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-1 text-xs rounded-lg font-mono">
                              ✓ {term}
                            </span>
                          ))}
                          {atsResult.keywords.matched.length === 0 && <span className="text-slate-500 font-mono text-xs">No matching keys recorded.</span>}
                        </div>
                      </div>

                      {/* Missing keywords in Crimson Red */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold">Missing Screener Keys ({atsResult.keywords.missing.length})</span>
                        <div className="flex flex-wrap gap-1.5">
                          {atsResult.keywords.missing.map((term, i) => (
                            <span key={i} className="bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-1 text-xs rounded-lg font-mono">
                              ⚡ {term}
                            </span>
                          ))}
                          {atsResult.keywords.missing.length === 0 && <span className="text-emerald-400 font-mono text-xs">Everything matching perfectly!</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Actionable Checklist Improvements */}
                {atsResult && (
                  <div className="glass-effect rounded-2xl border border-white/5 p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-emerald-400" />
                      <h3 className="text-sm font-bold text-white font-display">Actionable Correction Checklist</h3>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-white/5 text-xs text-slate-300">
                      {atsResult.suggestions.map((tip, i) => (
                        <div key={i} className="flex gap-2.5 items-start">
                          <span className="bg-emerald-500/10 p-1 rounded font-mono font-bold text-emerald-400 text-[10px] tracking-tight leading-none">0{i+1}</span>
                          <p className="leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
};
