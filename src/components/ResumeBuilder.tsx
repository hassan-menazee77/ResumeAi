import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ResumeContent, ResumeDocument, ChatMessage, TemplateType 
} from "../types";
import { ResumeSheet } from "./ResumeTemplates";
import { 
  Sparkles, Download, ArrowLeft, Plus, Trash2, CheckCircle2, 
  MessageSquare, Send, Cpu, Award, RefreshCw, ChevronLeft, 
  ChevronRight, Smile, Bookmark, Info, HelpCircle
} from "lucide-react";

interface ResumeBuilderProps {
  documentId: string | null;
  initialContent?: ResumeContent;
  initialTemplate?: string;
  onSave: (content: ResumeContent, template: string, score: number) => Promise<void>;
  onBack: () => void;
  userEmail?: string | null;
  userPlan: "free" | "pro";
  onUpgradeClick: () => void;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  documentId,
  initialContent,
  initialTemplate = "modern_minimal",
  onSave,
  onBack,
  userEmail,
  userPlan,
  onUpgradeClick,
}) => {
  // 1. Resume content state
  const [content, setContent] = useState<ResumeContent>(
    initialContent || {
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        headline: "",
        summary: "",
      },
      experience: [],
      education: [],
      skills: [],
    }
  );

  // 2. Control settings
  const [activeTemplate, setActiveTemplate] = useState<string>(initialTemplate);
  const [atsScore, setAtsScore] = useState<number>(45);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<{ text: string; type: "success" | "info" | "error" } | null>(null);

  // 3. AI Autogenerator Modal State
  const [showGeneratorModal, setShowGeneratorModal] = useState<boolean>(!initialContent);
  const [genTitle, setGenTitle] = useState<string>("");
  const [genExp, setGenExp] = useState<string>("3 years");
  const [genSkills, setGenSkills] = useState<string>("");
  const [genStyle, setGenStyle] = useState<string>("ATS-Optimized");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // 4. AI Chat Copilot Panel state
  const [chatOpen, setChatOpen] = useState<boolean>(true);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "wel-1",
      sender: "ai",
      text: "Hello! I am your ResumeAI Professional Co-Pilot. Tell me what to write, or instruct me to make target changes like 'make your Stripe experiences highlight customer growth scaling leads'!",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // 5. Skills Input Tracker
  const [skillInput, setSkillInput] = useState<string>("");

  // 6. LinkedIn Paste Auto-populate states
  const [linkedinPasteText, setLinkedinPasteText] = useState<string>("");
  const [isParsingLinkedin, setIsParsingLinkedin] = useState<boolean>(false);
  const [generatorMode, setGeneratorMode] = useState<"draft" | "linkedin">("draft");

  // Tab management (Personal vs Experience vs Education)
  const [formTab, setFormTab] = useState<"personal" | "experience" | "education" | "skills" | "copilot" | "linkedin">("personal");

  // Track ATS score changes dynamically
  useEffect(() => {
    // Dynamic mock assessment: rewards filled out elements
    let score = 20;
    if (content.personalInfo.fullName) score += 10;
    if (content.personalInfo.summary) score += 10;
    if (content.experience.length > 0) score += 20;
    if (content.experience.some(e => e.description.length > 100)) score += 10;
    if (content.education.length > 0) score += 15;
    if (content.skills.length > 3) score += 15;
    setAtsScore(Math.min(100, score));
  }, [content]);

  // Scroll to chat bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const triggerToast = (text: string, type: "success" | "info" | "error" = "success") => {
    setShowToast({ text, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  // Quick template trigger loader
  const handleTemplateSwap = (id: string) => {
    if (userPlan === "free" && (id === "executive_dark" || id === "creative_gradient")) {
      triggerToast("Executive Dark and Creative Gradient layouts are Premium designs. Upgrade to Pro to unlock!", "error");
      onUpgradeClick();
      return;
    }
    setActiveTemplate(id);
    triggerToast(`Template switched to ${id.replace("_", " ").toUpperCase()}`, "info");
  };

  const handleDownloadDOCX = () => {
    if (userPlan === "free") {
      triggerToast("Exporting to Microsoft Word (.docx) is a Pro feature. Please upgrade!", "error");
      onUpgradeClick();
      return;
    }

    const textContent = `
=========================================================
${content.personalInfo.fullName.toUpperCase()} - RESUME DOCUMENT
=========================================================
${content.personalInfo.headline || "Professional Headline"}

Contact Details:
---------------------------------------------------------
Phone:    ${content.personalInfo.phone || "N/A"}
Email:    ${content.personalInfo.email || "N/A"}
Location: ${content.personalInfo.location || "N/A"}
Website:  ${content.personalInfo.website || "N/A"}


PROFESSIONAL SUMMARY
---------------------------------------------------------
${content.personalInfo.summary || "No summary provided."}


WORK EXPERIENCE
---------------------------------------------------------
${content.experience.map(exp => `
Position:  ${exp.position}
Company:   ${exp.company}
Duration:  ${exp.startDate} - ${exp.current ? "Present" : exp.endDate}

Description:
${exp.description}
---------------------------------------------------------`).join("\n")}


EDUCATION BACKGROUND
---------------------------------------------------------
${content.education.map(edu => `
Degree:      ${edu.degree} in ${edu.fieldOfStudy}
Institution: ${edu.institution}
Duration:    ${edu.startDate} - ${edu.endDate}
${edu.description ? `Details:     ${edu.description}` : ""}
---------------------------------------------------------`).join("\n")}


TECHNICAL SKILLS SUMMARY
---------------------------------------------------------
${content.skills.join(", ") || "No skills logged yet."}

=========================================================
Generated via ResumeAI Core Platform.
`;

    const blob = new Blob([textContent], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${content.personalInfo.fullName.replace(/\s+/g, "_") || "Resume"}_Core_Profile.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast("Microsoft Word Document exported successfully!", "success");
  };

  // Save changes
  const handleSaveDocument = async () => {
    setIsSaving(true);
    try {
      await onSave(content, activeTemplate, atsScore);
      triggerToast("Resume saved successfully!", "success");
    } catch (err) {
      triggerToast("Save failed. Try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Native crisp vector printable trigger
  const handleDownloadPDF = () => {
    triggerToast("Initiating PDF Export. Ensure 'Background graphics' is enabled in Print setup.", "info");
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  // AI Autocomplete booter call
  const handleInitialGenerate = async () => {
    setIsGenerating(true);
    try {
      const skillsArr = genSkills.split(",").map(s => s.trim()).filter(s => s.length > 0);
      const res = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userEmail?.split("@")[0].toUpperCase() || "JANE CANDIDATE",
          currentTitle: genTitle,
          yearsOfExperience: genExp,
          skills: skillsArr,
          style: genStyle,
        }),
      });
      const payload = await res.json();
      if (payload.success && payload.data) {
        setContent(payload.data);
        setShowGeneratorModal(false);
        triggerToast("AI successfully created your target resume profile!", "success");
      } else {
        throw new Error(payload.error || "Generation error");
      }
    } catch (err: any) {
      triggerToast(err.message || "Failed. Fell back to standard mock profile.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleParseLinkedIn = async (textToParse?: string) => {
    const rawText = textToParse !== undefined ? textToParse : linkedinPasteText;
    if (!rawText || !rawText.trim()) {
      triggerToast("Please paste some raw LinkedIn profile text first.", "error");
      return;
    }
    setIsParsingLinkedin(true);
    try {
      const res = await fetch("/api/linkedin/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedinText: rawText }),
      });
      const payload = await res.json();
      if (payload.success && payload.data) {
        setContent(payload.data);
        setShowGeneratorModal(false);
        triggerToast("LinkedIn profile successfully parsed and populated!", "success");
      } else {
        throw new Error(payload.error || "Parsing error");
      }
    } catch (err: any) {
      triggerToast(err.message || "Failed to parse profile. Please verify your internet connection.", "error");
    } finally {
      setIsParsingLinkedin(false);
    }
  };

  // Interactive conversational editor call
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages(prev => [...prev, userMsg]);
    setIsChatting(true);
    const inputPrompt = chatInput;
    setChatInput("");

    try {
      const res = await fetch("/api/chat/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeContent: content,
          chatHistory: chatMessages,
          userPrompt: inputPrompt,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setContent(data.data);
        setChatMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: data.reply || "Done! I calibrated your resume metrics perfectly.",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        }]);
        triggerToast("AI refined your live resume data!", "success");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: "Apologies, I encountered a connection delay edit block. I recommend adding terms raw using form inputs!",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setIsChatting(false);
    }
  };

  // Skills handlers
  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!content.skills.includes(skillInput.trim())) {
        setContent(prev => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()],
        }));
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setContent(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove),
    }));
  };

  // Dynamic Array Handlers for Experience
  const handleAddExperience = () => {
    const newItem = {
      id: `exp-${Date.now()}`,
      company: "Acme Corporation",
      position: "Specialist Staff Lead",
      startDate: "2024-01",
      endDate: "Present",
      current: true,
      description: "Led development of core features boosting customer margins by 10%.\nDesigned secure cloud integrations.\nCollaborated directly with director groups.",
    };
    setContent(prev => ({
      ...prev,
      experience: [...prev.experience, newItem],
    }));
    triggerToast("Experience block added", "info");
  };

  const handleUpdateExperience = (id: string, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      experience: prev.experience.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      }),
    }));
  };

  const handleRemoveExperience = (id: string) => {
    setContent(prev => ({
      ...prev,
      experience: prev.experience.filter(item => item.id !== id),
    }));
    triggerToast("Experience block removed", "info");
  };

  // Dynamic Array Handlers for Education
  const handleAddEducation = () => {
    const newItem = {
      id: `edu-${Date.now()}`,
      institution: "State University",
      degree: "Master of Science",
      fieldOfStudy: "Analytical Sciences",
      startDate: "2020-09",
      endDate: "2022-06",
      current: false,
      description: "Graduated with Honors.",
    };
    setContent(prev => ({
      ...prev,
      education: [...prev.education, newItem],
    }));
    triggerToast("Education block added", "info");
  };

  const handleUpdateEducation = (id: string, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      education: prev.education.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      }),
    }));
  };

  const handleRemoveEducation = (id: string) => {
    setContent(prev => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id),
    }));
    triggerToast("Education block removed", "info");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Background Atmospheric Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-950/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Toast notifications */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl border text-xs z-50 font-mono flex items-center gap-2 ${
              showToast.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
              showToast.type === "error" ? "bg-red-500/10 border-red-500/30 text-red-400" :
              "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
            }`}
          >
            <CheckCircle2 size={13} className="animate-pulse" /> {showToast.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Creator navigation toolbar */}
      <nav className="glass-effect relative py-4 px-6 md:px-10 flex justify-between items-center border-b border-white/5 backdrop-blur-md whitespace-nowrap overflow-x-auto gap-4 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 border border-white/10 hover:border-white/20 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={15} />
          </button>
          <div className="text-left">
            <h1 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest leading-none">Interactive Lab</h1>
            <p className="text-sm font-bold text-white mt-1">Resume Co-pilot Editor</p>
          </div>
        </div>

        {/* Template Selectors Quick List */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-900 border border-white/5 p-1 rounded-xl">
          {[
            { id: "modern_minimal", label: "Minimal" },
            { id: "executive_dark", label: "Executive" },
            { id: "creative_gradient", label: "Creative" },
            { id: "ats_clean", label: "Strict ATS" },
            { id: "tech_pro", label: "Tech Pro" }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => handleTemplateSwap(t.id)}
              className={`text-[11px] font-mono px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTemplate === t.id ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGeneratorModal(true)}
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ml-auto"
            title="AI Quick Builder Mode"
          >
            <RefreshCw size={13} className="text-emerald-400" /> AI Auto-Fill
          </button>

          <button
            onClick={handleSaveDocument}
            disabled={isSaving}
            className="bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-xs px-4 py-2 rounded-lg font-mono font-bold cursor-pointer flex items-center gap-1.5 h-9"
          >
            {isSaving ? "Saving..." : "Save Code"}
          </button>

          <button
            onClick={handleDownloadPDF}
            className="glow-btn bg-emerald-500 hover:bg-emerald-600 text-black text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer h-9 shadow-lg shadow-emerald-500/10"
          >
            Download PDF <Download size={13} />
          </button>

          <button
            onClick={handleDownloadDOCX}
            className="bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer h-9 transition-all"
          >
            Export DOCX {userPlan === "free" && <span className="text-[8.5px] bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 px-1 py-0.2 rounded font-mono font-bold ml-1 animate-pulse">PRO</span>}
          </button>
        </div>
      </nav>

      {/* 2. Builder workspace layout */}
      <div className="flex-grow grid grid-cols-1 xl:grid-cols-12 overflow-hidden h-[calc(100vh-72px)]">
        
        {/* LEFT COLUMN: Input Panels (Forms / AI Chat) */}
        <section className="xl:col-span-5 border-r border-white/5 flex flex-col overflow-hidden bg-[#0c0c14]">
          
          {/* Sub menu selectors */}
          <div className="flex bg-slate-900/50 border-b border-white/5 p-1 shrink-0 overflow-x-auto">
            {[
              { id: "personal", label: "Personal" },
              { id: "experience", label: "Experience" },
              { id: "education", label: "Education" },
              { id: "skills", label: "Skills" },
              { id: "copilot", label: "🤖 AI Assistant" },
              { id: "linkedin", label: "🔗 LinkedIn Import" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFormTab(tab.id as any)}
                className={`text-xs font-mono font-bold px-4 py-2.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  formTab === tab.id ? "bg-emerald-500/10 border-b border-emerald-500 text-emerald-400" : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Scroll Container */}
          <div className="flex-grow overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* PERSONAL DATA FORM */}
            {formTab === "personal" && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="space-y-4"
              >
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">PersonalInfo</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Define your core identifiers and professional headline.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Full Name</label>
                    <input 
                      type="text"
                      value={content.personalInfo.fullName}
                      onChange={(e) => setContent({
                        ...content,
                        personalInfo: { ...content.personalInfo, fullName: e.target.value }
                      })}
                      className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/50 rounded-lg p-3 text-xs text-white outline-none"
                      placeholder="e.g. Jane Candidate"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Target Headline</label>
                    <input 
                      type="text"
                      value={content.personalInfo.headline}
                      onChange={(e) => setContent({
                        ...content,
                        personalInfo: { ...content.personalInfo, headline: e.target.value }
                      })}
                      className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/50 rounded-lg p-3 text-xs text-white outline-none"
                      placeholder="e.g. Senior Cloud Engineer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Contact Email</label>
                    <input 
                      type="email"
                      value={content.personalInfo.email}
                      onChange={(e) => setContent({
                        ...content,
                        personalInfo: { ...content.personalInfo, email: e.target.value }
                      })}
                      className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/50 rounded-lg p-3 text-xs text-white outline-none"
                      placeholder="e.g. jane@sample.dev"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Contact Phone</label>
                    <input 
                      type="text"
                      value={content.personalInfo.phone}
                      onChange={(e) => setContent({
                        ...content,
                        personalInfo: { ...content.personalInfo, phone: e.target.value }
                      })}
                      className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/50 rounded-lg p-3 text-xs text-white outline-none"
                      placeholder="e.g. +1 (555) 012-3456"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Location</label>
                    <input 
                      type="text"
                      value={content.personalInfo.location}
                      onChange={(e) => setContent({
                        ...content,
                        personalInfo: { ...content.personalInfo, location: e.target.value }
                      })}
                      className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/50 rounded-lg p-3 text-xs text-white outline-none"
                      placeholder="e.g. Remote / Chicago, IL"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Website URL</label>
                    <input 
                      type="text"
                      value={content.personalInfo.website || ""}
                      onChange={(e) => setContent({
                        ...content,
                        personalInfo: { ...content.personalInfo, website: e.target.value }
                      })}
                      className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/50 rounded-lg p-3 text-xs text-white outline-none"
                      placeholder="e.g. https://sample.dev"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Professional Summary</label>
                  <textarea 
                    rows={4}
                    value={content.personalInfo.summary}
                    onChange={(e) => setContent({
                      ...content,
                      personalInfo: { ...content.personalInfo, summary: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/50 rounded-lg p-3 text-xs text-white outline-none resize-none"
                    placeholder="Provide a cohesive description emphasizing technical size accomplishments and corporate scaling benchmarks..."
                  />
                </div>
              </motion.div>
            )}

            {/* WORK EXPERIENCE ARRAY FORM */}
            {formTab === "experience" && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="space-y-4"
              >
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">ExperienceLog</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Chronologically log your professional history.</p>
                  </div>
                  <button
                    onClick={handleAddExperience}
                    className="bg-emerald-500 hover:bg-emerald-600 text-black p-1.5 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <div className="space-y-4">
                  {content.experience.map((exp, idx) => (
                    <div 
                      key={exp.id}
                      className="bg-slate-900/50 border border-white/5 p-4 rounded-xl space-y-3 relative"
                    >
                      <button
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>

                      <div className="border-b border-white/5 pb-1.5">
                        <span className="text-[10px] bg-white/5 border border-white/5 px-2.5 py-1 rounded text-slate-400 font-mono">
                          EXPERIENCE BLOCK #{idx + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-500 uppercase">Company Name</label>
                          <input 
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 rounded p-2 text-xs text-white outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-500 uppercase">Job Position</label>
                          <input 
                            type="text"
                            value={exp.position}
                            onChange={(e) => handleUpdateExperience(exp.id, "position", e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 rounded p-2 text-xs text-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-500 uppercase">Start Date</label>
                          <input 
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => handleUpdateExperience(exp.id, "startDate", e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 rounded p-2 text-xs text-white outline-none"
                            placeholder="YYYY-MM"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-500 uppercase">End Date</label>
                          <input 
                            type="text"
                            value={exp.endDate}
                            disabled={exp.current}
                            onChange={(e) => handleUpdateExperience(exp.id, "endDate", e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 rounded p-2 text-xs text-white outline-none disabled:opacity-50"
                            placeholder="YYYY-MM (or Present)"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => handleUpdateExperience(exp.id, "current", e.target.checked)}
                          className="accent-emerald-500 scale-105"
                          id={`curr-${exp.id}`}
                        />
                        <label htmlFor={`curr-${exp.id}`} className="text-[10px] font-mono text-slate-400 uppercase">I currently work inside this role</label>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-500 uppercase flex justify-between">
                          <span>Description Bullet points</span>
                          <span className="text-emerald-400 font-bold lowercase text-[8px]">Separated by newlines</span>
                        </label>
                        <textarea 
                          rows={4}
                          value={exp.description}
                          onChange={(e) => handleUpdateExperience(exp.id, "description", e.target.value)}
                          className="w-full bg-slate-900 border border-white/5 rounded p-2 text-xs text-slate-300 outline-none resize-none font-mono"
                          placeholder="Bullet item 1&#10;Bullet item 2&#10;Bullet item 3"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* EDUCATION ARRAY FORM */}
            {formTab === "education" && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="space-y-4"
              >
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">EducationLog</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Log historical academic degrees and bootcamps.</p>
                  </div>
                  <button
                    onClick={handleAddEducation}
                    className="bg-emerald-505 hover:bg-emerald-600 text-black bg-emerald-500 p-1.5 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <div className="space-y-4">
                  {content.education.map((edu, idx) => (
                    <div 
                      key={edu.id}
                      className="bg-slate-900/50 border border-white/5 p-4 rounded-xl space-y-3 relative"
                    >
                      <button
                        onClick={() => handleRemoveEducation(edu.id)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>

                      <div className="border-b border-white/5 pb-1.5">
                        <span className="text-[10px] bg-white/5 border border-white/5 px-2.5 py-1 rounded text-slate-400 font-mono">
                          ACADEMIC BLOCK #{idx + 1}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-500 uppercase">Institution Name</label>
                        <input 
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleUpdateEducation(edu.id, "institution", e.target.value)}
                          className="w-full bg-slate-900 border border-white/5 rounded p-2 text-xs text-white outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-500 uppercase">Degree Type</label>
                          <input 
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleUpdateEducation(edu.id, "degree", e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 rounded p-2 text-xs text-white outline-none"
                            placeholder="e.g. Master of Science"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-500 uppercase">Field of Study</label>
                          <input 
                            type="text"
                            value={edu.fieldOfStudy}
                            onChange={(e) => handleUpdateEducation(edu.id, "fieldOfStudy", e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 rounded p-2 text-xs text-white outline-none"
                            placeholder="e.g. Computer Engineering"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-500 uppercase">Start Date</label>
                          <input 
                            type="text"
                            value={edu.startDate}
                            onChange={(e) => handleUpdateEducation(edu.id, "startDate", e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 rounded p-2 text-xs text-white outline-none"
                            placeholder="YYYY-MM"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-500 uppercase">End Date</label>
                          <input 
                            type="text"
                            value={edu.endDate}
                            onChange={(e) => handleUpdateEducation(edu.id, "endDate", e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 rounded p-2 text-xs text-white outline-none"
                            placeholder="YYYY-MM"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SKILLS CHIPS FORM */}
            {formTab === "skills" && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="space-y-4"
              >
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">SkillsChips</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Type keyword and hit Enter to serialize competency tags.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Add Skill Accent</label>
                  <input 
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="e.g. Serverless Node (Hit Enter)"
                    className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/50 rounded-lg p-3 text-xs text-white outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {content.skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="bg-slate-900 border border-white/5 text-xs text-slate-200 px-3 py-1 rounded-lg flex items-center gap-1.5 font-mono"
                    >
                      {skill}
                      <button 
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-500 hover:text-red-400 transition-colors font-bold cursor-pointer font-sans"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AI ASSISTANT CHAT PANEL */}
            {formTab === "copilot" && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="flex flex-col h-[calc(100vh-210px)] relative"
              >
                <div className="border-b border-white/5 pb-2 shrink-0">
                  <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">AI Co-pilot Console</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Instruct corrections. Changes apply directly to your document.</p>
                </div>

                {/* Messages feed */}
                <div className="flex-grow overflow-y-auto space-y-4 my-4 pr-1">
                  {chatMessages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
                    >
                      <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                        msg.sender === "user" ? "bg-emerald-500 text-black font-medium" : "bg-white/5 text-slate-200 border border-white/5 whitespace-pre-line"
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono mt-1">{msg.timestamp}</span>
                    </div>
                  ))}
                  {isChatting && (
                    <div className="bg-white/5 text-slate-400 border border-white/5 p-3 rounded-xl text-xs max-w-[80%] flex items-center gap-2 animate-pulse font-mono">
                      <Cpu size={12} className="animate-spin text-emerald-400" /> Co-Pilot is refining resume model...
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Footer Input Bar */}
                <div className="flex items-center gap-2 shrink-0 border-t border-white/5 pt-3">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                    disabled={isChatting}
                    placeholder="e.g. rewrite my summaries to be confident..."
                    className="flex-grow bg-slate-900 border border-white/5 focus:border-emerald-500/50 rounded-lg p-2.5 text-xs text-white outline-none disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendChat}
                    disabled={isChatting}
                    className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {formTab === "linkedin" && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="space-y-5"
              >
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles size={14} className="text-emerald-400" /> LinkedIn Profile Parser
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Paste raw text from your LinkedIn profile. Gemini will extract and auto-populate your Experience, Skills, and Summary instantly!
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Raw Profile Text</label>
                  <textarea 
                    rows={12}
                    value={linkedinPasteText}
                    onChange={(e) => setLinkedinPasteText(e.target.value)}
                    className="w-full bg-slate-900 border border-white/5 focus:border-emerald-500/50 rounded-xl p-4 text-xs text-white outline-none resize-none placeholder-slate-600 font-mono"
                    placeholder="Example:
Sarah Jenkins
Senior Frontend Engineer | Vercel

About:
Experienced engineer specialized in rich dashboard systems...

Experience:
Senior Software Engineer
Stripe · Full-time
Jan 2023 - Present
- Built and scaled premium client-side payment dashboards..."
                  />
                </div>

                <button
                  onClick={() => handleParseLinkedIn()}
                  disabled={isParsingLinkedin || !linkedinPasteText.trim()}
                  className="w-full glow-btn bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:opacity-55 text-black py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  {isParsingLinkedin ? (
                    <>
                      <RefreshCw size={13} className="animate-spin text-black" /> Parsing and Auto-Populating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} /> Parse & Populate Resume
                    </>
                  )}
                </button>

                <div className="bg-slate-900/40 border border-white/5 p-4 rounded-xl space-y-2 text-xs text-slate-400 leading-relaxed">
                  <p className="font-bold text-white text-[10px] uppercase font-mono tracking-wider">💡 Pro Tip:</p>
                  <p>You can go to your LinkedIn Profile, click <strong>"More"</strong> &gt; <strong>"Build a resume"</strong> &gt; <strong>"Create from profile"</strong> and download or copy-paste the sections here for premium results!</p>
                </div>
              </motion.div>
            )}

          </div>
        </section>

        {/* RIGHT COLUMN: Real-Time Live Preview Paper */}
        <section className="xl:col-span-7 bg-[#08080c] flex flex-col overflow-hidden relative">
          
          {/* Sizing, statistics, status bar */}
          <div className="bg-slate-900/40 border-b border-white/5 px-6 py-3 flex gap-4 justify-between items-center shrink-0 overflow-x-auto whitespace-nowrap">
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5"><Info size={12} className="text-emerald-400" /> Vector mode</span>
              <span className="hidden sm:inline">A4 Standard Sheet (210×297mm)</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  ATS score: {atsScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Paper Canvas Scroll */}
          <div className="flex-grow overflow-y-auto p-6 sm:p-10 flex justify-center bg-slate-950/60">
            <div 
              id="resume-sheet-printable"
              className="w-full max-w-[210mm] shadow-2xl rounded-sm overflow-hidden h-fit transition-all duration-300 transform origin-top hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <ResumeSheet content={content} templateId={activeTemplate} userPlan={userPlan} />
            </div>
          </div>
        </section>

      </div>

      {/* 4. AI BOOTER AUTOFILL MODAL OVERLAY */}
      {showGeneratorModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-effect rounded-2xl border border-white/10 p-6 md:p-8 max-w-lg w-full relative space-y-6"
          >
            {/* Close modal if initial content is already set */}
            {initialContent && (
              <button 
                onClick={() => setShowGeneratorModal(false)}
                className="absolute right-4 top-4 text-slate-500 hover:text-white cursor-pointer font-bold text-sm"
              >
                ×
              </button>
            )}

            <div className="text-center space-y-2">
              <div className="h-12 w-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl animate-pulse">
                <Sparkles />
              </div>
              <h2 className="text-xl font-extrabold font-display text-white">AI Resume Builder</h2>
              <p className="text-xs text-slate-400">Bootstrap your professional layout with instant AI assistance!</p>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-white/5 pb-1">
              <button
                type="button"
                onClick={() => setGeneratorMode("draft")}
                className={`flex-1 text-center py-2 text-xs font-bold font-mono transition-all cursor-pointer ${
                  generatorMode === "draft" ? "border-b-2 border-emerald-500 text-emerald-400" : "text-slate-400"
                }`}
              >
                Draft Speculative
              </button>
              <button
                type="button"
                onClick={() => setGeneratorMode("linkedin")}
                className={`flex-1 text-center py-2 text-xs font-bold font-mono transition-all cursor-pointer ${
                  generatorMode === "linkedin" ? "border-b-2 border-emerald-500 text-emerald-400" : "text-slate-400"
                }`}
              >
                🔗 Paste LinkedIn
              </button>
            </div>

            {generatorMode === "draft" ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Target Job Position</label>
                  <input 
                    type="text"
                    value={genTitle}
                    onChange={(e) => setGenTitle(e.target.value)}
                    placeholder="e.g. Lead Devops Architect / Principal UX Designer"
                    className="w-full bg-slate-950 border border-white/5 rounded-lg p-3 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Experience Level</label>
                    <input 
                      type="text"
                      value={genExp}
                      onChange={(e) => setGenExp(e.target.value)}
                      placeholder="e.g. 5 Years / 10+ Years"
                      className="w-full bg-slate-950 border border-white/5 rounded-lg p-3 text-xs text-white outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Copywriting Style</label>
                    <select
                      value={genStyle}
                      onChange={(e) => setGenStyle(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-lg p-3 text-xs text-slate-300 outline-none focus:border-emerald-500/50"
                    >
                      <option value="ATS-Optimized">ATS-Optimized Style</option>
                      <option value="Executive">Executive Narrative</option>
                      <option value="Modern">Modern Minimalist</option>
                      <option value="Creative">Creative Gradient</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Technical Skills Highlights</label>
                  <input 
                    type="text"
                    value={genSkills}
                    onChange={(e) => setGenSkills(e.target.value)}
                    placeholder="e.g. AWS, Kubernetes, Terraform, Go, CI/CD"
                    className="w-full bg-slate-950 border border-white/5 rounded-lg p-3 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Pasted LinkedIn raw text profile</label>
                  <p className="text-[10px] text-slate-500">Paste your About summary, Skills list, and Experience logs below.</p>
                  <textarea 
                    rows={8}
                    value={linkedinPasteText}
                    onChange={(e) => setLinkedinPasteText(e.target.value)}
                    placeholder="Enter raw text here..."
                    className="w-full bg-slate-950 border border-white/5 focus:border-emerald-500/50 rounded-lg p-3 text-xs text-white outline-none resize-none font-mono"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {initialContent && (
                <button
                  type="button"
                  onClick={() => setShowGeneratorModal(false)}
                  className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl py-3 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              )}
              {generatorMode === "draft" ? (
                <button
                  type="button"
                  onClick={handleInitialGenerate}
                  disabled={isGenerating || !genTitle}
                  className="flex-[2] glow-btn bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:opacity-50 text-black rounded-xl py-3 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={13} className="animate-spin text-black" /> Generating Dream Resume...
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} /> Draft Professional Resume
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleParseLinkedIn()}
                  disabled={isParsingLinkedin || !linkedinPasteText.trim()}
                  className="flex-[2] glow-btn bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:opacity-50 text-black rounded-xl py-3 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isParsingLinkedin ? (
                    <>
                      <RefreshCw size={13} className="animate-spin text-black" /> Parsing and populating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} /> Parse & Populate Resume
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
