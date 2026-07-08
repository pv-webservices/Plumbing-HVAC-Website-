import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Phone, Calendar, ShieldCheck, AlertTriangle, Sparkles } from "lucide-react";
import { Message } from "../types";

interface ChatbotProps {
  onOpenBooking: () => void;
  onSelectCalculator: () => void;
}

export default function Chatbot({ onOpenBooking, onSelectCalculator }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! I am your **PlumbFlow Assistant**. How can I help you with your plumbing or HVAC system today? 🛠️",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasPulse, setHasPulse] = useState(true);

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages are updated
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Handle dismiss pulse indicator on click
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setHasPulse(false);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    // Look for emergency keywords before sending to server for safety fallback
    const lowerText = text.toLowerCase();
    const isEmergency = lowerText.includes("leak") || lowerText.includes("flood") || lowerText.includes("burst") || lowerText.includes("emergency") || lowerText.includes("no heat") || lowerText.includes("no air") || lowerText.includes("gas");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6) // Send recent message history
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: Message = {
          role: "assistant",
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isEmergency
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error("Failed to get response");
      }
    } catch (err) {
      // Offline fallback
      const assistantMsg: Message = {
        role: "assistant",
        text: isEmergency 
          ? "⚠️ **EMERGENCY RESPONSE PROTOCOL:** Active leaks, flooding, or heat outages should bypass small talk. Please call our 24/7 dispatcher immediately at **(206) 555-0199** so we can send a technician right now!"
          : "Thanks! We've received your request. You can also reach our friendly coordinators anytime at **(206) 555-0199** or book/calculate on this page.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergency
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  // Helper render of markdown links or bold tags in chats
  const formatText = (text: string) => {
    // Simple bold markdown converter: **text** -> <strong>text</strong>
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="font-extrabold text-slate-800">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Expanded Chatbot Window */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[380px] h-[500px] bg-white rounded-3xl border border-blue-100 shadow-2xl flex flex-col overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Chat Window Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white/10 rounded-xl flex items-center justify-center relative">
                <Sparkles size={18} className="text-amber-300 animate-spin" style={{ animationDuration: "12s" }} />
                <span className="w-2 h-2 rounded-full bg-success absolute -bottom-0.5 -right-0.5 border border-primary"></span>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm">PlumbFlow Live Support</h4>
                <div className="text-[10px] text-blue-100 flex items-center gap-1">
                  <ShieldCheck size={11} className="text-success" />
                  Licensed & Online
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all"
              aria-label="Close Assistant Chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Thread list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[85%] ${
                  msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm border ${
                    msg.role === "user"
                      ? "bg-primary text-white border-primary"
                      : msg.isEmergency 
                        ? "bg-red-50 border-red-200 text-red-950"
                        : "bg-white border-blue-50 text-slate-700"
                  }`}
                >
                  {/* Handle emergency visual flags */}
                  {msg.isEmergency && (
                    <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-red-200 text-red-700 font-extrabold text-[10px] uppercase tracking-wider">
                      <AlertTriangle size={12} className="text-red-600 animate-bounce" />
                      Critical Dispatch Recommended
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{formatText(msg.text)}</p>
                </div>
                <span className="text-[9px] text-slate-400 font-bold mt-1 font-mono tracking-wide px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs px-2 py-1 animate-pulse">
                <span className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </span>
                <span>PlumbFlow is typing...</span>
              </div>
            )}
            
            <div ref={messageEndRef} />
          </div>

          {/* Quick-reply actions strip */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white flex flex-wrap gap-1.5">
            <button
              onClick={() => handleSendMessage("Do you serve my city? What is your service area?")}
              className="px-2.5 py-1 text-[10px] font-bold text-primary bg-blue-50 hover:bg-blue-100 rounded-full border border-blue-100 transition-all cursor-pointer"
            >
              🗺️ Service Area
            </button>
            <button
              onClick={() => handleSendMessage("How much does a typical repair estimate range cost?")}
              className="px-2.5 py-1 text-[10px] font-bold text-primary bg-blue-50 hover:bg-blue-100 rounded-full border border-blue-100 transition-all cursor-pointer"
            >
              💰 Average Pricing
            </button>
            <button
              onClick={() => {
                onOpenBooking();
                setIsOpen(false);
              }}
              className="px-2.5 py-1 text-[10px] font-bold text-accent bg-orange-50 hover:bg-orange-100 rounded-full border border-orange-100 transition-all cursor-pointer flex items-center gap-1"
            >
              <Calendar size={10} />
              Book Online
            </button>
            <button
              onClick={() => handleSendMessage("My water heater is leaking water! Can you help?")}
              className="px-2.5 py-1 text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-full border border-red-100 transition-all cursor-pointer flex items-center gap-1"
            >
              ⚠️ Emergency!
            </button>
          </div>

          {/* Chat Window Footer Input Form */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-slate-150 flex items-center gap-2 bg-slate-50">
            <input
              type="text"
              placeholder="Ask about prices, warranty, areas..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 border border-slate-200 focus:border-primary bg-white rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none"
            />
            <button
              type="submit"
              className="p-2.5 bg-primary hover:bg-dark-blue text-white rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-md shadow-blue-500/10"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </form>

        </div>
      )}

      {/* Floating Toggle Bubble Launcher */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 bg-accent hover:bg-accent/95 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer border border-orange-600/15 relative group"
        aria-label="Open support chat assistant"
      >
        {/* Dynamic pulse aura */}
        {hasPulse && (
          <span className="absolute -inset-1 bg-accent rounded-full opacity-30 animate-ping"></span>
        )}
        
        {isOpen ? (
          <X size={26} />
        ) : (
          <div className="relative">
            <MessageSquare size={26} />
            <span className="w-3 h-3 bg-success rounded-full border-2 border-accent absolute -top-1 -right-1"></span>
          </div>
        )}
        
        {/* Bubble tooltip display */}
        {!isOpen && hasPulse && (
          <div className="absolute right-full mr-3.5 bg-slate-900 text-white font-semibold text-xs py-1.5 px-3 rounded-xl shadow-lg border border-slate-800 whitespace-nowrap hidden sm:flex items-center gap-1.5 animate-bounce">
            <span className="text-[10px]">🛠️ Need a quote? Ask me!</span>
          </div>
        )}
      </button>

    </div>
  );
}
