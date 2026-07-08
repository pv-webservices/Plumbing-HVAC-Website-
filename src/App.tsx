import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ServicesGrid from "./components/ServicesGrid";
import PriceCalculator from "./components/PriceCalculator";
import BookingForm from "./components/BookingForm";
import Chatbot from "./components/Chatbot";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

// Icons for Trust Section and Differentiators
import { 
  ShieldCheck, Star, Users, Award, Clock, ArrowRight, CheckCircle2, 
  MapPin, Check, Phone, PhoneCall, Calendar, HelpCircle, AlertTriangle, 
  Flame, Wrench, RefreshCw, Sparkles, Building, Briefcase, ThumbsUp 
} from "lucide-react";
import { TESTIMONIALS, SERVICE_AREAS } from "./data";
import { Booking, Lead } from "./types";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preSelectedService, setPreSelectedService] = useState<string | undefined>(undefined);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | undefined>(undefined);
  
  // Service Area Lookup States
  const [zipQuery, setZipQuery] = useState("");
  const [zipResult, setZipResult] = useState<"serviceable" | "out-of-range" | "idle">("idle");
  const [serviceableCity, setServiceableCity] = useState("");

  // Live admin feedback metrics
  const [liveBookingsCount, setLiveBookingsCount] = useState(1);
  const [liveLeadsCount, setLiveLeadsCount] = useState(0);

  // Monitor screen scroll to update active navigations
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      const sections = ["home", "services", "calculator", "service-area", "why-choose-us", "reviews", "faq"];
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync count of bookings and leads in the background
  const fetchCounts = async () => {
    try {
      const bookRes = await fetch("/api/bookings");
      if (bookRes.ok) {
        const books = await bookRes.json();
        setLiveBookingsCount(books.length);
      }
      const leadRes = await fetch("/api/leads");
      if (leadRes.ok) {
        const leads = await leadRes.json();
        setLiveLeadsCount(leads.length);
      }
    } catch (e) {
      console.log("Stats syncing skipped offline");
    }
  };

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 8000);
    return () => clearInterval(interval);
  }, []);

  // Page smooth navigations
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Trigger service category estimate from Services grid
  const handleSelectServiceForCalculator = (serviceTitle: string) => {
    setPreSelectedService(serviceTitle);
    handleNavigate("calculator");
  };

  // Trigger booking with pre-filled service selected
  const handleOpenBookingWithService = (serviceTitle: string) => {
    setSelectedServiceForBooking(serviceTitle);
    setIsBookingModalOpen(true);
  };

  // Handlers for Zip lookup widget
  const handleZipLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanZip = zipQuery.trim();
    if (!cleanZip) return;

    // Find if zip code exists in data
    const matchedCity = SERVICE_AREAS.find((area) => 
      area.zipCodes.includes(cleanZip)
    );

    if (matchedCity) {
      setServiceableCity(matchedCity.name);
      setZipResult("serviceable");
    } else {
      setZipResult("out-of-range");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] relative flex flex-col justify-between selection:bg-primary selection:text-white">
      
      {/* 1. Sticky Nav and Emergency Banner Header */}
      <Header 
        onNavigate={handleNavigate} 
        activeSection={activeSection} 
        onOpenBooking={() => {
          setSelectedServiceForBooking(undefined);
          setIsBookingModalOpen(true);
        }} 
      />

      <main className="flex-1">
        
        {/* 2. Above the fold Benefit Driven Hero Section */}
        <Hero 
          onNavigate={handleNavigate} 
          onOpenBooking={() => {
            setSelectedServiceForBooking(undefined);
            setIsBookingModalOpen(true);
          }} 
        />

        {/* 3. Section D: Trust Bar (logo strip & count metrics) */}
        <section className="bg-slate-900 text-white py-8 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center items-center">
              
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-white flex items-center justify-center gap-1">
                  <Star size={20} fill="currentColor" className="text-yellow-400" />
                  15+ Yrs
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Serving Seattle Metro
                </div>
              </div>

              <div className="space-y-1 border-l border-slate-800">
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                  98.9%
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  On-Time Dispatch Rate
                </div>
              </div>

              <div className="space-y-1 border-l border-slate-800">
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-accent">
                  $0 Down
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Flexible Project Financing
                </div>
              </div>

              <div className="space-y-1 border-l border-slate-800">
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-success flex items-center justify-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-success rounded-full animate-ping"></span>
                  Active
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {liveBookingsCount + liveLeadsCount > 1 
                    ? `${liveBookingsCount + liveLeadsCount} Local Jobs Booked Today` 
                    : "Crews Ready for Dispatch"}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Section E: Dynamic Services Grid */}
        <ServicesGrid 
          onSelectServiceForCalculator={handleSelectServiceForCalculator}
          onOpenBookingWithService={handleOpenBookingWithService}
        />

        {/* 5. Section F: Multi-step Price Calculator */}
        <PriceCalculator 
          onOpenBooking={() => setIsBookingModalOpen(true)}
          preSelectedService={preSelectedService}
        />

        {/* 6. Section G: "Why Choose Us" Differentiators */}
        <section id="why-choose-us" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <div className="text-sm font-bold text-primary tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full w-fit mx-auto">
                Our Standards
              </div>
              <h2 className="text-3xl font-display font-bold text-dark-blue tracking-tight">
                Why Seattle Homeowners Recommend PlumbFlow
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                We aren't just another service contractor. We hold ourselves to absolute standards of high-converting, trust-first workmanship and total customer peace of mind.
              </p>
            </div>

            {/* Differentiators Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Upfront Flat-Rate Pricing",
                  desc: "We price by the job, not by the hour. You'll know the exact penny required for your repair before any technician unscrews a single part.",
                  icon: <Briefcase className="w-6 h-6 text-primary" />,
                },
                {
                  title: "Licensed & Insured Technicians",
                  desc: "Our specialists are rigorously trained, fully certified, background-checked, and random drug-tested to safeguard your household.",
                  icon: <ShieldCheck className="w-6 h-6 text-primary" />,
                },
                {
                  title: "Same-Day / Emergency Restorations",
                  desc: "When an active flood or broken furnace hits, every minute counts. We keep immediate diagnostic dispatch ready around the clock.",
                  icon: <Clock className="w-6 h-6 text-primary" />,
                },
                {
                  title: "100% Satisfaction Guarantee",
                  desc: "If your system isn't running perfectly, we will return and fix it free. Most parts and labor come backed with robust 1-year warranties.",
                  icon: <Award className="w-6 h-6 text-primary" />,
                },
                {
                  title: "Background Checked Staff",
                  desc: "We only hire technicians we would trust inside our own parents' homes. Polite, drug-tested, clean-cut, and extremely helpful.",
                  icon: <Users className="w-6 h-6 text-primary" />,
                },
                {
                  title: "0% APR Financing Available",
                  desc: "No need to stress about sudden water heater failures or HVAC overhauls. We offer low-interest financing to fit any family budget.",
                  icon: <ThumbsUp className="w-6 h-6 text-primary" />,
                }
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300">
                  <div className="p-3 bg-white rounded-2xl w-fit shadow-sm border border-slate-150">
                    {item.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg text-dark-blue">{item.title}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 7. Section H: How It Works Process */}
        <section className="py-20 bg-brand-bg/30 border-y border-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl font-display font-bold text-dark-blue tracking-tight">
                Our 4-Step Hassle-Free Process
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Here is exactly what to expect from the moment you book online or ring our dispatch.
              </p>
            </div>

            {/* Timeline Steps layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {[
                {
                  step: "01",
                  title: "Book Online or Call",
                  desc: "Use our 45-second Price Calculator or Scheduler tool to reserve your priority dispatch time slot in real-time.",
                  color: "bg-blue-100 border-blue-200"
                },
                {
                  step: "02",
                  title: "Confirm & Dispatch",
                  desc: "We confirm your location via SMS and dispatch our technician. They call you when they are exactly 20 minutes away.",
                  color: "bg-orange-100 border-orange-200"
                },
                {
                  step: "03",
                  title: "Guaranteed Quote First",
                  desc: "Our tech performs an expert diagnostic & presents a clear, flat-rate quote. No work starts without your signature.",
                  color: "bg-blue-100 border-blue-200"
                },
                {
                  step: "04",
                  title: "Job Done, Restored!",
                  desc: "We complete the work neat and clean, clean up our tracks, and leave your system running with a full warranty.",
                  color: "bg-emerald-100 border-emerald-200"
                }
              ].map((item, idx) => (
                <div key={idx} className="relative space-y-3 bg-white p-6 rounded-3xl border border-blue-100/50 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-black text-slate-200">{item.step}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-primary/20"></span>
                  </div>
                  <h3 className="font-display font-bold text-base text-dark-blue">{item.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 8. Section I: Testimonials and Customer Social Proof */}
        <section id="reviews" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <div className="text-sm font-bold text-primary tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full w-fit mx-auto">
                Social Proof
              </div>
              <h2 className="text-3xl font-display font-bold text-dark-blue tracking-tight">
                Loved By Seattle Homeowners
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                We have over 1,800+ 5-star reviews on Google, Yelp, and Angi. Read actual customer experiences below.
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {TESTIMONIALS.map((t) => (
                <div key={t.id} className="bg-slate-50 border border-slate-100 p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-6 hover:shadow-lg transition-all duration-200">
                  <div className="space-y-4">
                    {/* Stars and service badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex text-yellow-500">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-primary bg-blue-100/50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        🛠️ {t.servicePerformed}
                      </span>
                    </div>

                    {/* Testimonial Quote body */}
                    <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed">
                      "{t.text}"
                    </p>
                  </div>

                  {/* Customer Identity */}
                  <div className="flex items-center gap-3.5 border-t border-slate-200/50 pt-4">
                    <img
                      src={t.avatarUrl}
                      alt={t.name}
                      className="w-10 h-10 object-cover rounded-full border border-blue-200"
                    />
                    <div>
                      <h4 className="font-display font-bold text-xs sm:text-sm text-dark-blue">{t.name}</h4>
                      <p className="text-[11px] text-slate-400 font-bold">{t.location} — Verified Reviewer</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Google review badges row */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 max-w-3xl mx-auto text-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-700">Excellent 4.9 out of 5 stars based on 1,844 ratings</span>
              </div>
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
              <a
                href="https://google.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Read all Seattle Google Reviews
                <ArrowRight size={14} />
              </a>
            </div>

          </div>
        </section>

        {/* 9. Section J: Service Area Lookup & Interactive Map */}
        <section id="service-area" className="py-20 bg-brand-bg/25 border-y border-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Interactive Zip Search and Info */}
              <div className="lg:col-span-6 space-y-6 text-left">
                <div className="text-sm font-bold text-primary tracking-wider uppercase bg-blue-100 px-3 py-1 rounded-full w-fit">
                  Local SEO Coverage
                </div>
                
                <h2 className="text-3xl font-display font-bold text-dark-blue tracking-tight">
                  Our Plumbing & HVAC Service Radius
                </h2>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  We service King, Snohomish, and northern Pierce county with fully stocked dispatch trucks. Want to guarantee your home is in range of same-day arrival? Enter your zip code below for instant confirmation!
                </p>

                {/* Zip query form */}
                <form onSubmit={handleZipLookup} className="bg-white border border-blue-100 p-2.5 rounded-2xl shadow-md flex items-center gap-2.5 max-w-md">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Enter 5-digit zip code (e.g. 98101)"
                      value={zipQuery}
                      onChange={(e) => {
                        setZipQuery(e.target.value);
                        setZipResult("idle");
                      }}
                      className="w-full pl-10 pr-3 py-2.5 outline-none text-xs sm:text-sm font-semibold text-slate-700 bg-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-accent hover:bg-accent/90 text-white font-display font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    Check Area
                  </button>
                </form>

                {/* Search result highlights */}
                {zipResult === "serviceable" && (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex gap-3 text-xs sm:text-sm font-semibold animate-in fade-in duration-200">
                    <CheckCircle2 className="shrink-0 text-emerald-600 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-emerald-950">🎉 Yes! {zipQuery} is fully serviceable.</span>
                      <p className="text-emerald-700 font-medium text-xs mt-0.5">We have active crews servicing <strong>{serviceableCity}</strong> today. Our standard dispatch wait is under 90 minutes!</p>
                    </div>
                  </div>
                )}

                {zipResult === "out-of-range" && (
                  <div className="p-4 bg-orange-50 border border-orange-100 text-orange-800 rounded-2xl flex gap-3 text-xs sm:text-sm font-semibold animate-in fade-in duration-200">
                    <AlertTriangle className="shrink-0 text-orange-600 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-orange-950">We are currently outside {zipQuery}.</span>
                      <p className="text-orange-700 font-medium text-xs mt-0.5">However, for larger system replacements or scheduled water heater jobs, we may make special exceptions. Please call <a href="tel:2065550199" className="underline font-bold text-dark-blue">(206) 555-0199</a> to request support.</p>
                    </div>
                  </div>
                )}

                {/* Cities Bullets */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Major Serviced Centers</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold text-slate-700">
                    <div className="flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-2 rounded-xl">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Seattle Area
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-2 rounded-xl">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Bellevue / Eastside
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-2 rounded-xl">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Tacoma South
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-2 rounded-xl">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Kirkland / Redmond
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-2 rounded-xl">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Renton / Kent
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-2 rounded-xl">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Everett North
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Visual Maps Overlay vector graphic */}
              <div className="lg:col-span-6 relative">
                <div className="relative mx-auto max-w-md bg-white border border-blue-100 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin size={14} className="text-primary" />
                      King & Snohomish Coverage Ring
                    </span>
                    <span className="text-[10px] bg-success/10 text-success font-extrabold px-2 py-0.5 rounded-full">
                      Crews Active
                    </span>
                  </div>

                  {/* Elegant Simulated SVG map indicating Seattle sound coverage */}
                  <div className="relative w-full h-64 bg-blue-50/50 rounded-2xl border border-blue-150 overflow-hidden flex items-center justify-center">
                    
                    {/* SVG map grid contours and mock boundaries */}
                    <svg className="absolute inset-0 w-full h-full text-blue-200/50" viewBox="0 0 400 300" fill="none" stroke="currentColor">
                      {/* Grid contour */}
                      <path d="M50 0 C50 100, 150 150, 120 300" strokeWidth="2" strokeDasharray="4 4" />
                      <path d="M120 0 C180 120, 220 200, 200 300" strokeWidth="2" strokeDasharray="4 4" />
                      
                      {/* Simulated coast line */}
                      <path d="M100 -20 Q120 80 80 150 T130 320" fill="none" stroke="#93c5fd" strokeWidth="4" />
                      
                      {/* Core service coverage circle boundary */}
                      <circle cx="210" cy="140" r="95" fill="#3b82f6" fillOpacity="0.06" stroke="#2563eb" strokeWidth="2" strokeDasharray="3 3" />
                      
                      {/* Sub-areas coverage */}
                      <circle cx="210" cy="140" r="115" fill="#ea580c" fillOpacity="0.02" stroke="#ea580c" strokeWidth="1" strokeDasharray="5 5" />
                    </svg>

                    {/* Active Dispatch pins on map overlay */}
                    <div className="absolute top-12 left-1/3 flex flex-col items-center">
                      <div className="w-3.5 h-3.5 bg-primary border-2 border-white rounded-full animate-bounce shadow-md flex items-center justify-center text-[8px] text-white font-black">
                        P
                      </div>
                      <span className="bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow mt-1">Everett Crew</span>
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="w-5 h-5 bg-accent border-2 border-white rounded-full animate-pulse shadow-lg flex items-center justify-center text-[10px] text-white font-black">
                        ★
                      </div>
                      <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-md mt-1">Seattle HQ</span>
                    </div>

                    <div className="absolute bottom-16 right-1/4 flex flex-col items-center">
                      <div className="w-3.5 h-3.5 bg-primary border-2 border-white rounded-full animate-bounce shadow-md flex items-center justify-center"></div>
                      <span className="bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow mt-1">Bellevue Crew</span>
                    </div>

                    <div className="absolute bottom-8 left-1/4 flex flex-col items-center">
                      <div className="w-3.5 h-3.5 bg-primary border-2 border-white rounded-full animate-bounce shadow-md flex items-center justify-center"></div>
                      <span className="bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow mt-1">Tacoma Crew</span>
                    </div>

                    {/* Zoom details box */}
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md border border-slate-150 px-2.5 py-1.5 rounded-lg text-[9px] font-bold text-slate-500">
                      🔵 Blue Ring: 35-Mile Same Day
                    </div>

                  </div>

                  <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                    Our trucks are pre-stocked with thousands of OEM parts for Rheem, Carrier, Trane, Bradford White, Lennox, and other brands.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 10. Section L: FAQ Accordion Component */}
        <FAQ />

        {/* 11. Section M: Final CTA Banner */}
        <section className="bg-primary text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold tracking-tight">
              Ready to Book? Let's Get Your Comfort Back on Track
            </h2>
            <p className="text-blue-100 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
              Don't wait for your issue to become a costly renovation. Use our secure booking tool or call our 24/7 coordinators right now.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-accent hover:bg-accent/95 text-white font-display font-bold px-8 py-4 rounded-xl shadow-xl shadow-orange-600/20 active:scale-95 transition-all text-sm cursor-pointer"
              >
                Book Dispatch Online
              </button>
              <a
                href="tel:2065550199"
                className="bg-white hover:bg-blue-50 text-dark-blue font-display font-bold px-8 py-4 rounded-xl shadow-md active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Phone size={16} className="animate-bounce" />
                Call (206) 555-0199
              </a>
            </div>

            <p className="text-[11px] text-blue-200">
              ⚡ Over 24 active crews on duty across Seattle Metro for rapid same-day response.
            </p>
          </div>
        </section>

      </main>

      {/* 12. Persistent Footer */}
      <Footer 
        onNavigate={handleNavigate} 
        onOpenBooking={() => {
          setSelectedServiceForBooking(undefined);
          setIsBookingModalOpen(true);
        }} 
      />

      {/* 13. Persistent Chatbot Bubble (Floating Bottom-Right) */}
      <Chatbot 
        onOpenBooking={() => setIsBookingModalOpen(true)}
        onSelectCalculator={() => handleNavigate("calculator")}
      />

      {/* 14. Section O: Sticky mobile bottom split bar */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl p-3 grid grid-cols-2 gap-3.5">
        <a
          href="tel:2065550199"
          className="bg-primary hover:bg-dark-blue text-white font-display font-bold py-3 px-4 rounded-xl text-xs text-center flex items-center justify-center gap-1.5 shadow-md"
        >
          <PhoneCall size={14} className="animate-pulse" />
          Call Support
        </a>
        <button
          onClick={() => {
            setSelectedServiceForBooking(undefined);
            setIsBookingModalOpen(true);
          }}
          className="bg-accent hover:bg-accent/95 text-white font-display font-bold py-3 px-4 rounded-xl text-xs text-center flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/15 cursor-pointer"
        >
          <Calendar size={14} />
          Book Online
        </button>
      </div>

      {/* 15. Scheduling Modal Overlay Dialog */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-blue-100 shadow-2xl max-w-2xl w-full p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-50 hover:bg-slate-100 rounded-full transition-all border border-slate-200 cursor-pointer"
              aria-label="Close Scheduling Modal"
            >
              {/* Custom SVG closing tag */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-xl sm:text-2xl font-display font-bold text-dark-blue">
                  Schedule Your Appointment
                </h3>
                <p className="text-slate-500 text-xs">
                  Pick an exact hours slot. Paid nothing online. Cancel 100% free.
                </p>
              </div>

              {/* Secure booking scheduler form */}
              <BookingForm 
                initialService={selectedServiceForBooking || "General Pipe Repair"} 
                onSuccess={() => {
                  // Keep open or let the success screen handle itself
                }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
