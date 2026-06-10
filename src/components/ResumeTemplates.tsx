import React from "react";
import { ResumeContent, TemplateType } from "../types";
import { Mail, Phone, MapPin, Globe, Award, Briefcase, GraduationCap, Code } from "lucide-react";

interface ResumeSheetProps {
  content: ResumeContent;
  templateId: string;
  userPlan?: "free" | "pro";
}

export const ResumeSheet: React.FC<ResumeSheetProps> = ({ content, templateId, userPlan = "free" }) => {
  const { personalInfo, experience = [], education = [], skills = [] } = content;

  // Safe bullet point parser
  const renderBullets = (desc: string) => {
    if (!desc) return null;
    const bullets = desc.split("\n").filter(b => b.trim().length > 0);
    return (
      <ul className="list-disc pl-5 mt-1.5 space-y-1">
        {bullets.map((bullet, idx) => (
          <li key={idx} className="text-inherit leading-relaxed opacity-95">
            {bullet.replace(/^-\s*/, "")}
          </li>
        ))}
      </ul>
    );
  };

  // 1. Template: Modern Minimalist
  if (templateId === "modern_minimal") {
    return (
      <div className="bg-white text-gray-900 p-8 sm:p-12 shadow-inner font-sans min-h-[1050px]">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-4xl font-bold font-display tracking-tight text-gray-900 uppercase">
            {personalInfo.fullName || "Your Full Name"}
          </h1>
          <p className="text-emerald-600 font-semibold tracking-wider text-sm mt-1 uppercase">
            {personalInfo.headline || "Professional Headline"}
          </p>
          <p className="text-gray-600 text-xs mt-3 max-w-2xl leading-relaxed">
            {personalInfo.summary || "Add a sharp professional summary profiling your talent."}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs text-gray-500 font-mono">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail size={12} className="text-emerald-500" /> {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone size={12} className="text-emerald-500" /> {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-emerald-500" /> {personalInfo.location}
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-1">
                <Globe size={12} className="text-emerald-500" /> {personalInfo.website}
              </span>
            )}
          </div>
        </div>

        {/* Work Experience */}
        {experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-mono font-bold tracking-widest text-emerald-600 border-b border-gray-100 pb-1 mb-4 uppercase">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{exp.position}</h3>
                      <span className="text-xs font-medium text-emerald-700">{exp.company}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono mt-1 sm:mt-0">
                      {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    {renderBullets(exp.description)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-mono font-bold tracking-widest text-emerald-600 border-b border-gray-100 pb-1 mb-4 uppercase">
              Education Background
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{edu.degree} inside {edu.fieldOfStudy}</h3>
                    <span className="text-xs font-medium text-gray-600">{edu.institution}</span>
                    {edu.description && <p className="text-xs text-gray-500 mt-1 max-w-xl">{edu.description}</p>}
                  </div>
                  <span className="text-xs text-gray-500 font-mono mt-1 sm:mt-0">
                    {edu.startDate} — {edu.current ? "Present" : edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-mono font-bold tracking-widest text-emerald-600 border-b border-gray-100 pb-1 mb-4 uppercase">
              Technical Capabilities
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-700 px-2.5 py-1 text-xs rounded font-mono border border-gray-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Printable Watermark banner for Free Tier */}
        {userPlan === "free" && (
          <div className="mt-8 border-t border-dashed border-gray-200 pt-4 flex justify-between items-center text-[9px] text-gray-400 font-mono tracking-widest uppercase pointer-events-none">
            <span>RESUMEAI FREE VERSION</span>
            <span>UPGRADE TO PRO TO REMOVE WATERMARK</span>
          </div>
        )}
      </div>
    );
  }

  // 2. Template: Executive Dark (Centered Elegant Header with Gold/Dark Highlights)
  if (templateId === "executive_dark") {
    return (
      <div className="bg-slate-950 text-slate-100 p-8 sm:p-12 shadow-inner font-sans min-h-[1050px]">
        {/* Header */}
        <div className="text-center pb-8 border-b-2 border-emerald-500 mb-8">
          <h1 className="text-4xl font-extrabold font-display tracking-tight text-white uppercase">
            {personalInfo.fullName || "Your Full Name"}
          </h1>
          <p className="text-emerald-400 font-medium tracking-widest text-xs mt-2 uppercase">
            {personalInfo.headline || "Executive Director"}
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-4 text-xs text-slate-400 font-mono">
            {personalInfo.email && <span className="flex items-center gap-1"><Mail size={12} className="text-emerald-400" /> {personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center gap-1"><Phone size={12} className="text-emerald-400" /> {personalInfo.phone}</span>}
            {personalInfo.location && <span className="flex items-center gap-1"><MapPin size={12} className="text-emerald-400" /> {personalInfo.location}</span>}
            {personalInfo.website && <span className="flex items-center gap-1"><Globe size={12} className="text-emerald-400" /> {personalInfo.website}</span>}
          </div>
          <p className="text-slate-300 text-xs mt-5 max-w-3xl mx-auto leading-relaxed border-t border-slate-800 pt-4 italic">
            "{personalInfo.summary || "High performing leader equipped to build and scale."}"
          </p>
        </div>

        {/* Content columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Experience */}
            {experience.length > 0 && (
              <div>
                <h2 className="text-xs uppercase font-mono text-emerald-400 tracking-widest font-bold flex items-center gap-2 mb-4 border-b border-slate-800 pb-1">
                  <Briefcase size={14} /> Professional Milestones
                </h2>
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id} className="relative pl-4 border-l-2 border-slate-800 hover:border-emerald-500 transition-colors">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-xs font-mono text-slate-400">{exp.startDate} — {exp.current ? "Present" : exp.endDate}</h3>
                      </div>
                      <h4 className="text-sm font-bold text-white">{exp.position}</h4>
                      <p className="text-xs font-semibold text-emerald-400">{exp.company}</p>
                      <div className="text-xs text-slate-300 mt-2">
                        {renderBullets(exp.description)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h2 className="text-xs uppercase font-mono text-emerald-400 tracking-widest font-bold flex items-center gap-2 mb-4 border-b border-slate-800 pb-1">
                  <Code size={14} /> Expertise
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-200 px-2 py-0.5 text-xs rounded font-mono">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h2 className="text-xs uppercase font-mono text-emerald-400 tracking-widest font-bold flex items-center gap-2 mb-4 border-b border-slate-800 pb-1">
                  <GraduationCap size={14} /> Credentials
                </h2>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="bg-slate-900/50 p-3 rounded border border-slate-900">
                      <h4 className="text-xs text-emerald-400 font-mono">{edu.startDate} — {edu.current ? "Present" : edu.endDate}</h4>
                      <h3 className="text-xs font-bold text-white mt-1">{edu.degree}</h3>
                      <p className="text-xs text-slate-300">{edu.fieldOfStudy}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Printable Watermark banner for Free Tier */}
        {userPlan === "free" && (
          <div className="mt-8 border-t border-dashed border-slate-800 pt-4 flex justify-between items-center text-[9px] text-slate-500 font-mono tracking-widest uppercase pointer-events-none">
            <span>RESUMEAI FREE VERSION</span>
            <span>UPGRADE TO PRO TO REMOVE WATERMARK</span>
          </div>
        )}
      </div>
    );
  }

  // 3. Template: Creative Gradient
  if (templateId === "creative_gradient") {
    return (
      <div className="bg-white text-gray-800 shadow-inner font-sans min-h-[1050px] relative overflow-hidden">
        {/* Top vibrant gradient banner */}
        <div className="h-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 creative-gradient-bg w-full"></div>
        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-8 mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-700 creative-gradient-bg">
                {personalInfo.fullName || "Your Full Name"}
              </h1>
              <p className="text-gray-500 font-medium tracking-wide text-sm">
                {personalInfo.headline || "Creative Specialist"}
              </p>
              <p className="text-xs text-gray-600 max-w-xl leading-relaxed mt-2 pt-2 border-t border-gray-100">
                {personalInfo.summary || "Express your creative energy and technical insights."}
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/5 to-indigo-500/5 p-4 rounded-xl border border-emerald-500/10 space-y-2 text-xs font-mono w-full md:w-auto text-gray-600">
              {personalInfo.email && <div className="flex items-center gap-2"><Mail size={12} className="text-emerald-500" /> {personalInfo.email}</div>}
              {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={12} className="text-emerald-500" /> {personalInfo.phone}</div>}
              {personalInfo.location && <div className="flex items-center gap-2"><MapPin size={12} className="text-emerald-500" /> {personalInfo.location}</div>}
              {personalInfo.website && <div className="flex items-center gap-2"><Globe size={12} className="text-emerald-500" /> {personalInfo.website}</div>}
            </div>
          </div>

          {/* Grid Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar Column */}
            <div className="space-y-6">
              {/* Skills */}
              {skills.length > 0 && (
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <h3 className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-widest mb-3">
                    Talent Spectrum
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.map((skill, idx) => (
                      <span key={idx} className="bg-white text-slate-700 text-xs px-2 py-1 rounded-md shadow-sm border border-slate-100 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <h3 className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-widest mb-3">
                    Academics
                  </h3>
                  <div className="space-y-4">
                    {education.map((edu) => (
                      <div key={edu.id}>
                        <h4 className="text-xs font-bold text-gray-900">{edu.degree}</h4>
                        <p className="text-xs text-gray-600">{edu.fieldOfStudy}</p>
                        <p className="text-[11px] text-emerald-600 font-semibold">{edu.institution}</p>
                        <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">{edu.startDate} — {edu.endDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Column */}
            <div className="md:col-span-2 space-y-6">
              {experience.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 border-b-2 border-indigo-200 pb-1 mb-4 flex items-center gap-2">
                    <span className="h-4 w-1 bg-indigo-600 rounded"></span> Professional Work
                  </h2>
                  <div className="space-y-6">
                    {experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-sm font-bold text-gray-900">{exp.position}</h3>
                          <span className="text-xs text-gray-400 font-mono">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                        </div>
                        <p className="text-xs text-indigo-600 font-semibold">{exp.company}</p>
                        <div className="text-xs text-gray-600 mt-2">
                          {renderBullets(exp.description)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Printable Watermark banner for Free Tier */}
        {userPlan === "free" && (
          <div className="mt-8 border-t border-dashed border-gray-200 pt-4 flex justify-between items-center text-[9px] text-gray-400 font-mono tracking-widest uppercase pointer-events-none">
            <span>RESUMEAI FREE VERSION</span>
            <span>UPGRADE TO PRO TO REMOVE WATERMARK</span>
          </div>
        )}
      </div>
    );
  }

  // 4. Template: ATS Friendly Clean
  if (templateId === "ats_clean") {
    return (
      <div className="bg-white text-gray-950 p-8 sm:p-12 shadow-inner font-mono text-xs min-h-[1050px]">
        {/* Strictly Standard Format, Single Column, No Visual clutter */}
        <div className="text-center border-b border-gray-300 pb-4 mb-5">
          <h1 className="text-3xl font-bold uppercase text-gray-950 tracking-tight">
            {personalInfo.fullName || "Your Full Name"}
          </h1>
          <p className="font-semibold text-gray-800 mt-1 uppercase">
            {personalInfo.headline || "Software Architect"}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-2 text-gray-700">
            {personalInfo.email && <span>Email: {personalInfo.email}</span>}
            {personalInfo.phone && <span>| Phone: {personalInfo.phone}</span>}
            {personalInfo.location && <span>| Location: {personalInfo.location}</span>}
            {personalInfo.website && <span>| Link: {personalInfo.website}</span>}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-5">
          <h2 className="text-xs font-bold border-b border-gray-400 pb-0.5 mb-2 uppercase">
            Professional Summary
          </h2>
          <p className="text-gray-800 leading-relaxed font-sans text-xs">
            {personalInfo.summary || "A critical keywords summary ready to pass ATS checkers."}
          </p>
        </div>

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-5 row-gap-2">
            <h2 className="text-xs font-bold border-b border-gray-400 pb-0.5 mb-2 uppercase">
              Employment History
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>{exp.position} — {exp.company}</span>
                    <span>{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                  </div>
                  <div className="text-gray-800 mt-1 font-sans text-xs">
                    {renderBullets(exp.description)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {skills.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-bold border-b border-gray-400 pb-0.5 mb-2 uppercase">
              Core Skills & Tools
            </h2>
            <p className="text-gray-800 font-medium">
              {skills.join(" | ")}
            </p>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold border-b border-gray-400 pb-0.5 mb-2 uppercase">
              Academic Background
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between text-gray-800">
                  <span>
                    <strong>{edu.degree} inside {edu.fieldOfStudy}</strong> — {edu.institution}
                  </span>
                  <span>{edu.startDate} - {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 5. Template: Tech Professional (Asymmetric Layout, Bold Sidebar Highlights)
  return (
    <div className="bg-white text-slate-800 shadow-inner font-sans min-h-[1050px] flex flex-col md:flex-row">
      {/* Left Sidebar Accent Column */}
      <div className="md:w-1/3 bg-slate-900 text-slate-200 p-8 sm:p-10 flex flex-col justify-between">
        <div className="space-y-8">
          {/* Persona */}
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase font-display leading-[1.1]">
              {personalInfo.fullName || "Your Full Name"}
            </h1>
            <p className="text-emerald-400 text-xs font-semibold tracking-wider font-mono uppercase">
              {personalInfo.headline || "Lead Analyst"}
            </p>
          </div>

          {/* Contacts */}
          <div className="space-y-3 pt-6 border-t border-slate-800 text-xs font-mono text-slate-400">
            {personalInfo.email && <div className="truncate"><Mail size={12} className="inline mr-2 text-emerald-400" /> {personalInfo.email}</div>}
            {personalInfo.phone && <div><Phone size={12} className="inline mr-2 text-emerald-400" /> {personalInfo.phone}</div>}
            {personalInfo.location && <div><MapPin size={12} className="inline mr-2 text-emerald-400" /> {personalInfo.location}</div>}
            {personalInfo.website && <div className="truncate"><Globe size={12} className="inline mr-2 text-emerald-400" /> {personalInfo.website}</div>}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="pt-6 border-t border-slate-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 mb-3">
                Core Competencies
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span key={idx} className="bg-slate-800 text-slate-100 text-[10px] px-2 py-0.5 rounded border border-slate-700 font-mono">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footnote */}
        <div className="text-[10px] text-slate-500 pt-8 mt-8 border-t border-slate-800 font-mono">
          Created via ResumeAI | Standard Version
        </div>
      </div>

      {/* Right Column (Focuses strictly on experience) */}
      <div className="md:w-2/3 p-8 sm:p-12 space-y-8 bg-slate-50">
        {/* Executive summary */}
        <div>
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
            Overview
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
            {personalInfo.summary || "A brief career outline with high impact value metrics."}
          </p>
        </div>

        {/* Experience Timeline */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 border-b border-slate-200 pb-1 mb-4 uppercase">
              Employment History
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-slate-900">{exp.position}</h3>
                    <span className="text-[11px] text-slate-500 font-mono font-bold">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                  </div>
                  <h4 className="text-xs text-emerald-600 font-semibold">{exp.company}</h4>
                  <div className="text-xs text-slate-600 mt-2 font-sans">
                    {renderBullets(exp.description)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 border-b border-slate-200 pb-1 mb-4 uppercase">
              Credentials
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</h3>
                    <p className="text-xs text-slate-500">{edu.institution}</p>
                    {edu.description && <p className="text-[11px] text-slate-400 mt-0.5">{edu.description}</p>}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{edu.startDate} — {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Printable Watermark banner for Free Tier */}
        {userPlan === "free" && (
          <div className="mt-8 border-t border-dashed border-slate-300 pt-3 flex justify-between items-center text-[8px] text-slate-400 font-mono tracking-wider uppercase pointer-events-none">
            <span>RESUMEAI SYSTEM FREE PREVIEW</span>
            <span>UPGRADE TO PRO TO REMOVE WATERMARK</span>
          </div>
        )}
      </div>
    </div>
  );
};


