import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface LandWiseChatbotProps {
  theme: 'dark' | 'light';
  isBn: boolean;
  selectedDistrictName?: string;
}

const LANDWISE_SYSTEM_PROMPT = `You are LandWise AI, the premier intelligent assistant for the LandWise Bangladesh Spatial Intelligence platform.

ABOUT THIS PLATFORM:
LandWise is Bangladesh's authoritative spatial intelligence and cadastral registry platform. It provides:
- Interactive visualization of all 64 districts and 8 administrative divisions of Bangladesh
- Cadastral survey data, mouza records, and land ownership verification
- Real-time land valuation and price intelligence by district
- Records & Title Chain Graph for ownership history auditing
- Route intelligence between upazilas and district POI analysis
- e-Mutation status tracking and Digital Survey (RS/CS/SA/BS) information
- Flood vulnerability and zoning classification per district
- Economic and investment viability scores for all 64 districts

THE 8 DIVISIONS: Dhaka, Chattogram, Rajshahi, Khulna, Barishal, Sylhet, Rangpur, Mymensingh

KEY FEATURES:
1. MAP PAGE: Interactive vector GIS map, 64-district SVG overlay, satellite view, MapLibre tile rendering
2. GRAPH PAGE: Records & Title Chain Graph — visualizes ownership transfers and title ancestry
3. CADASTRE: Cadastral plot explorer, mouza-level search, RS/CS/SA/BS survey status
4. CALCULATOR: Land area unit converter (katha, decimal, acre, bigha, shotangsho), plot valuation engine
5. MOUZA: Sub-district (mouza/mauza) intelligence, upazila directory, local administrative data

LAND UNITS IN BANGLADESH:
- 1 Decimal = 40.47 sqm ≈ 435.6 sqft
- 1 Katha = 1.65 decimal (standard in Dhaka)
- 1 Bigha = 33 decimal (standard) or 20 decimal (some regions)
- 1 Acre = 100 decimal
- 1 Shotangsho = 1 decimal

COMMON QUERIES YOU SHOULD HELP WITH:
- How to read cadastral records (khatian, CS, RS, SA, BS surveys)
- Understanding land mutation (namjari) process
- Interpreting land classification (agricultural, residential, commercial, khas)
- District-specific land prices and investment intelligence
- How to verify land ownership in Bangladesh
- Understanding mouza numbers and plot numbers
- e-Porcha (land record verification portal) guidance
- RAJUK zoning and development permission information

LANGUAGE: If user writes in Bengali, respond primarily in Bengali. For English queries, respond in English.
TONE: Professional, precise, helpful, grounded.
DISCLAIMER: Always clarify you provide general guidance; for formal legal disputes, users should consult a licensed Advocate or verify with official Sub-Registry office records.`;

const QUICK_PROMPTS = [
  {
    en: 'How to verify land ownership in BD?',
    bn: 'জমির মালিকানা কীভাবে যাচাই করবেন?',
    icon: 'bx-shield-quarter',
  },
  {
    en: 'Explain CS, SA, RS, BS survey records',
    bn: 'CS, SA, RS ও BS খতিয়ান কীভাবে বুঝবেন?',
    icon: 'bx-file-find',
  },
  {
    en: 'How to calculate Katha to Decimal?',
    bn: 'কাঠা থেকে ডেসিমেল রূপান্তর কীভাবে করে?',
    icon: 'bx-calculator',
  },
  {
    en: 'What is e-Mutation (ই-নামজারি) process?',
    bn: 'ই-নামজারি ও খাজনা দাখিলা প্রক্রিয়া কী?',
    icon: 'bx-check-double',
  },
];

