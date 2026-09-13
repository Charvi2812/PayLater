from typing import List, Dict, Any

class EducationService:
    """
    Returns curated beginner-friendly financial education cards in English and Hinglish.
    """
    
    @staticmethod
    def get_education_content() -> List[Dict[str, Any]]:
        return [
            {
                "id": "edu-1",
                "category": "Basics",
                "title_en": "What is BNPL (Buy Now, Pay Later)?",
                "title_hi": "BNPL (Buy Now, Pay Later) kya hota hai?",
                "desc_en": "BNPL allows you to purchase goods immediately and divide the cost into equal monthly installments, often at 0% interest if paid on time.",
                "desc_hi": "BNPL se aap saman abhi khareed sakte hain aur payment ko aasan monthly kisto (installments) mein baant sakte hain.",
                "key_takeaway_en": "Great for flexibility, but defaulting triggers high penalty fees.",
                "key_takeaway_hi": "Flexibility acchi hai, lekin time par payment na karne par penalty lagti hai."
            },
            {
                "id": "edu-2",
                "category": "Metrics",
                "title_en": "What is DTI (Debt-to-Income Ratio)?",
                "title_hi": "DTI (Debt-to-Income Ratio) kya hota hai?",
                "desc_en": "DTI is the percentage of your monthly income used to pay monthly debts and EMIs. Calculated as (Total Monthly Debt / Monthly Income) × 100.",
                "desc_hi": "DTI ka matlab hai aapki monthly income ka kitna percentage hissa purane debt aur EMI repayment mein ja raha hai.",
                "key_takeaway_en": "Keep your total DTI under 40% for financial safety.",
                "key_takeaway_hi": "Apna total DTI 40% se kam rakhna financial health ke liye best hai."
            },
            {
                "id": "edu-3",
                "category": "Metrics",
                "title_en": "Understanding Financial Stress Score",
                "title_hi": "Financial Stress Score ko samjhein",
                "desc_en": "Our AI stress model combines DTI, essential expenses, active loans, and default history to quantify monthly liquidity risk from 0 to 100.",
                "desc_hi": "Humara AI model aapki monthly income, purani EMI, aur emergency buffer ko dekh kar batata hai ki aap kitne financial pressure mein hain.",
                "key_takeaway_en": "Score > 60 means high vulnerability to financial unexpected shocks.",
                "key_takeaway_hi": "60 se upar score ka matlab hai ki emergency ke waqt tension ho sakti hai."
            },
            {
                "id": "edu-4",
                "category": "Credit",
                "title_en": "How BNPL Impacts Credit Score",
                "title_hi": "BNPL Credit Score par kya asar dalta hai?",
                "desc_en": "BNPL platforms report repayments to credit bureaus (CIBIL/Experian). On-time payments boost credit score, while missed payments lower it.",
                "desc_hi": "BNPL transactions CIBIL/Experian score par report hoti hain. Time par pay karne se credit score badhta hai.",
                "key_takeaway_en": "Always set auto-debit reminders for repayment dates.",
                "key_takeaway_hi": "Missed payments se credit score kharab ho sakta hai."
            },
            {
                "id": "edu-5",
                "category": "Comparison",
                "title_en": "BNPL vs Credit Card EMI",
                "title_hi": "BNPL vs Credit Card EMI mein farak",
                "desc_en": "BNPL typically offers 0% interest with transparent terms for 3-6 months. Credit card EMIs often carry 14-18% interest plus processing fees.",
                "desc_hi": "BNPL meist 0% interest deta hai, jabki Credit Card EMI par 14-18% tak vyaj (interest) aur processing fees lagti hai.",
                "key_takeaway_en": "BNPL saves money on short tenures if you never miss deadlines.",
                "key_takeaway_hi": "Short tenure mein BNPL paise bachata hai agar time par payment karein."
            },
            {
                "id": "edu-6",
                "category": "Planning",
                "title_en": "Build a BNPL Repayment Plan",
                "title_hi": "BNPL चुकौती योजना बनाएँ",
                "desc_en": "Before checking out, list each due date, EMI amount, and available account balance. Keep the EMI separate from rent, food, and emergency savings.",
                "desc_hi": "खरीदारी से पहले हर किस्त की तारीख, EMI राशि और खाते में उपलब्ध राशि लिखें। EMI को किराया, भोजन और आपातकालीन बचत से अलग रखें।",
                "key_takeaway_en": "Only commit when the repayment amount is already present in your monthly plan.",
                "key_takeaway_hi": "तभी खरीदें जब किस्त की राशि आपके मासिक बजट में पहले से शामिल हो।"
            },
            {
                "id": "edu-7",
                "category": "Safety",
                "title_en": "Watch for Fees and Missed Payments",
                "title_hi": "शुल्क और छूटे हुए भुगतान से सावधान रहें",
                "desc_en": "Read the lender's terms for late fees, processing fees, auto-debit rules, and how missed payments may be reported. Keep notifications enabled until the plan is closed.",
                "desc_hi": "देर से भुगतान शुल्क, प्रोसेसिंग शुल्क, ऑटो-डेबिट नियम और भुगतान चूक की रिपोर्टिंग से जुड़े नियम पढ़ें। योजना पूरी होने तक सूचनाएँ चालू रखें।",
                "key_takeaway_en": "A 0% offer can still become costly if you miss its due date.",
                "key_takeaway_hi": "0% की योजना भी समय पर भुगतान न होने पर महँगी हो सकती है।"
            }
        ]
