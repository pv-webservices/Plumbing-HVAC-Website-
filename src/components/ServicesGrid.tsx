import React, { useState } from "react";
import { SERVICES } from "../data";
import { Service } from "../types";
import { Wrench, Droplets, Flame, Wind, Thermometer, AlertTriangle, ArrowRight, CheckCircle2, Calculator, Calendar } from "lucide-react";

interface ServicesGridProps {
  onSelectServiceForCalculator: (serviceTitle: string) => void;
  onOpenBookingWithService: (serviceTitle: string) => void;
}

export default function ServicesGrid({ onSelectServiceForCalculator, onOpenBookingWithService }: ServicesGridProps) {
  const [activeTab, setActiveTab] = useState<"all" | "plumbing" | "hvac">("all");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Map service icon string to lucide components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Wrench":
        return <Wrench className="w-6 h-6" />;
      case "Droplets":
        return <Droplets className="w-6 h-6" />;
      case "Flame":
        return <Flame className="w-6 h-6" />;
      case "Wind":
        return <Wind className="w-6 h-6" />;
      case "Thermometer":
        return <Thermometer className="w-6 h-6" />;
      case "AlertTriangle":
        return <AlertTriangle className="w-6 h-6" />;
      default:
        return <Wrench className="w-6 h-6" />;
    }
  };

  const filteredServices = SERVICES.filter((service) => {
    if (activeTab === "all") return true;
    if (activeTab === "plumbing") {
      return ["plumbing-repair", "drain-cleaning", "water-heaters", "emergency-services"].includes(service.id);
    }
    if (activeTab === "hvac") {
      return ["ac-service", "heating-furnace", "water-heaters", "emergency-services"].includes(service.id);
    }
    return true;
  });

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-sm font-bold text-primary tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full w-fit mx-auto">
            Our Expertise
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark-blue tracking-tight">
            Professional Plumbing & HVAC Services
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            We deliver top-rated heating, cooling, and plumbing services with complete upfront pricing. Select a service to view full specifications, estimate costs, or book online.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex justify-center mt-10">
          <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer ${
                activeTab === "all"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => setActiveTab("plumbing")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer ${
                activeTab === "plumbing"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              Plumbing & Drains
            </button>
            <button
              onClick={() => setActiveTab("hvac")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer ${
                activeTab === "hvac"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              Heating & Cooling (HVAC)
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`group bg-white border border-blue-100/70 hover:border-blue-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                service.id === "emergency-services" ? "ring-2 ring-emergency/10 border-emergency/20 bg-red-50/5" : ""
              }`}
            >
              {service.id === "emergency-services" && (
                <div className="absolute top-0 right-0 bg-emergency text-white text-[10px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-bl-xl shadow-md">
                  24/7 Priority
                </div>
              )}

              <div>
                {/* Service Icon Banner */}
                <div className={`p-4 rounded-2xl w-fit mb-6 transition-all duration-300 ${
                  service.id === "emergency-services" 
                    ? "bg-emergency text-white" 
                    : "bg-blue-50 text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-200"
                }`}>
                  {getIcon(service.icon)}
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-display font-bold text-dark-blue group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                {/* Short Description */}
                <p className="text-sm text-slate-500 mt-2.5 leading-relaxed">
                  {service.shortDesc}
                </p>

                {/* Pricing Preview Badge */}
                <div className="mt-4 flex items-center justify-between text-xs bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                  <span className="text-slate-500 font-medium">Estimated cost:</span>
                  <span className="font-bold font-mono text-primary text-sm">{service.pricingRange}</span>
                </div>

                {/* Bullet checklist highlights */}
                <ul className="mt-5 space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-success mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-4 border-t border-slate-100 space-y-3">
                <button
                  onClick={() => setSelectedService(service)}
                  className="w-full text-center text-xs font-bold text-primary hover:text-dark-blue hover:underline py-1.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Read Full Specifications
                  <ArrowRight size={14} />
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => onSelectServiceForCalculator(service.title)}
                    className="flex items-center justify-center gap-1.5 bg-brand-bg hover:bg-blue-100 text-primary font-bold text-xs py-3 rounded-xl transition-all active:scale-95 cursor-pointer border border-blue-200"
                  >
                    <Calculator size={13} />
                    Estimate
                  </button>
                  <button
                    onClick={() => onOpenBookingWithService(service.title)}
                    className="flex items-center justify-center gap-1.5 bg-accent hover:bg-accent/90 text-white font-bold text-xs py-3 rounded-xl transition-all active:scale-95 cursor-pointer shadow-md shadow-orange-500/10"
                  >
                    <Calendar size={13} />
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Service Specification Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-blue-100 shadow-2xl max-w-2xl w-full p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 bg-slate-50 hover:bg-slate-100 rounded-full transition-all border border-slate-200"
                aria-label="Close specification details"
              >
                <XIcon size={18} />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary text-white rounded-2xl shadow-lg">
                    {getIcon(selectedService.icon)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-dark-blue">{selectedService.title}</h3>
                    <p className="text-xs text-primary font-bold font-mono tracking-wide uppercase mt-0.5">Average Cost: {selectedService.pricingRange}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Service Overview</h4>
                  <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {selectedService.longDesc}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">What's Included in This Service</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedService.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-3 bg-brand-bg/40 border border-blue-100/30 rounded-xl text-xs text-slate-700 font-semibold">
                        <CheckCircle2 size={16} className="text-success shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Disclaimer & Core conversions */}
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-xs text-orange-800 space-y-1">
                  <p className="font-bold">⚠️ Diagnostic Disclaimer:</p>
                  <p className="leading-relaxed text-orange-700">
                    The pricing range listed above is an average estimate for King/Snohomish County. We provide a guaranteed, written, flat-rate quote on-site before doing any repair. If you proceed with the repair, your dispatch diagnostic fee is 100% waived!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      onSelectServiceForCalculator(selectedService.title);
                      setSelectedService(null);
                    }}
                    className="flex-1 bg-brand-bg text-primary border border-blue-200 font-bold font-display py-3 rounded-xl hover:bg-blue-100 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <Calculator size={16} />
                    Run Price Calculator
                  </button>
                  <button
                    onClick={() => {
                      onOpenBookingWithService(selectedService.title);
                      setSelectedService(null);
                    }}
                    className="flex-1 bg-accent text-white font-bold font-display py-3 rounded-xl hover:bg-accent/90 shadow-lg shadow-orange-500/15 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <Calendar size={16} />
                    Book Dispatch Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

// Simple internal X icon helper to keep it isolated
function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
