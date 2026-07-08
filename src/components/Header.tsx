import React, { useState, useEffect } from "react";
import { Phone, Calendar, Menu, X, ShieldCheck, Flame, Wrench } from "lucide-react";

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenBooking: () => void;
}

export default function Header({ onNavigate, activeSection, onOpenBooking }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isEmergencyVisible, setIsEmergencyVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", id: "home" },
    { label: "Services", id: "services" },
    { label: "Pricing Calculator", id: "calculator" },
    { label: "Service Area", id: "service-area" },
    { label: "Why Choose Us", id: "why-choose-us" },
    { label: "Reviews", id: "reviews" },
    { label: "FAQ", id: "faq" },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsMenuOpen(false);
  };

  return (
    <div className="w-full fixed top-0 z-50 transition-all duration-300">
      {/* A. Announcement / Emergency Banner */}
      {isEmergencyVisible && (
        <div className="bg-emergency text-white py-2 px-4 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md relative z-50">
          <div className="flex items-center gap-2 mx-auto text-center">
            <span className="animate-pulse">🚨</span>
            <span>
              <strong>24/7 Emergency Service Available:</strong> Warmth, AC, or severe plumbing leaks? Call us immediately:
              <a href="tel:2065550199" className="underline hover:text-orange-200 transition-colors ml-1 font-bold">
                (206) 555-0199
              </a>
            </span>
          </div>
          <button
            onClick={() => setIsEmergencyVisible(false)}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full absolute right-2 sm:right-4 transition-all"
            aria-label="Dismiss Emergency Banner"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* B. Sticky Navigation Header */}
      <header
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-blue-100"
            : "bg-white/90 backdrop-blur-sm py-4 border-b border-blue-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Brand */}
          <div
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="p-2 bg-primary rounded-xl text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md group-hover:shadow-blue-300">
              <div className="relative">
                <Wrench className="w-5 h-5" />
                <Flame className="w-3 h-3 text-accent absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-dark-blue flex items-center gap-1">
                Plumb<span className="text-accent">Flow</span>
              </span>
              <div className="text-[10px] text-gray-500 font-mono tracking-wide -mt-1 flex items-center gap-1">
                <ShieldCheck size={10} className="text-success" />
                LIC# PLUMBFH882K1
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-blue-50 text-primary"
                    : "text-slate-600 hover:text-primary hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="tel:2065550199"
              className="flex items-center gap-2 px-3 py-2 text-primary hover:text-dark-blue transition-colors duration-200"
            >
              <div className="w-9 h-9 bg-brand-bg rounded-full flex items-center justify-center text-primary border border-blue-100">
                <Phone size={16} className="animate-bounce" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider leading-none">
                  Call 24/7
                </div>
                <div className="text-sm font-bold font-display leading-tight">
                  (206) 555-0199
                </div>
              </div>
            </a>

            <button
              onClick={onOpenBooking}
              className="bg-accent hover:bg-accent/90 text-white font-display font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 active:scale-95 transition-all duration-150 flex items-center gap-2 border border-orange-600/10 cursor-pointer text-sm"
            >
              <Calendar size={16} />
              Book Online
            </button>
          </div>

          {/* Mobile Hamburguer Menu Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="tel:2065550199"
              className="p-2.5 bg-brand-bg hover:bg-blue-100 text-primary border border-blue-100 rounded-xl flex items-center justify-center transition-all"
              aria-label="Call Dispatch"
            >
              <Phone size={20} />
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-blue-100 shadow-xl py-4 px-4 flex flex-col gap-2 z-40 animate-in fade-in slide-in-from-top-5 duration-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  activeSection === item.id
                    ? "bg-brand-bg text-primary"
                    : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5 mt-2">
              <a
                href="tel:2065550199"
                className="w-full flex items-center justify-center gap-3 bg-brand-bg border border-blue-200 text-primary py-3 rounded-xl font-bold font-display hover:bg-blue-100 transition-all text-center"
              >
                <Phone size={18} />
                Call 24/7 Support: (206) 555-0199
              </a>
              <button
                onClick={() => {
                  onOpenBooking();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 bg-accent text-white py-3 rounded-xl font-bold font-display hover:bg-accent/90 shadow-lg shadow-orange-500/15 transition-all text-center cursor-pointer"
              >
                <Calendar size={18} />
                Book Appointment Online
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
