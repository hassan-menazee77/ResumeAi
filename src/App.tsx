import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, doc, setDoc, getDocs, deleteDoc, onSnapshot } from "firebase/firestore";
import { auth, db, loginWithGoogle, logoutUser, handleFirestoreError, OperationType, getLoginResult } from "./firebase";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { ResumeBuilder } from "./components/ResumeBuilder";
import { ATSChecker } from "./components/ATSChecker";
import { ResumeDocument, ResumeContent, TemplateType } from "./types";
import { Sparkles } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"landing" | "dashboard" | "builder" | "ats">("landing");
  const [userPlan, setUserPlan] = useState<"free" | "pro">("free");
  
  const [resumes, setResumes] = useState<ResumeDocument[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);

  useEffect(() => {
    getLoginResult().then((user) => {
      if (user) console.log("Redirect login success:", user.email);
    });

    let unsubscribeUser: (() => void) | null = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (unsubscribeUser) {
        unsubscribeUser();
        unsubscribeUser = null;
      }
      if (firebaseUser) {
        setActiveTab("dashboard");
        fetchResumesFromFirestore(firebaseUser.uid);
        
        const userDocRef = doc(db, "users", firebaseUser.uid);
        unsubscribeUser = onSnapshot(userDocRef, async (snap) => {
          if (snap.exists()) {
            setUserPlan(snap.data().plan || "free");
          } else {
            const newUserDoc = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              plan: "free",
              usageCount: 0,
              createdAt: new Date().toISOString()
            };
            try {
              await setDoc(userDocRef, newUserDoc);
              setUserPlan("free");
            } catch (err) {
              console.error("Error creating user profile in Firestore:", err);
            }
          }
        });
      } else {
        setResumes([]);
        setActiveTab("landing");
        loadResumesFromLocalStorage();
        setUserPlan("free");
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
    };
  }, []);

  const fetchResumesFromFirestore = async (uid: string) => {
    try {
      const colRef = collection(db, "users", uid, "resumes");
      const snap = await getDocs(colRef);
      const docs: ResumeDocument[] = [];
      snap.forEach((d) => {
        docs.push(d.data() as ResumeDocument);
      });
      setResumes(docs);
    } catch (error) {
      console.warn("Firestore fetch error, falling back to local:", error);
      loadResumesFromLocalStorage();
    }
  };

  const loadResumesFromLocalStorage = () => {
    try {
      const cached = localStorage.getItem("resume_ai_docs");
      if (cached) {
        setResumes(JSON.parse(cached));
      } else {
        setResumes([]);
      }
    } catch (err) {
      console.error("Local storage read fail:", err);
    }
  };

  const syncToLocalStorage = (docsList: ResumeDocument[]) => {
    try {
      localStorage.setItem("resume_ai_docs", JSON.stringify(docsList));
    } catch (err) {
      console.error("Local storage write fail:", err);
    }
  };

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("Unified login error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("resume_ai_docs");
      setActiveTab("landing");
    } catch (err) {
      console.error("SignOut fail:", err);
    }
  };

  const handleCreateNewResume = () => {
    if (userPlan === "free" && resumes.length >= 2) {
      alert("You have reached the Free Tier limit of 2 resumes. Please upgrade to Pro for unlimited resumes, premium templates, and full ATS breakdowns!");
      return;
    }

    const docId = `doc-${Date.now()}`;
    const newDoc: ResumeDocument = {
      id: docId,
      userId: user?.uid || "guest",
      title: `Resume Core Design #${resumes.length + 1}`,
      content: {
        personalInfo: {
          fullName: user?.displayName || "Jane Dev Candidate",
          email: user?.email || "jane.candidate@tech.com",
          phone: "+1 (555) 789-0123",
          location: "San Francisco, CA",
          website: "https://janecandidate.dev",
          headline: "Principal Systems Engineer",
          summary: "Highly precise analytical engineer with 5+ years building durable cloud architectures and microservices. Leverages metrics to optimize concurrency bounds and performance scaling speeds.",
        },
        experience: [
          {
            id: "e-1",
            company: "Stripe",
            position: "Senior Platform Architect",
            startDate: "2023-05",
            endDate: "Present",
            current: true,
            description: "Led database query index calibration models raising resolving throughput by 38%.\nArchitected cluster replication frameworks scaling payload handling density.\nStreamlined node setups reducing infrastructure bottlenecks by $15k per cluster build.",
          },
          {
            id: "e-2",
            company: "Vercel",
            position: "Systems Developer Interface",
            startDate: "2021-08",
            endDate: "2023-04",
            current: false,
            description: "Engineered web-vital hooks accelerating cumulative layout shifts by 25%.\nCollaborated on sandboxed edge layouts securing responsive telemetry logs.\nDrafted comprehensive documentation guides speeding developer onboarding levels.",
          },
        ],
        education: [
          {
            id: "edu-1",
            institution: "Stanford University",
            degree: "Master of Science",
            fieldOfStudy: "Distributed Computer Systems",
            startDate: "2019-09",
            endDate: "2021-06",
            current: false,
            description: "Graduated with High honors, specialized in concurrent thread resolutions.",
          }
        ],
        skills: ["Golang", "Rust", "TypeScript", "Kubernetes", "AWS EKS", "Terraform", "Distributed Transactions", "System Architecture"],
      },
      template: "modern_minimal",
      atsScore: 78,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newDoc, ...resumes];
    setResumes(updated);
    setActiveResumeId(docId);
    setActiveTab("builder");

    if (!user) {
      syncToLocalStorage(updated);
    } else {
      saveDocToFirestore(user.uid, newDoc);
    }
  };

  const saveDocToFirestore = async (uid: string, document: ResumeDocument) => {
    try {
      const docRef = doc(db, "users", uid, "resumes", document.id);
      await setDoc(docRef, document);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${uid}/resumes/${document.id}`);
    }
  };

  const handleEditResume = (id: string) => {
    setActiveResumeId(id);
    setActiveTab("builder");
  };

  const handleDeleteResume = async (id: string) => {
    const updated = resumes.filter((r) => r.id !== id);
    setResumes(updated);

    if (!user) {
      syncToLocalStorage(updated);
    } else {
      try {
        const docRef = doc(db, "users", user.uid, "resumes", id);
        await deleteDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/resumes/${id}`);
      }
    }
  };

  const handleSaveFromBuilder = async (
    content: ResumeContent,
    template: string,
    score: number
  ) => {
    if (!activeResumeId) return;

    const updatedResumes = resumes.map((doc) => {
      if (doc.id === activeResumeId) {
        const revised: ResumeDocument = {
          ...doc,
          content,
          template,
          atsScore: score,
          updatedAt: new Date().toISOString(),
        };

        if (user) {
          saveDocToFirestore(user.uid, revised);
        }

        return revised;
      }
      return doc;
    });

    setResumes(updatedResumes);
    if (!user) {
      syncToLocalStorage(updatedResumes);
    }
  };

  const handleUpgrade = async () => {
    if (!user) {
      alert("Please Sign In first to upgrade your account to Pro.");
      handleLogin();
      return;
    }
    
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { plan: "pro" }, { merge: true });
      alert("🎉 Congratulations! Your account has been upgraded to Premium Pro instantly. Access all premium templates, docx formats, unlimited resumes, and unlimited scans now!");
    } catch (err: any) {
      console.error("Upgrade trigger error:", err);
      alert("Failed to upgrade account: " + err.message);
    }
  };

  return (
    <div className="bg-[#0a0a0f] text-slate-100 min-h-screen">
      {activeTab === "landing" && (
        <LandingPage 
          onStartBuilding={user ? () => setActiveTab("dashboard") : handleLogin}
          onLogin={handleLogin}
          userEmail={user?.email}
        />
      )}

      {activeTab === "dashboard" && (
        <Dashboard 
          resumes={resumes}
          onCreateNew={handleCreateNewResume}
          onEdit={handleEditResume}
          onDelete={handleDeleteResume}
          onLogout={handleLogout}
          userEmail={user?.email}
          onNavigateToTab={(tab) => setActiveTab(tab as any)}
          userPlan={userPlan}
          onUpgradeClick={handleUpgrade}
        />
      )}

      {activeTab === "builder" && (
        <ResumeBuilder 
          documentId={activeResumeId}
          initialContent={resumes.find((r) => r.id === activeResumeId)?.content}
          initialTemplate={resumes.find((r) => r.id === activeResumeId)?.template}
          onSave={handleSaveFromBuilder}
          onBack={() => setActiveTab(user ? "dashboard" : "landing")}
          userEmail={user?.email}
          userPlan={userPlan}
          onUpgradeClick={handleUpgrade}
        />
      )}

      {activeTab === "ats" && (
        <ATSChecker 
          resumes={resumes}
          onBack={() => setActiveTab(user ? "dashboard" : "landing")}
          onNavigateToTab={(tab) => setActiveTab(tab as any)}
          userPlan={userPlan}
          onUpgradeClick={handleUpgrade}
        />
      )}
    </div>
  );
}
