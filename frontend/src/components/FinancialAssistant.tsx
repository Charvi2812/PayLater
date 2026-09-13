import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import type { AssessmentResult } from '../types';
import { api } from '../services/api';

interface FinancialAssistantProps {
  currentAssessment: AssessmentResult | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const FinancialAssistant: React.FC<FinancialAssistantProps> = ({ currentAssessment }) => {
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: currentAssessment
        ? `Hello! I am Ask AI. I have loaded your assessment data for product "${currentAssessment.total_payable ? '₹' + currentAssessment.total_payable.toLocaleString() : 'Purchase'}" (Post-BNPL DTI: ${currentAssessment.dti_after}%, Stress Score: ${currentAssessment.financial_stress_score}/100). Ask me any question!`
        : `Hello! I am Ask AI. Ask me how BNPL works, how DTI is calculated, or run an assessment to get personalized advice!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    "Why was my BNPL request conditional?",
    "Can I afford this product?",
    "What happens if I choose 12 months?",
    "How can I reduce my financial stress?"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || inputQuery).trim();
    if (!queryText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    try {
      const res = await api.askAssistant({
        question: queryText,
        assessment_context: currentAssessment ? {
          dti_after: currentAssessment.dti_after,
          financial_stress_score: currentAssessment.financial_stress_score,
          recommendation: currentAssessment.recommendation,
          recommended_tenure: currentAssessment.recommended_tenure,
          monthly_emi: currentAssessment.monthly_emi
        } : undefined
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Assistant error:', err);
      setMessages(prev => [...prev, {
        id: `bot-error-${Date.now()}`,
        sender: 'bot',
        text: 'I could not reach the assistant right now. Please check that the backend is running and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-indigo-500/30 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Ask AI</h1>
          <p className="text-xs text-slate-400">Contextual explainability and budget guidance.</p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-700/50 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Context Loaded</span>
        </div>
      </div>

      {/* Chat Window Box */}
      <div className="glass-card border-slate-800 rounded-3xl overflow-hidden flex flex-col h-[550px]">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                  : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-line">{msg.text}</div>
                <div className={`text-[9px] mt-2 text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                  {msg.timestamp}
                </div>
              </div>

            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-slate-400 italic">
              <span>Analyzing financial profile parameters...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-6 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-semibold text-slate-500 uppercase flex-shrink-0">Suggested:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="text-[11px] text-indigo-300 hover:text-white bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-800/50 px-3 py-1 rounded-full flex-shrink-0 transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask AI: 'Why was my BNPL conditional?' or 'How to lower DTI?'..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim() || isLoading}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Mandatory Financial Disclaimer Banner */}
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
        <span>This is an educational estimate and decision-support prototype. It does not constitute formal financial advice or a binding credit decision.</span>
      </div>

    </div>
  );
};
