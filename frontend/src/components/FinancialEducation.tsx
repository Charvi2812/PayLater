import React, { useState, useEffect } from 'react';
import type { EducationCard } from '../types';
import { api } from '../services/api';

const hindiContent: Record<string, Pick<EducationCard, 'title_hi' | 'desc_hi' | 'key_takeaway_hi'>> = {
  'edu-1': { title_hi: 'BNPL (अभी खरीदें, बाद में भुगतान) क्या है?', desc_hi: 'BNPL से आप सामान तुरंत खरीद सकते हैं और उसकी कीमत को आसान मासिक किस्तों में बाँट सकते हैं। समय पर भुगतान करने पर कई योजनाओं में ब्याज नहीं लगता।', key_takeaway_hi: 'सुविधाजनक है, लेकिन देर से भुगतान करने पर शुल्क लग सकता है।' },
  'edu-2': { title_hi: 'DTI (ऋण-से-आय अनुपात) क्या है?', desc_hi: 'DTI बताता है कि आपकी मासिक आय का कितना प्रतिशत EMI और दूसरे ऋण चुकाने में जाता है। सूत्र: कुल मासिक ऋण ÷ मासिक आय × 100।', key_takeaway_hi: 'वित्तीय सुरक्षा के लिए DTI को 40% से कम रखने का प्रयास करें।' },
  'edu-3': { title_hi: 'फाइनेंशियल स्ट्रेस स्कोर को समझें', desc_hi: 'यह स्कोर आपकी DTI, जरूरी खर्च, सक्रिय ऋण और भुगतान इतिहास को मिलाकर मासिक बजट पर दबाव को 0 से 100 के बीच दिखाता है।', key_takeaway_hi: '60 से अधिक स्कोर का अर्थ है कि अचानक खर्च आने पर बजट पर ज्यादा दबाव पड़ सकता है।' },
  'edu-4': { title_hi: 'BNPL का क्रेडिट स्कोर पर प्रभाव', desc_hi: 'कुछ BNPL प्रदाता भुगतान की जानकारी क्रेडिट ब्यूरो को देते हैं। समय पर भुगतान स्कोर को सहारा दे सकता है, जबकि चूक नुकसान पहुँचा सकती है।', key_takeaway_hi: 'भुगतान की तारीख के लिए ऑटो-डेबिट या रिमाइंडर लगाएँ।' },
  'edu-5': { title_hi: 'BNPL और क्रेडिट कार्ड EMI की तुलना', desc_hi: 'BNPL में छोटी अवधि के लिए 0% ब्याज हो सकता है। क्रेडिट कार्ड EMI में ब्याज और प्रोसेसिंग शुल्क लग सकते हैं; हमेशा कुल लागत की तुलना करें।', key_takeaway_hi: 'सिर्फ मासिक किस्त नहीं, कुल भुगतान और सभी शुल्क भी जाँचें।' }
};

const practicalTopics = [
  ['Repayment calendar', 'Record every due date and EMI in one calendar. Set a reminder two days before auto-debit.'],
  ['Total cost check', 'Compare the total payable amount, processing fee, and late-fee terms—not just the monthly EMI.'],
  ['Emergency buffer', 'Keep essential-expense savings separate from the account used for BNPL repayments.'],
  ['Avoid stacking plans', 'Multiple small BNPL plans can add up quickly and reduce your available monthly cash.'],
  ['Before checkout', 'Wait 24 hours for non-essential purchases and recheck whether the EMI still fits your budget.'],
  ['If repayment is difficult', 'Contact the provider before the due date and avoid borrowing elsewhere only to cover an EMI.']
];

export const FinancialEducation: React.FC = () => {
  const [cards, setCards] = useState<EducationCard[]>([]);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const isHindi = language === 'hi';

  useEffect(() => {
    api.getEducation().then(setCards);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-10 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{isHindi ? 'वित्तीय साक्षरता और वेलनेस हब' : 'Financial Literacy & Wellness Hub'}</h1>
          <p className="text-xs text-slate-400">{isHindi ? 'जिम्मेदार उधारी, DTI सीमा और BNPL की जानकारी समझें।' : 'Master the math behind responsible borrowing, DTI thresholds, and BNPL mechanics.'}</p>
        </div>

        {/* Language Toggle Button */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          aria-label={isHindi ? 'Switch to English' : 'Switch to Hindi'}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-[0px] font-semibold transition"
        >
          <span className="text-xs">{isHindi ? 'Switch to English' : 'हिंदी में बदलें'}</span>
          <span>{language === 'en' ? 'Switch to Hinglish (हिंदी)' : 'Switch to English'}</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card) => (
          <div key={card.id} className="glass-card glass-card-hover financial-hub-card p-6 border-slate-700/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                  {isHindi ? ({ Basics: 'बुनियादी जानकारी', Metrics: 'मापदंड', Credit: 'क्रेडिट', Comparison: 'तुलना', Planning: 'योजना', Safety: 'सुरक्षा' }[card.category] || card.category) : card.category}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">
                {isHindi ? (hindiContent[card.id]?.title_hi || card.title_hi) : card.title_en}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {isHindi ? (hindiContent[card.id]?.desc_hi || card.desc_hi) : card.desc_en}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 bg-slate-950/60 -mx-6 -mb-6 p-4 rounded-b-2xl">
              <p className="text-[11px] font-semibold text-emerald-400">
                {isHindi ? 'मुख्य बात:' : 'Key Takeaway:'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isHindi ? (hindiContent[card.id]?.key_takeaway_hi || card.key_takeaway_hi) : card.key_takeaway_en}
              </p>
            </div>
          </div>
        ))}
      </div>

      <section className="space-y-5">
        <div>
          <h3 className="font-bold text-white text-base">Practical BNPL planning guide</h3>
          <p className="text-xs text-slate-400 mt-1">Use these checks alongside the assessment before committing to a repayment plan.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          {practicalTopics.map(([title, text]) => (
            <div key={title} className="financial-hub-topic p-4 bg-slate-800/60 rounded-2xl border border-slate-700/70">
              <h4 className="font-bold text-white mb-1">{title}</h4>
              <p className="text-slate-400 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Beginner FAQ Card */}
      <section className="space-y-5">
        <h3 className="font-bold text-white text-base">
          {isHindi ? 'जिम्मेदार BNPL के सुनहरे नियम' : 'Golden Rules of Responsible BNPL'}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="financial-hub-topic p-4 bg-slate-800/60 rounded-2xl border border-slate-700/70">
            <h4 className="font-bold text-white mb-1">{isHindi ? '1. 30% DTI नियम' : '1. Rule of 30% DTI'}</h4>
            <p className="text-slate-400">Never let total monthly debt obligations exceed 30–35% of your net monthly income.</p>
          </div>

          <div className="financial-hub-topic p-4 bg-slate-800/60 rounded-2xl border border-slate-700/70">
            <h4 className="font-bold text-white mb-1">{isHindi ? '2. एक ही सक्रिय BNPL योजना' : '2. Single Active BNPL'}</h4>
            <p className="text-slate-400">Avoid stacking multiple BNPL purchases across different platforms at the same time.</p>
          </div>

          <div className="financial-hub-topic p-4 bg-slate-800/60 rounded-2xl border border-slate-700/70">
            <h4 className="font-bold text-white mb-1">{isHindi ? '3. आपातकालीन बचत' : '3. Emergency Reserve'}</h4>
            <p className="text-slate-400">Always keep 3 months of essential living expenses untouched in liquid savings.</p>
          </div>
        </div>
      </section>

    </div>
  );
};
