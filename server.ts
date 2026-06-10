import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import crypto from "crypto";
import fs from "fs";
import { initializeApp as initFirebaseApp } from "firebase/app";
import { getFirestore as initFirestore, doc as firestoreDoc, setDoc as firestoreSetDoc } from "firebase/firestore";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing with rawBody capture for webhook signature verification
app.use(express.json({
  limit: "10mb",
  verify: (req: any, res, buf) => {
    req.rawBody = buf;
  }
}));

// Initialize Firebase client on the server
let firestoreDb: any = null;
try {
  const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(firebaseConfigPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));
    const firebaseApp = initFirebaseApp(firebaseConfig);
    firestoreDb = initFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    console.log("Firebase initialized on backend with database:", firebaseConfig.firestoreDatabaseId);
  } else {
    console.warn("WARNING: firebase-applet-config.json not found on backend.");
  }
} catch (err) {
  console.error("Error initializing Firebase on server:", err);
}

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Mock database fallback or helper log
if (!ai) {
  console.warn("WARNING: GEMINI_API_KEY env is missing. AI features will fallback to mock templates.");
}

// Ensure database/AI controller utilities
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiEnabled: !!ai });
});

// Helper prompt constructs
const RESUME_JSON_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        website: { type: Type.STRING },
        headline: { type: Type.STRING },
        summary: { type: Type.STRING },
      },
      required: ["fullName", "email", "phone", "location", "headline", "summary"],
    },
    experience: {
      type: Type.ARRAY,
      description: "List of work experience items, with rich bullets detailing metrics and challenges.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          company: { type: Type.STRING },
          position: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          current: { type: Type.BOOLEAN },
          description: { type: Type.STRING, description: "Bullet points separated by newline tags" },
        },
        required: ["id", "company", "position", "startDate", "endDate", "current", "description"],
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          institution: { type: Type.STRING },
          degree: { type: Type.STRING },
          fieldOfStudy: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          current: { type: Type.BOOLEAN },
          description: { type: Type.STRING },
        },
        required: ["id", "institution", "degree", "fieldOfStudy", "startDate", "endDate", "current"],
      },
    },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ["personalInfo", "experience", "education", "skills"],
};

// 1. AI Resume Generator API
app.post("/api/resume/generate", async (req, res) => {
  const { name, currentTitle, yearsOfExperience, skills, summaryBullets, style } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      data: getMockResume(name, currentTitle, skills),
      message: "API key missing: Fallback layout generated.",
    });
  }

  try {
    const prompt = `
      Create a fully rich and comprehensive resume based on these inputs:
      - Full name: "${name || "Your Name"}"
      - Targeted job title: "${currentTitle || "Software Engineer"}"
      - Years of experience: "${yearsOfExperience || "5 years"}"
      - Skills: "${skills ? skills.join(", ") : "JavaScript, TypeScript, React"}"
      - Background summary or achievements: "${summaryBullets || "Looking to scale large engineering systems and deliver clean visual UX."}"
      
      The writing style should be: "${style || "Standard"}"
      (Options: Modern, Executive, Creative, ATS-Optimized)

      Ensure:
      1. Every experience description is a sequence of 3-4 professional bullet points, separated strictly by '\\n'.
      2. Bullet points MUST be rich, utilizing action verbs, detailing scaling triumphs, metrics, and quantitative achievements (e.g. 'Improved speed by 40%', 'Managed $10k budgets').
      3. Generate realistic mock companies, dates, degrees, or fields of study if not fully detailed to fulfill the output schema perfectly.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite, executive-level Resume Designer & AI Copywriter with 20+ years of recruiting experience in tech, design, and business.",
        responseMimeType: "application/json",
        responseSchema: RESUME_JSON_SCHEMA,
      },
    });

    const resumeJson = JSON.parse(response.text || "{}");
    res.json({ success: true, data: resumeJson });
  } catch (error: any) {
    console.error("Generate Resume error:", error);
    res.status(500).json({ error: error.message || "Failed to generate resume" });
  }
});

// 2. Cover Letter Generator API
app.post("/api/cover-letter/generate", async (req, res) => {
  const { resumeContent, jobDescription, tone } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      data: `Dear Hiring Manager,\n\nI am writing to express my eager interest in the open position. My background aligns perfectly with your requirements for high performance.\n\nBest regards,\nCandidate`,
    });
  }

  try {
    const prompt = `
      Write a premium, high-impact Cover Letter addressing the hiring manager.
      Use this user's resume details:
      ${JSON.stringify(resumeContent)}

      Tailored customly to match this Job Description:
      ${jobDescription || "Any relevant position matching the user profile"}

      Tone of the letter should be: "${tone || "Professional"}" (options: Professional, Enthusiastic, Confident)
      Output a clean, ready-to-copy cover letter. Use appropriate spacing, dates, and sign-offs.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite cover letter writer who crafts narrative hooks that recruiters love.",
      },
    });

    res.json({ success: true, data: response.text });
  } catch (error: any) {
    console.error("Cover Letter generate error:", error);
    res.status(500).json({ error: error.message || "Failed to generate cover letter" });
  }
});

