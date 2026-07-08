import React, { useState } from "react";
import { FAQS } from "../data";
import { ChevronDown, ChevronUp, HelpCircle, FileQuestion, BadgeAlert, Coins } from "lucide-react";

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>("q1");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "pricing" | "services" | "emergencies" | "general">("all");

  const categories = [
    { id: "all", label: "All Questions", icon: <HelpCircle size={14} /> },
    { id: "pricing", label: "Pricing & Quotes", icon: <Coins size={14} /> },
    { id: "services", label: "Our Services", icon: <FileQuestion size={14} /> },
    { id: "emergencies", label: "Emergencies", icon: <BadgeAlert size={14} /> },
  ];

  const filteredFaqs = FAQS.filter(item => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  const toggleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="text-sm font-bold text-primary tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full w-fit mx-auto">
            Got Questions?
          </div>
          <h2 className="text-3xl font-display font-bold text-dark-blue tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Find answers regarding our transparent flat-rate policy, rapid response guarantees, licensing details, and diagnostic process.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id as any);
                setOpenId(null);
              }}
              className={`flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-primary border-primary text-white shadow-md shadow-blue-500/10"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordions List */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`border rounded-2xl transition-all duration-250 ${
                  isOpen 
                    ? "border-blue-200 bg-blue-50/20 shadow-md shadow-blue-50/10" 
                    : "border-slate-100 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-200"
                }`}
              >
                {/* Trigger Row */}
                <button
                  onClick={() => toggleOpen(faq.id)}
                  className="w-full text-left px-5 py-4.5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-dark-blue cursor-pointer"
                >
                  <span className="leading-snug">{faq.question}</span>
                  <div className={`p-1 bg-white border rounded-lg text-slate-400 shadow-sm shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""}`}>
                    <ChevronDown size={16} />
                  </div>
                </button>

                {/* Answer Content */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-blue-50/40">
                    <p className="whitespace-pre-wrap">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Diagnostic Notice box */}
        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 mt-10 text-center text-xs text-slate-500 leading-relaxed max-w-2xl mx-auto">
          💡 Can't find the answers you're looking for? Our live team is on call to address custom HVAC or plumbing diagnostic questions. Ring our dispatch directly at <a href="tel:2065550199" className="text-primary font-bold hover:underline">(206) 555-0199</a> for instant support.
        </div>

      </div>
    </section>
  );
}
