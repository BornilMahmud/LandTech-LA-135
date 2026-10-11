import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  HelpCircle, 
  Key, 
  RefreshCw, 
  MapPin, 
  Layers, 
  Building2,
  User,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { LandParcel, SuitabilityPurpose, TourismDestination, Language, AdvisorMessage } from '../types';
import { askAdvisor } from '../utils/advisor';
import { calculateSuitability } from '../utils/suitability';
import { TRANSLATIONS } from '../locales/translations';

interface AdvisorChatProps {
  selectedParcel: LandParcel | null;
  comparedParcels: LandParcel[];
  selectedPurpose: SuitabilityPurpose;
  selectedDestination: TourismDestination | null;
  language: Language;
}

export const AdvisorChat: React.FC<AdvisorChatProps> = ({
  selectedParcel,
  comparedParcels,
  selectedPurpose,
  selectedDestination,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [messages, setMessages] = useState<AdvisorMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          textEn: selectedParcel
            ? `Welcome to **LandWise AI Advisor**! I have loaded **${selectedParcel.titleEn}** (${selectedParcel.district}) into active context for **${selectedPurpose.toUpperCase()}** evaluation.\n\nYou can ask why this parcel scores high, inquiry about AC Land mutation and title verification, or compare it with other shortlisted plots.`
            : `Welcome to **LandWise AI Advisor**! Select a land plot from the Map Explorer or Smart Land Finder, or ask me questions about Bangladesh property evaluation, soil suitability, flood safety, or tourism itineraries.`,
          textBn: selectedParcel
            ? `**ল্যান্ডওয়াইজ এআই উপদেষ্টায়** আপনাকে স্বাগতম! নির্বাচিত জমি **${selectedParcel.titleBn}** (${selectedParcel.district}) এর তথ্য **${t.purposes[selectedPurpose]}** মূল্যায়নের জন্য প্রস্তুত রয়েছে।\n\nআপনি এই জমির আইনি যাচাই, নামজারি, বন্যা ঝুঁকি বা অন্য জমির সাথে তুলনামূলক যেকোনো প্রশ্ন করতে পারেন।`
            : `**ল্যান্ডওয়াইজ এআই উপদেষ্টায়** আপনাকে স্বাগতম! ম্যাপ বা ল্যান্ড ফাইন্ডার থেকে জমি নির্বাচন করুন অথবা বাংলাদেশের জমি কেনাবেচা, মাটি, বন্যা ও পর্যটন সংক্রান্ত প্রশ্ন করুন।`,
          sourcesCited: ['LandWise AI Grounded Context Engine'],
        }
      ]);
    }
  }, [selectedParcel, selectedPurpose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: AdvisorMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      textEn: textToSend,
      textBn: textToSend,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await askAdvisor(
        textToSend,
        {
          parcel: selectedParcel || undefined,
          comparedParcels,
          purpose: selectedPurpose,
          destination: selectedDestination || undefined,
          language,
        },
        apiKey
      );

      const assistantMsg: AdvisorMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        textEn: response.textEn,
        textBn: response.textBn,
        sourcesCited: response.sources,
        dataCoverageNotice: response.missingWarnings.length > 0 ? response.missingWarnings.join(', ') : undefined
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-5rem)] flex flex-col space-y-4">
      {/* Top Context & API Key Status Bar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Bot className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base sm:text-lg font-black text-white">
              {t.advisor.title}
            </h1>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              {apiKey ? 'Gemini Grounded' : 'Deterministic Offline Engine'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {t.advisor.subtitle}
          </p>
        </div>

        {/* Current Active Context Badge */}
        <div className="flex items-center gap-2">
          {selectedParcel && (
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-brand-400" />
              <span className="font-bold truncate max-w-[140px]">
                {language === 'bn' ? selectedParcel.titleBn : selectedParcel.titleEn}
              </span>
            </div>
          )}

          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Configure optional Gemini API Key (offline engine used by default)"
          >
            <Key className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Optional API Key Drawer */}
      {showKeyInput && (
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 shrink-0 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">
              {language === 'bn' ? 'ঐচ্ছিক জেমিনাই এপিআই কি (Gemini API Key)' : 'Optional Gemini API Key'}
            </span>
            <span className="text-[10px] text-emerald-400">
              {language === 'bn' ? 'এপিআই ছাড়াও সিস্টেম ১০০% অফলাইনে কার্যকর' : '100% Offline-capable without key'}
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 bg-slate-900 text-xs text-white px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-brand-500"
            />
            <button
              onClick={() => setShowKeyInput(false)}
              className="px-3 py-1.5 text-xs font-bold bg-brand-600 text-white rounded-lg"
            >
              {language === 'bn' ? 'সংরক্ষণ' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* Quick Suggested Prompts Pill Row */}
      <div className="shrink-0 space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 block">
          {t.advisor.quickPromptsTitle}
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {t.advisor.quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(prompt)}
              className="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition shrink-0 whitespace-nowrap flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-brand-400" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log Area */}
      <div className="flex-1 overflow-y-auto bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-700 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-4 space-y-2 ${
                isUser 
                  ? 'bg-brand-600 text-white rounded-tr-none' 
                  : 'bg-slate-900 text-slate-100 rounded-tl-none border border-slate-800'
              }`}>
                <div className="text-xs leading-relaxed whitespace-pre-wrap">
                  {language === 'bn' && msg.textBn ? msg.textBn : msg.textEn}
                </div>

                {/* Sources & Citations if available */}
                {msg.sourcesCited && msg.sourcesCited.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex flex-wrap gap-1.5">
                    <span className="font-bold text-slate-400">Sources:</span>
                    {msg.sourcesCited.map((source, sIdx) => (
                      <span key={sIdx} className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {source}
                      </span>
                    ))}
                  </div>
                )}

                {/* Missing Data Warning notice */}
                {msg.dataCoverageNotice && (
                  <div className="text-[10px] text-amber-300 bg-amber-500/10 p-1.5 rounded border border-amber-500/20">
                    ⚠️ <strong>Unverified in field:</strong> {msg.dataCoverageNotice}
                  </div>
                )}

                <div className="text-[9px] text-slate-400 text-right">
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 items-center text-slate-400 text-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce delay-300"></span>
              <span className="text-[11px] ml-1">
                {language === 'bn' ? 'তথ্য যাচাই ও হিসাব করা হচ্ছে...' : 'Synthesizing grounded facts...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* User Input Bar */}
      <div className="shrink-0 space-y-1.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 focus-within:border-brand-500 shadow-xl"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.advisor.placeholder}
            className="flex-1 bg-transparent text-xs sm:text-sm text-white px-3 py-1.5 focus:outline-none placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:hover:bg-brand-600 text-white transition shadow shadow-brand-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-slate-400 text-center px-2">
          {t.advisor.notice}
        </p>
      </div>
    </div>
  );
};