export const LandWiseChatbot: React.FC<LandWiseChatbotProps> = ({
  theme,
  isBn,
  selectedDistrictName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    return import.meta.env.VITE_GEMINI_API_KEY || '';
  });
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isLight = theme === 'light';

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHasUnreadNotification(false);
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: isBn
            ? `স্বাগতম! আমি **LandWise AI** — বাংলাদেশের ভূমি রেকর্ড, মৌজা ম্যাপ, খতিয়ান ও জমির বাজারমূল্য বিষয়ে আপনার নির্ভরযোগ্য স্মার্ট সহকারী।${
                selectedDistrictName
                  ? ` বর্তমানে **${selectedDistrictName}** জেলা সংক্রান্ত স্পেশিয়াল ডাটা সংযুক্ত।`
                  : ''
              } আপনি কী বিষয়ে জানতে চান?`
            : `Hello! I'm **LandWise AI** — your intelligent copilot for Bangladesh cadastral records, mouza plots, title verification, and land valuation.${
                selectedDistrictName
                  ? ` Connected with real-time **${selectedDistrictName}** spatial telemetry.`
                  : ''
              } How may I assist your land research today?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, isBn, selectedDistrictName]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const effectiveApiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
      if (!effectiveApiKey) {
        setShowKeyInput(true);
        return;
      }

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      try {
        const genAI = new GoogleGenAI({ apiKey: effectiveApiKey });

        const contextNote = selectedDistrictName
          ? `\n\nCurrent context: User has ${selectedDistrictName} district active in the Bangladesh spatial GIS map.`
          : '';

        const history = messages
          .filter((m) => m.id !== 'welcome')
          .map((m) => ({
            role: m.role === 'user' ? ('user' as const) : ('model' as const),
            parts: [{ text: m.content }],
          }));

        const chat = genAI.chats.create({
          model: 'gemini-2.0-flash',
          config: {
            systemInstruction: LANDWISE_SYSTEM_PROMPT + contextNote,
            maxOutputTokens: 1024,
            temperature: 0.7,
          },
          history,
        });

        const response = await chat.sendMessage({ message: text.trim() });
        const aiText =
          response.text ??
          'I apologize, I could not generate a response at this time. Please try again.';

        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: aiText,
            timestamp: new Date(),
          },
        ]);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : 'Unknown error';
        const isAuthError =
          errMsg.includes('API_KEY') || errMsg.includes('401') || errMsg.includes('403');
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: isAuthError
              ? '⚠️ **Invalid API key.** Please provide a valid Google AI Studio key by clicking the key icon above.'
              : `⚠️ **Connection Error:** ${errMsg}. Please verify your network or try again.`,
            timestamp: new Date(),
          },
        ]);
        if (isAuthError) setShowKeyInput(true);
      } finally {
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 80);
      }
    },
    [input, isLoading, messages, apiKey, selectedDistrictName]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSaveKey = () => {
    if (keyInput.trim()) {
      setApiKey(keyInput.trim());
      setShowKeyInput(false);
      setKeyInput('');
    }
  };

  // Markdown renderer for rich assistant answers
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
      return (
        <p
          key={i}
          className={
            i > 0 && lines[i - 1] === ''
              ? 'mt-2.5'
              : line === ''
              ? 'mt-1'
              : 'leading-relaxed'
          }
        >
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong
                  key={j}
                  className={`font-bold ${
                    isLight ? 'text-[#191817]' : 'text-[#CC5A2B]'
                  }`}
                >
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith('`') && part.endsWith('`')) {
              return (
                <code
                  key={j}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-medium ${
                    isLight
                      ? 'bg-[#FAF0EB] text-[#CC5A2B] border border-[#F3D5C6]'
                      : 'bg-[#1E1E1C] text-[#D4A373] border border-[#2B2A27]'
                  }`}
                >
                  {part.slice(1, -1)}
                </code>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <>
      {/* ── FLOATING TRIGGER BUTTON (EDITORIAL AI COPILOT LAUNCHER) ── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Subtle Invitation Pill (Desktop only) */}
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-[4px] border text-xs font-semibold shadow-editorial backdrop-blur-md transition-all duration-150 hover:scale-105 active:scale-95 ${
              isLight
                ? 'bg-[#FAF9F5]/95 border-[#E8E3DA] text-[#191817] hover:border-[#CC5A2B]'
                : 'bg-[#1E1E1C]/95 border-[#2B2A27] text-[#FAF9F5] hover:border-[#CC5A2B]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#CC5A2B]" />
            <span>{isBn ? 'এআই সহকারীর সাথে কথা বলুন' : 'Ask LandWise AI'}</span>
          </button>
        )}

        {/* Main Floating Trigger Button */}
        <button
          type="button"
          id="chatbot-trigger"
          aria-label="Open LandWise AI Assistant"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`relative w-12 h-12 sm:w-13 sm:h-13 rounded-[6px] flex items-center justify-center transition-all duration-200 shadow-editorial focus:outline-none focus:ring-2 focus:ring-[#CC5A2B]/40 ${
            isOpen
              ? isLight
                ? 'bg-[#191817] text-[#FAF9F5] hover:bg-[#2B2A27]'
                : 'bg-[#FAF9F5] text-[#191817] hover:bg-[#F3EFE8]'
              : 'bg-[#CC5A2B] text-[#FAF9F5] hover:bg-[#B54E24] active:scale-95 border border-[#B54E24]'
          }`}
        >
          {isOpen ? (
            <i className="bx bx-x text-2xl" aria-hidden="true" />
          ) : (
            <div className="relative flex items-center justify-center">
              {/* Modern AI Sparkles Icon */}
              <svg
                className="w-6 h-6 text-[#FAF9F5] drop-shadow-sm animate-in fade-in duration-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                />
              </svg>

              {/* Status Amber / Ivory Notification Dot */}
              {hasUnreadNotification && (
                <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400 border-2 border-[#CC5A2B]"></span>
                </span>
              )}
            </div>
          )}
        </button>
      </div>

      {/* ── CHAT WINDOW (ELEGANT APPLE / BIG-TECH GLASS PANEL) ── */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[380px] sm:w-[410px] max-w-[calc(100vw-24px)] flex flex-col rounded-[6px] border shadow-2xl transition-all duration-300 overflow-hidden backdrop-blur-2xl ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-5 scale-95 pointer-events-none'
        } ${
          isLight
            ? 'bg-white/95 border-[#E8E3DA] text-[#191817] shadow-zinc-900/15'
            : 'bg-[#0E0E12]/95 border-[#2B2A27] text-zinc-100 shadow-black/80'
        }`}
        style={{ height: '560px', maxHeight: 'calc(100vh - 120px)' }}
      >
        {/* ── HEADER ── */}
        <div
          className={`flex items-center justify-between px-4 py-3.5 border-b shrink-0 ${
            isLight
              ? 'bg-[#FAF9F5] border-[#E8E3DA]'
              : 'bg-[#141413] border-[#2B2A27]'
          }`}
        >
          <div className="flex items-center gap-3">
            {/* AI Avatar */}
            <div className="w-9 h-9 rounded-[4px] bg-[#CC5A2B] text-[#FAF9F5] flex items-center justify-center font-bold border border-[#B54E24] shadow-xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold leading-tight tracking-tight">
                  LandWise AI
                </h4>
                {selectedDistrictName && (
                  <span
                    className={`px-2 py-0.5 rounded-[4px] text-[10px] font-semibold border ${
                      isLight
                        ? 'bg-[#F3EFE8] border-[#E8E3DA] text-[#191817]'
                        : 'bg-[#2B2A27] border-[#383632] text-[#FAF9F5]'
                    }`}
                  >
                    📍 {selectedDistrictName}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#CC5A2B] flex items-center gap-1.5 mt-0.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#CC5A2B]" />
                <span>{isLoading ? (isBn ? 'চিন্তা করছে...' : 'Generating...') : 'Gemini 2.0 Flash'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* API Key Modal Button */}
            <button
              type="button"
              title="Google AI Studio API Key"
              onClick={() => setShowKeyInput((p) => !p)}
              className={`w-8 h-8 rounded-[4px] flex items-center justify-center transition-colors ${
                isLight
                  ? 'text-[#706E6B] hover:bg-[#F3EFE8] hover:text-[#191817]'
                  : 'text-[#9E9B95] hover:bg-[#2B2A27] hover:text-zinc-100'
              }`}
            >
              <i className="bx bx-key text-base" aria-hidden="true" />
            </button>

            {/* Clear Conversation */}
            <button
              type="button"
              title="Clear conversation"
              onClick={() => setMessages([])}
              className={`w-8 h-8 rounded-[4px] flex items-center justify-center transition-colors ${
                isLight
                  ? 'text-[#706E6B] hover:bg-[#F3EFE8] hover:text-[#191817]'
                  : 'text-[#9E9B95] hover:bg-[#2B2A27] hover:text-zinc-100'
              }`}
            >
              <i className="bx bx-trash text-base" aria-hidden="true" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              aria-label="Close assistant"
              onClick={() => setIsOpen(false)}
              className={`w-8 h-8 rounded-[4px] flex items-center justify-center transition-colors ${
                isLight
                  ? 'text-[#706E6B] hover:bg-[#F3EFE8] hover:text-[#191817]'
                  : 'text-[#9E9B95] hover:bg-[#2B2A27] hover:text-zinc-100'
              }`}
            >
              <i className="bx bx-chevron-down text-lg" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ── OPTIONAL API KEY BANNER ── */}
        {showKeyInput && (
          <div
            className={`px-4 py-3 border-b text-xs space-y-2 shrink-0 ${
              isLight
                ? 'bg-[#FAF0EB] border-[#F3D5C6] text-[#191817]'
                : 'bg-[#1E1E1C] border-[#2B2A27] text-[#FAF9F5]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-xs text-[#CC5A2B]">
                <i className="bx bx-key text-sm" />
                Google AI Studio Key
              </span>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold underline text-[#CC5A2B] hover:opacity-80"
              >
                Get Free Key →
              </a>
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
                placeholder="AIzaSy..."
                className={`flex-1 px-3 py-1.5 rounded-[4px] border text-xs focus:outline-none font-mono ${
                  isLight
                    ? 'bg-white border-[#E8E3DA] text-[#191817] focus:border-[#CC5A2B]'
                    : 'bg-[#141413] border-[#2B2A27] text-white focus:border-[#CC5A2B]'
                }`}
              />
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-3 py-1.5 rounded-[4px] bg-[#CC5A2B] hover:bg-[#B54E24] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* ── MESSAGE LOG ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 min-h-0 scrollbar-thin">
          {messages.length === 0 && (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-[4px] bg-[#CC5A2B] text-white flex items-center justify-center mx-auto shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                  />
                </svg>
              </div>
              <h5 className="text-xs font-bold">{isBn ? 'কীভাবে সাহায্য করতে পারি?' : 'How can I assist you?'}</h5>
              <p className="text-[11px] text-[#706E6B] max-w-xs mx-auto">
                {isBn
                  ? 'খতিয়ান, মৌজা, নামজারি বা জমির মূল্য বিষয়ে যেকোনো প্রশ্ন লিখুন।'
                  : 'Ask about RS/CS/BS surveys, mouza maps, mutation rules, or district land rates.'}
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-[4px] bg-[#CC5A2B] text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black shadow-xs">
                  AI
                </div>
              )}
              <div
                className={`max-w-[85%] px-3.5 py-2.5 rounded-[4px] text-xs leading-relaxed space-y-1 shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-[#191817] text-[#FAF9F5] rounded-br-xs font-medium'
                    : isLight
                    ? 'bg-zinc-100 text-[#191817] rounded-bl-xs border border-[#E8E3DA]/90'
                    : 'bg-[#18181E] text-zinc-100 rounded-bl-xs border border-[#2B2A27]'
                }`}
              >
                {msg.role === 'assistant' ? renderContent(msg.content) : <p>{msg.content}</p>}
                <p
                  className={`text-[9px] mt-1 font-mono ${
                    msg.role === 'user'
                      ? 'text-[#FAF9F5]/70 text-right'
                      : isLight
                      ? 'text-[#706E6B]'
                      : 'text-[#9E9B95]'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-2.5 flex-row">
              <div className="w-7 h-7 rounded-[4px] bg-[#CC5A2B] text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black">
                AI
              </div>
              <div
                className={`px-4 py-2.5 rounded-[4px] rounded-bl-xs text-xs flex items-center gap-1.5 border ${
                  isLight
                    ? 'bg-[#F3EFE8] border-[#E8E3DA] text-[#706E6B]'
                    : 'bg-[#1E1E1C] border-[#2B2A27] text-[#9E9B95]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#CC5A2B] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#CC5A2B] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#CC5A2B] animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[10px] ml-1 font-medium">{isBn ? 'উপাত্ত বিশ্লেষণ হচ্ছে...' : 'Analyzing telemetry...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── QUICK PROMPT CARDS (SHOWN INITIALLY) ── */}
        {messages.length <= 1 && (
          <div
            className={`px-3.5 pb-2 pt-2.5 border-t shrink-0 space-y-1.5 ${
              isLight ? 'border-[#E8E3DA] bg-[#FAF9F5]' : 'border-[#2B2A27] bg-[#141413]'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#706E6B] block">
              {isBn ? 'সচরাচর জিজ্ঞাসিত প্রশ্নসমূহ' : 'Suggested Inquiries'}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {QUICK_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendMessage(isBn ? p.bn : p.en)}
                  className={`text-left p-2 rounded-[4px] text-[10px] font-medium border transition-all flex items-start gap-1.5 ${
                    isLight
                      ? 'bg-white hover:bg-[#FAF0EB] border-[#E8E3DA] hover:border-[#CC5A2B] text-[#191817] hover:text-[#CC5A2B] shadow-xs'
                      : 'bg-[#1E1E1C] hover:bg-[#2B2A27] border-[#2B2A27] hover:border-[#CC5A2B] text-[#FAF9F5]'
                  }`}
                >
                  <i className={`bx ${p.icon} text-[#CC5A2B] text-xs mt-0.5 shrink-0`} />
                  <span className="line-clamp-2 leading-tight">{isBn ? p.bn : p.en}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── CHAT INPUT ── */}
        <div
          className={`p-3 border-t shrink-0 ${
            isLight ? 'border-[#E8E3DA] bg-white' : 'border-[#2B2A27] bg-[#0E0E12]'
          }`}
        >
          <div
            className={`flex items-center gap-2 rounded-[4px] border px-3 py-2 transition-all shadow-xs focus-within:ring-2 focus-within:ring-[#CC5A2B]/20 ${
              isLight
                ? 'bg-[#FAF9F5] border-[#E8E3DA] focus-within:border-[#CC5A2B]'
                : 'bg-[#16161D] border-[#2B2A27] focus-within:border-[#CC5A2B]'
            }`}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isBn ? 'খতিয়ান, দাগ বা জমি সংক্রান্ত প্রশ্ন লিখুন...' : 'Ask about cadastral plots, surveys, mutation...'}
              disabled={isLoading}
              className={`flex-1 text-xs bg-transparent focus:outline-none placeholder:text-[#706E6B] disabled:opacity-50 ${
                isLight ? 'text-[#191817]' : 'text-white'
              }`}
            />
            <button
              type="button"
              id="chatbot-send"
              aria-label="Send message"
              disabled={!input.trim() || isLoading}
              onClick={() => sendMessage(input)}
              className={`w-8 h-8 rounded-[4px] flex items-center justify-center transition-all shrink-0 shadow-xs ${
                input.trim() && !isLoading
                  ? 'bg-[#191817] text-[#FAF9F5] hover:bg-[#2B2A27] active:scale-95 border border-[#191817]'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-[#9E9B95] dark:text-[#706E6B] cursor-not-allowed opacity-50'
              }`}
            >
              <i className="bx bx-paper-plane text-xs" aria-hidden="true" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[9px] mt-1.5 px-1 text-[#706E6B]">
            <span>Powered by Gemini 2.0 Flash</span>
            <span className="font-mono">{isBn ? 'গোপনীয়তা সংরক্ষিত' : 'Client-Side Telemetry'}</span>
          </div>
        </div>
      </div>
    </>
  );
};