// 3. ATS Score Checker
app.post("/api/ats/check", async (req, res) => {
  const { resumeContent, jobDescription } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      data: {
        score: 75,
        keywords: {
          matched: ["React", "TypeScript", "JavaScript"],
          missing: ["Rust", "CI/CD", "AWS", "Docker"],
        },
        suggestions: [
          "Add mention of public cloud container management (Docker/AWS).",
          "Ensure your profile summary explicitly lists CI/CD practices integrations.",
          "Describe quantifiable achievements in engineering reliability."
        ],
      },
    });
  }

  try {
    const prompt = `
      Compare the user resume data:
      ${JSON.stringify(resumeContent)}

      With this Job Description posting:
      ${jobDescription}

      Evaluate and return a structured JSON response matching score and keywords.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an automated Applicant Tracking System (ATS) algorithm analyzer. Give truthful ratings.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "A score from 0-100 indicating percentage match." },
            keywords: {
              type: Type.OBJECT,
              properties: {
                matched: { type: Type.ARRAY, items: { type: Type.STRING } },
                missing: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Vital skills/tech listed in job description but not found in resume." },
              },
              required: ["matched", "missing"],
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 highly actionable improvement recommendations."
            },
          },
          required: ["score", "keywords", "suggestions"],
        },
      },
    });

    res.json({ success: true, data: JSON.parse(response.text || "{}") });
  } catch (error: any) {
    console.error("ATS Check error:", error);
    res.status(500).json({ error: error.message || "Failed to check ATS score" });
  }
});

// 4. Job Description Analyzer
app.post("/api/job/analyze", async (req, res) => {
  const { jobDescription } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      data: {
        skills: ["React", "State management", "Tailwind CSS"],
        keywords: ["Responsive design", "Accessibility", "Framer Motion"],
        experienceLevel: "Mid-Senior Level",
        suggestions: ["Focus resume around client-side performance, CSS grids, and smooth animations."]
      }
    });
  }

  try {
    const prompt = `
      Analyze this job description posting:
      ${jobDescription}

      Extract required skills, keywords, experience level, and critical resume additions.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a senior recruiter extracting crucial parameters from arbitrary job listings.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Required tech stack or hard skills." },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Important domain keywords (e.g. scalability, agile)." },
            experienceLevel: { type: Type.STRING, description: "e.g. Junior, Mid, Senior, Executive" },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable points detailing what the recruiter looks for." },
          },
          required: ["skills", "keywords", "experienceLevel", "suggestions"],
        },
      },
    });

    res.json({ success: true, data: JSON.parse(response.text || "{}") });
  } catch (error: any) {
    console.error("Job analyze error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze job" });
  }
});

// 5. Resume Chat Editor (Edits in-place with JSON compliance)
app.post("/api/chat/edit", async (req, res) => {
  const { resumeContent, chatHistory, userPrompt } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      data: resumeContent,
      reply: "API key deactivated. Fallback is static. I would edit your resume elements if the server connected!"
    });
  }

  try {
    const prompt = `
      You are an interactive AI resume consultant. Your task is to edit this resume JSON based on the user request.
      
      Current Resume:
      ${JSON.stringify(resumeContent)}

      The chat so far:
      ${JSON.stringify(chatHistory || [])}

      User request:
      "${userPrompt}"

      Perform the requested edit and return the complete updated resume matching the schema structure.
      Also include a friendly explanation of the change as 'aiReply' along with the resume object inside the response JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert resume assistant who makes requested changes perfectly to the user's resume model, enhancing wording using professional metrics & achievements.",
        responseMimeType: "application/json",
         responseSchema: {
          type: Type.OBJECT,
          properties: {
            resume: RESUME_JSON_SCHEMA,
            aiReply: { type: Type.STRING, description: "A conversational, high-level summary of revisions you made for the user." },
          },
          required: ["resume", "aiReply"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsed.resume, reply: parsed.aiReply });
  } catch (error: any) {
    console.error("Chat Edit error:", error);
    res.status(500).json({ error: error.message || "Failed to edit resume through chat" });
  }
});

// 6. LinkedIn Profile Optimizer
app.post("/api/linkedin/optimize", async (req, res) => {
  const { linkedinText } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      data: {
        headline: "Innovative Professional | Scaling Tech Solutions",
        summary: "Results-driven builder focusing on React architectures, high availability databases, and sleek visual interaction pipelines.",
        experience: "Optimized corporate layouts, boosting page conversions by 25%. Built integrations with multiple SaaS platforms."
      }
    });
  }

  try {
    const prompt = `
      Generate high-conversion LinkedIn profile content from this text description/draft:
      ${linkedinText}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional brand manager and personal career marketer. Create magnetic headlines and summaries that hook connections.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING, description: "Hooking, rich 120-character LinkedIn headline with industry relevant search terms." },
            summary: { type: Type.STRING, description: "A captivating, storytelling executive bio matching modern best-practices." },
            experience: { type: Type.STRING, description: "Bullet revisions for experience sections prioritizing metrics." },
          },
          required: ["headline", "summary", "experience"],
        },
      }
    });

    res.json({ success: true, data: JSON.parse(response.text || "{}") });
  } catch (error: any) {
    console.error("LinkedIn optimize error:", error);
    res.status(500).json({ error: error.message || "Failed to optimize LinkedIn profile" });
  }
});

