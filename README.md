# ResumeAI 🚀
### World-Class AI-Powered Resume Builder

Build professional resumes in seconds with Google Gemini AI.

---

## ✨ Features

- 🤖 AI Resume Generator (Google Gemini streaming)
- 📄 20+ Premium Templates
- ✉️ AI Cover Letter Generator
- 📊 ATS Score Checker (0-100 with keywords)
- 🔗 LinkedIn Profile Importer
- 💬 Resume Chat Editor
- 📥 PDF Export (watermark-free on Pro)
- 💳 Pro Plan via Lemon Squeezy ($9/month or $49 lifetime)

---

## 🚀 Quick Start

### 1. Install
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

Fill in your keys:
- `GEMINI_API_KEY` → [aistudio.google.com](https://aistudio.google.com/app/apikey)
- `LEMON_SQUEEZY_CHECKOUT_URL` → From Lemon Squeezy Products
- `LEMON_SQUEEZY_WEBHOOK_SECRET` → From Lemon Squeezy Webhooks

### 3. Setup Firebase
- Create project at [console.firebase.google.com](https://console.firebase.google.com)
- Enable Authentication (Email/Password)
- Enable Firestore Database
- Copy config to `firebase-applet-config.json`

### 4. Run
```bash
npm run dev
```

Open: http://localhost:3000

---

## 🔥 Deploy to Vercel

```bash
npm install -g vercel
vercel deploy
```

Add environment variables in Vercel → Settings → Environment Variables:
- `GEMINI_API_KEY`
- `LEMON_SQUEEZY_CHECKOUT_URL`
- `LEMON_SQUEEZY_WEBHOOK_SECRET`
- `APP_URL`

---

## 💰 Pricing Plans

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | 2 resumes, 3 templates, watermark |
| Pro | $9/month or $49 lifetime | Unlimited everything, no watermark |

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Express.js + Node.js
- **Auth & DB:** Firebase
- **AI:** Google Gemini 1.5 Pro
- **Payments:** Lemon Squeezy
- **Deploy:** Vercel

---

## 📁 Structure

```
resumeai/
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ResumeBuilder.tsx
│   │   ├── ResumeTemplates.tsx
│   │   ├── ATSChecker.tsx
│   │   └── LogoIcon.tsx
│   ├── App.tsx
│   ├── firebase.ts
│   └── types.ts
├── server.ts
├── vercel.json
├── .env.example
└── README.md
```
