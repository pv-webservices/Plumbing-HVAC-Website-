import React from "react";
import { Phone, Calculator, ShieldCheck, Star, Award, Clock } from "lucide-react";

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  onOpenBooking: () => void;
}

export default function Hero({ onNavigate, onOpenBooking }: HeroProps) {
  return (
    <section id="home" className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-blue-50/60 via-white to-white relative overflow-hidden">
      {/* Decorative subtle grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#bfdbfe_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Conversion Message */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100/80 border border-blue-200 text-primary rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              24/7 Priority Emergency Service in Seattle Metro
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display font-bold tracking-tight text-dark-blue leading-[1.1] clamp-text">
              Fast, Honest <span className="text-primary">Plumbing & HVAC</span> Repair — Same-Day Service Guaranteed
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Serving our neighbors with upfront, flat-rate pricing and drug-tested, background-checked technicians. From severe leaks and broken water heaters to central AC and heating replacements — we're on our way.
            </p>

            {/* Main Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => onNavigate("calculator")}
                className="bg-accent hover:bg-accent/95 text-white font-display font-semibold px-6 py-4 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-150 flex items-center justify-center gap-2 text-base md:text-lg cursor-pointer"
              >
                <Calculator size={20} />
                Get Instant Price Estimate
              </button>
              
              <a
                href="tel:2065550199"
                className="bg-white hover:bg-blue-50 text-dark-blue border-2 border-blue-200 hover:border-primary font-display font-semibold px-6 py-4 rounded-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-150 flex items-center justify-center gap-2 text-base md:text-lg text-center"
              >
                <Phone size={20} className="text-primary animate-pulse" />
                Call Dispatch: (206) 555-0199
              </a>
            </div>

            {/* Quick Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-blue-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-primary rounded-lg">
                  <ShieldCheck size={18} />
                </div>
                <div className="text-xs font-semibold text-slate-700">Licensed & Bonded</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-primary rounded-lg">
                  <Clock size={18} />
                </div>
                <div className="text-xs font-semibold text-slate-700">Same-Day Availability</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-primary rounded-lg">
                  <Award size={18} />
                </div>
                <div className="text-xs font-semibold text-slate-700">100% Satisfaction</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-primary rounded-lg">
                  <div className="flex text-yellow-500">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-700">5-Star Google Rating</div>
              </div>
            </div>
          </div>

          {/* Right Column - Technician Badge Card and Quick booking overview */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative glowing ring */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary to-accent rounded-3xl opacity-10 blur-xl"></div>
              
              {/* Main Card Graphic representing real technician focus */}
              <div className="relative bg-white border border-blue-100 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
                
                {/* Tech image container and online status badge */}
                <div className="relative flex items-center gap-4 pb-4 border-b border-blue-50">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=300"
                      alt="Expert PlumbFlow Technician"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl border-2 border-primary/20"
                    />
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-success border-2 border-white rounded-full animate-pulse" title="Technician Dispatch Active"></span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-dark-blue">Marcus Rivera</h3>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Senior HVAC & Plumbing Specialist</p>
                    <div className="flex items-center gap-1.5 mt-1 bg-blue-50 text-primary px-2.5 py-0.5 rounded-full w-fit">
                      <ShieldCheck size={14} />
                      <span className="text-[11px] font-bold">Background Checked & Certified</span>
                    </div>
                  </div>
                </div>

                {/* Local Stats inside card */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-brand-bg/60 border border-blue-100/50 rounded-2xl">
                    <div className="text-2xl font-bold font-display text-primary">45 Min</div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">Avg Response Time</div>
                  </div>
                  <div className="p-3 bg-brand-bg/60 border border-blue-100/50 rounded-2xl">
                    <div className="text-2xl font-bold font-display text-success">15,000+</div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">Jobs Completed</div>
                  </div>
                </div>

                {/* Instant Action form starter within Hero card */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                    <span>Need real-time scheduling?</span>
                    <span className="text-primary font-bold">24 Available Slots Today</span>
                  </div>
                  
                  <button
                    onClick={onOpenBooking}
                    className="w-full bg-dark-blue hover:bg-primary text-white font-display font-bold py-3 px-4 rounded-xl text-sm transition-all duration-150 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    Schedule Dispatch Now
                  </button>
                  <p className="text-[11px] text-center text-slate-400">
                    No-risk scheduling. Pay nothing online.
                  </p>
                </div>

              </div>
              
              {/* Floaters */}
              <div className="absolute -top-4 -right-4 bg-accent text-white font-display font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg rotate-6 animate-bounce hidden sm:block">
                $50 OFF New Water Heaters!
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