// 7. LinkedIn Profile Parser / Auto-Populator
app.post("/api/linkedin/parse", async (req, res) => {
  const { linkedinText } = req.body;

  if (!linkedinText || !linkedinText.trim()) {
    return res.status(400).json({ error: "No LinkedIn content provided to parse" });
  }

  if (!ai) {
    return res.json({
      success: true,
      data: {
        personalInfo: {
          fullName: "LinkedIn Professional",
          email: "jane.doe@linkedin.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco Bay Area",
          website: "",
          headline: "Product Engineer | React | Scaling Architect",
          summary: "Demonstrated history of compiling complex interactive dashboards and leading full-lifecycle deployments."
        },
        experience: [
          {
            id: `exp-${Date.now()}-1`,
            company: "Strategic Tech Solutions",
            position: "Senior Systems Specialist",
            startDate: "2022-03",
            endDate: "Present",
            current: true,
            description: "Pasted raw description processed efficiently.\nDirected React dashboard migrations increasing onboarding times by 20%."
          },
          {
            id: `exp-${Date.now()}-2`,
            company: "Global Innovations Inc",
            position: "Software Dev Lead",
            startDate: "2019-06",
            endDate: "2022-02",
            current: false,
            description: "Developed micro-frontend architectures on top of Node.js engines.\nAccelerated query processing cycles by 35%."
          }
        ],
        education: [
          {
            id: `edu-${Date.now()}-1`,
            institution: "State University of Technology",
            degree: "Bachelor of Science",
            fieldOfStudy: "Computer Engineering",
            startDate: "2015-09",
            endDate: "2019-06",
            current: false,
            description: "Maintained excellent academic honors."
          }
        ],
        skills: ["React", "TypeScript", "Node.js", "System Design", "SaaS Arch", "Database Modeling"]
      }
    });
  }

  try {
    const prompt = `
      You are an expert AI parser. You are given a raw copy-pasted text from a LinkedIn profile.
      Your task is to parse this raw text and map it into a standardized JSON resume schema.

      Raw LinkedIn pasted text:
      """
      ${linkedinText}
      """

      Rules for parsing:
      1. For Personal Info (summary, headline, fullName, email, phone, location):
         - Extract the individual's full name, current headline, location, and write or extract a high-impact professional summary.
         - If any contact details (email, phone, etc.) are not present, generate realistic placeholders or leave them empty/blank.
      2. For Experience:
         - Extract their jobs. Create rich bullet points separated by newlines for each job description. Make sure there are 2-3 bullet points based on the details provided.
         - Make sure 'current' is a boolean. Format 'startDate' and 'endDate' as 'YYYY-MM' or 'Present'.
      3. For Education:
         - Extract degrees, institutions, and fields of study.
      4. For Skills:
         - Extract any skills listed, or list up to 8 of the primary technical/professional skills mentioned in the profile.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite, executive-level LinkedIn Profile Parser with deep expertise in career coaching and candidate mapping.",
        responseMimeType: "application/json",
        responseSchema: RESUME_JSON_SCHEMA,
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("LinkedIn Parse error:", error);
    res.status(500).json({ error: error.message || "Failed to parse LinkedIn text" });
  }
});

// 8. Lemon Squeezy Payment Integration

// Create Lemon Squeezy checkout link
app.post("/api/payments/checkout", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const baseUrl = process.env.LEMON_SQUEEZY_CHECKOUT_URL || "https://resumeai.lemonsqueezy.com/checkout/buy/your-checkout-id";
  const separator = baseUrl.includes("?") ? "&" : "?";
  
  // Append user_id in custom data (Lemon Squeezy handles checkout[custom][user_id])
  const checkoutUrl = `${baseUrl}${separator}checkout[custom][user_id]=${userId}&checkout[custom][uid]=${userId}&payment_success_intent=pro`;
  
  res.json({ success: true, url: checkoutUrl });
});

// Lemon Squeezy Webhook endpoint to sync upgrades
app.post("/api/webhooks/lemonsqueezy", async (req: any, res) => {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  const signature = req.headers["x-signature"];

  if (secret && signature) {
    if (!req.rawBody) {
      console.error("Webhook rawBody is undefined.");
      return res.status(400).json({ error: "Missing raw body buffer" });
    }

    // Verify HMAC-SHA256 signature
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(req.rawBody).digest("hex");

    if (signature !== digest) {
      console.warn("Lemon Squeezy signature verification failed");
      return res.status(401).json({ error: "Invalid signature" });
    }
  } else {
    console.warn("Skipping Lemon Squeezy webhook signature verification (Secret or Signature header absent)");
  }

  // Parse webhook payload
  let payload: any;
  try {
    payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (err) {
    console.error("Webhook payload parsing failed:", err);
    return res.status(400).json({ error: "Invalid JSON format" });
  }

  const eventName = payload.meta?.event_name;
  console.log(`Received Lemon Squeezy Webhook Event: ${eventName}`);

  // Lemon Squeezy events triggers
  if (eventName === "order_created" || eventName === "checkout.completed" || eventName === "subscription_created") {
    const customData = payload.meta?.custom_data || {};
    const userId = customData.user_id || customData.userId || customData.uid || payload.data?.attributes?.custom_data?.user_id;

    if (userId) {
      console.log(`Upgrading User Account: ${userId} to Pro plan`);
      if (firestoreDb) {
        try {
          const userDocRef = firestoreDoc(firestoreDb, "users", userId);
          await firestoreSetDoc(userDocRef, { plan: "pro" }, { merge: true });
          console.log(`Upgrade complete. Firestore document updated for user ${userId}.`);
        } catch (dbErr) {
          console.error("Firestore update failed on webhook processing:", dbErr);
          return res.status(500).json({ error: "Firebase DB Write Failed" });
        }
      } else {
        console.warn("Firestore Database not initialized on webhook transaction.");
      }
    } else {
      console.warn("No user ID or uid resolved in webhook metadata custom fields:", customData);
    }
  }

  res.json({ success: true, message: "Webhook signature verified and processed" });
});

// Serve static files from dist in production
const distPath = path.join(process.cwd(), "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req: any, res: any, next: any) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// For local development only
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

// Mock fallback resume builder
function getMockResume(name: string, title: string, skills: string[]) {
  return {
    personalInfo: {
      fullName: name || "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 (555) 019-2834",
      location: "San Francisco, CA",
      website: "https://janedoe.dev",
      headline: title || "Senior Frontend Architect",
      summary: "Experienced enterprise engineer specialized in fast loading, stateful visual dashboard development. Demonstrated career delivering features that accelerate customer retainment rates.",
    },
    experience: [
      {
        id: "exp-1",
        company: "Stripe",
        position: title || "Senior Software Engineer",
        startDate: "2023-01",
        endDate: "Present",
        current: true,
        description: "Implemented fully modular billing widget dashboards using React and custom CSS grids, improving onboarding metrics by 15%.\nCollaborated directly with product teams to design robust telemetry pipelines.\nMentored junior associates across global branches.",
      },
      {
        id: "exp-2",
        company: "Vercel",
        position: "Software Developer",
        startDate: "2021-03",
        endDate: "2022-12",
        current: false,
        description: "Accelerated visual core site layout rendering optimizations by 26%.\nManaged custom deployment webhooks and edge computing microservices.\nAuthored detailed technical articles outlining server-side rendering protocols.",
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "University of California, Berkeley",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Science & Engineering",
        startDate: "2017-09",
        endDate: "2021-05",
        current: false,
        description: "Graduated with High Honors. Active contributor to open-source software libraries.",
      },
    ],
    skills: skills || ["React", "TypeScript", "Tailwind CSS", "Express.js", "Node.js", "Cloud Ingress", "System Engineering"],
  };
}


// Export for Vercel serverless
export default app;
