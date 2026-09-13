# AI-Powered Responsible BNPL & Financial Wellness System

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-blue)](https://sih.gov.in)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.0+-cyan.svg)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5.0+-purple.svg)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-06B6D4.svg)](https://tailwindcss.com)

> **"We don't just ask whether a user can borrow. We ask whether they can comfortably afford to repay without creating unhealthy financial stress."**

The **AI-Powered Responsible BNPL & Financial Wellness System** is a prototype financial decision-support and wellness platform built for the Smart India Hackathon. It evaluates whether a Buy Now, Pay Later (BNPL) purchase is financially safe for a consumer by combining a transparent rule-based risk model, an evolutionary machine learning risk classifier, a Debt-to-Income (DTI) headroom engine, a 0–100 Financial Stress Index, explainable AI recommendation logic, an interactive What-If Simulator, an AI Wellness Assistant, and beginner-friendly financial education in English and Hinglish.

---

## 🌟 Key Innovations & Features

1. **Normalized BNPL Risk Engine (0–100)**: Evaluates Credit Score, default history, existing EMI burden, debt-to-income ratio, active loan fatigue, and proposed purchase size relative to income.
2. **Affordability & Debt-to-Income (DTI) Engine**: Quantifies user DTI **Before BNPL** vs **After BNPL** and measures monthly free cash flow headroom.
3. **Multi-Tenure EMI Matrix**: Calculates 3, 6, 9, and 12-month tenure options (0% interest BNPL) alongside side-by-side cost comparison against revolving credit card EMIs.
4. **Financial Stress Gauge**: Holistic score (0–100: Low, Moderate, High, Critical) detecting budget liquidity compression before default occurs.
5. **Responsible Recommendation Engine**: Outputs 🟢 `APPROVED`, 🟡 `CONDITIONAL` (recommending safer longer tenure options), or 🔴 `NOT RECOMMENDED`.
6. **Explainable AI (XAI)**: Deconstructs decisions into bulleted positive financial factors and identified risk drivers.
7. **Real-time What-If Simulator**: Interactive sliders for Product Price, Monthly Income, and Tenure that instantly update EMI, DTI %, Stress Score, and Recommendation without page reloads.
8. **AI Financial Wellness Assistant**: Context-aware AI assistant pre-loaded with user assessment details to explain decisions and answer budgeting questions.
9. **Financial Literacy Hub**: Bite-sized cards explaining DTI, Credit Score, BNPL mechanics vs Credit Cards, and a one-click English / Hinglish toggle.
10. **SIH Hackathon Demo Loader**: Pre-populated profiles (**Safe 🟢**, **Moderate 🟡**, **High Risk 🔴**) for quick judge demonstrations.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide React, Framer Motion
* **Backend**: Python 3.10+, FastAPI, Pydantic v2, Scikit-Learn, Pandas, NumPy, Uvicorn
* **ML Layer**: Synthetic dataset generator & Random Forest Classifier baseline

---

## 📐 System Architecture

```text
React + TypeScript Frontend (Port 5173)
          │
       REST API (JSON)
          │
      FastAPI Backend (Port 8000)
          │
  ┌───────┼───────────────────────────┐
  │       │                           │
Risk   Affordability Engine      EMI Matrix Engine
Engine (DTI Before vs After)   (3, 6, 9, 12 Months)
  │       │                           │
  └───────┼───────────────────────────┘
          │
  Financial Stress Engine (0-100 Score)
          │
  Recommendation Engine (APPROVED/CONDITIONAL/NOT RECOMMENDED)
          │
  Explainable AI (XAI) & AI Wellness Assistant
```

---

## 🚀 Quick Start & Installation

### Prerequisites
* Python 3.10 or higher
* Node.js 18 or higher & npm

### 1. Start the FastAPI Backend Server
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API will run at `http://localhost:8000` with interactive Swagger docs at `http://localhost:8000/docs`.

### 2. Start the React Frontend Application
```bash
cd frontend
npm install
npm run dev -- --port 5173
```
Open your browser and navigate to `http://localhost:5173`.

---

## 🎮 Hackathon Live Jury Demonstration Guide

To demonstrate the full user journey during a live presentation:

1. **Open Application**: Navigate to `http://localhost:5173` to view the Landing Page hero section and core philosophy card.
2. **Load Quick Demo**: Click **"Demo Mode"** in the top navigation bar or **"Explore Interactive Demo"** on the home page:
   - **Profile 1 — Safe 🟢**: Income ₹80,000 | EMI ₹10,000 | Credit Score 780 | Purchase ₹25,000 → Expected: `APPROVED`
   - **Profile 2 — Moderate 🟡**: Income ₹50,000 | EMI ₹12,000 | Credit Score 700 | Purchase ₹30,000 → Expected: `CONDITIONAL` (recommends switching from 3-month to 9-month plan)
   - **Profile 3 — High Risk 🔴**: Income ₹30,000 | EMI ₹15,000 | Credit Score 600 | 2 Defaults | Purchase ₹50,000 → Expected: `NOT RECOMMENDED`
3. **Review Assessment Results**: Observe Financial Stress Gauge, Risk Score, DTI Before/After visual shift, Tenure EMI matrix, and Explainable AI factors.
4. **Open What-If Simulator**: Drag product price slider from ₹30,000 to ₹15,000 or adjust tenure from 3 to 12 months -> Watch DTI and Stress Score recalculate live.
5. **Ask AI Assistant**: Open AI Wellness Assistant tab and click prompt *"Why was my BNPL request conditional?"* -> Receive contextual explanation.
6. **Financial Education**: Open Financial Hub and click *"Switch to Hinglish"* to demonstrate bilingual support.

---

## 🔒 Important Financial Disclaimer

> **Notice**: This platform is a prototype financial wellness and decision-support tool. All calculations, risk indices, and AI recommendations are educational estimates based on user inputs and synthetic risk models. They do not constitute a formal lending decision, credit guarantee, or regulated financial advice. No real banking credentials or sensitive PII are collected or stored.
