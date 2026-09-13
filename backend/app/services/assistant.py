import json
import os
from typing import Dict, Any, List, Optional
from urllib.error import URLError
from urllib.request import Request, urlopen
from app.schemas.assessment import AssistantQuery, AssistantResponse

class AssistantEngine:
    """
    AI Financial Wellness Assistant providing educational insights based on
    user's current assessment results and financial questions.
    """
    
    @staticmethod
    def answer_question(query: AssistantQuery) -> AssistantResponse:
        q = query.question.lower().strip()
        ctx = query.assessment_context or {}
        
        dti_after = ctx.get("dti_after", 35.0)
        stress_score = ctx.get("financial_stress_score", 45.0)
        rec = ctx.get("recommendation", "CONDITIONAL")
        rec_tenure = ctx.get("recommended_tenure", 9)
        monthly_emi = ctx.get("monthly_emi", 5000)
        
        suggestions = [
            "How can I lower my financial stress score?",
            "What happens if I choose a 12-month tenure?",
            "What is a safe Debt-to-Income (DTI) ratio?",
            "Why is BNPL better than a credit card EMI?"
        ]
        
        disclaimer = "Notice: This platform is a prototype financial wellness decision-support tool. Guidance provided is for educational estimation and does not constitute a formal lending decision or regulated financial advice."
        
        if "why" in q and ("not recommended" in q or "conditional" in q or "rejected" in q or "given" in q or "recommendation" in q):
            answer = (
                f"Your assessment recommendation was **{rec}** primarily because your calculated post-BNPL Debt-to-Income (DTI) ratio "
                f"reaches **{dti_after}%** with a Financial Stress Score of **{stress_score}/100**.\n\n"
                f"Short tenure plans require higher monthly payments (₹{int(monthly_emi):,}/mo), which consumes a large portion of your disposable income after essential expenses and existing EMIs."
            )
        elif "laptop" in q or "afford" in q or "can i buy" in q or "purchase" in q:
            if rec == "APPROVED":
                answer = (
                    f"Yes! Based on your submitted profile, this purchase is financially manageable. "
                    f"Your post-purchase DTI remains at a comfortable **{dti_after}%**, leaving adequate monthly cash cushion."
                )
            elif rec == "CONDITIONAL":
                answer = (
                    f"You can afford this item, but we recommend opting for a **{rec_tenure}-month tenure** instead of a shorter plan. "
                    f"This reduces your monthly obligation and keeps your Debt-to-Income ratio below critical thresholds."
                )
            else:
                answer = (
                    f"Currently, this purchase is **NOT RECOMMENDED** as it elevates your Financial Stress Score to **{stress_score}/100**. "
                    f"Consider saving for a down payment to reduce the borrowed principal or clear existing EMIs first."
                )
        elif "tenure" in q or "12" in q or "9" in q or "month" in q:
            answer = (
                f"Extending your tenure spreads out payments over more months, lowering your monthly EMI. "
                f"For instance, moving to a {rec_tenure}-month tenure lowers monthly strain, keeping your post-BNPL DTI lower and giving you higher monthly liquidity."
            )
        elif "stress" in q or "reduce" in q or "lower" in q or "improve" in q:
            answer = (
                "To reduce your Financial Stress Score:\n"
                "1. Choose longer repayment tenures to minimize monthly EMI obligation.\n"
                "2. Avoid taking multiple simultaneous BNPL loans or credit lines.\n"
                "3. Pay off smaller existing EMIs to lower your baseline Debt-to-Income ratio below 30%.\n"
                "4. Maintain a 3-month emergency reserve before making large discretionary purchases."
            )
        elif "dti" in q or "debt to income" in q:
            answer = (
                "Debt-to-Income (DTI) ratio measures what percentage of your monthly gross income goes toward debt payments (EMIs).\n"
                "• Below 30%: Safe & Healthy 🟢\n"
                "• 30%–45%: Moderate / Acceptable 🟡\n"
                "• Above 45%: High Financial Stress 🔴"
            )
        else:
            answer = (
                f"Based on your profile, your post-BNPL Debt-to-Income is **{dti_after}%** with a Financial Stress Index of **{stress_score}/100**. "
                f"Our AI system suggests keeping your total monthly debt payments under 40% of your income for optimal financial wellness."
            )
            
        generated_answer = AssistantEngine._generate_with_gemini(query.question, ctx)

        return AssistantResponse(
            answer=generated_answer or answer,
            suggestions=suggestions,
            disclaimer=disclaimer
        )

    @staticmethod
    def _generate_with_gemini(question: str, context: Dict[str, Any]) -> Optional[str]:
        """Use Gemini when configured, while retaining the local rules as a safe fallback."""
        api_key = os.getenv("GEMINI_API_KEY", "").strip().strip('"').strip("'")
        if not api_key:
            return None

        model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        prompt = (
            "You are a responsible BNPL financial-wellness assistant. Answer the user's question "
            "directly and briefly using the assessment context when it is relevant. Do not invent facts, "
            "do not make lending decisions, and do not give regulated financial advice. Explain terms plainly. "
            "End with one practical next step.\n\n"
            f"Assessment context: {json.dumps(context, ensure_ascii=False)}\n"
            f"User question: {question}"
        )
        payload = json.dumps({
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.35, "maxOutputTokens": 350}
        }).encode("utf-8")
        request = Request(
            f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        try:
            with urlopen(request, timeout=10) as response:
                body = json.loads(response.read().decode("utf-8"))
            text = body["candidates"][0]["content"]["parts"][0]["text"].strip()
            return text or None
        except (KeyError, IndexError, TypeError, ValueError, OSError, URLError):
            return None
