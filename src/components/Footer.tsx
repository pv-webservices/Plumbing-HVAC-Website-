import React from "react";
import { Wrench, Flame, ShieldCheck, Mail, MapPin, Phone, Clock, ArrowRight } from "lucide-react";

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenBooking: () => void;
}

export default function Footer({ onNavigate, onOpenBooking }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const cities = ["Seattle", "Bellevue", "Tacoma", "Kirkland", "Redmond", "Renton", "Kent", "Everett", "Lynnwood", "Federal Way", "Issaquah", "Sammamish"];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-28 md:pb-16">
      
      {/* Top Banner section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between">
          <div className="md:col-span-8 space-y-2">
            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white">
              Need a certified plumber or heat specialist today?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              We operate emergency service crews across King and Snohomish county 24 hours a day, 7 days a week. Upfront flat pricing is guaranteed.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col sm:flex-row gap-3.5 md:justify-end">
            <a
              href="tel:2065550199"
              className="bg-emergency hover:bg-red-700 text-white font-display font-extrabold px-6 py-3.5 rounded-xl text-center text-sm shadow-lg shadow-red-600/10 transition-all flex items-center justify-center gap-2"
            >
              <Phone size={16} />
              Call Dispatch Now
            </a>
            <button
              onClick={onOpenBooking}
              className="bg-accent hover:bg-accent/90 text-white font-display font-extrabold px-6 py-3.5 rounded-xl text-center text-sm shadow-lg shadow-orange-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Book Service Online
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & SEO Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1 - Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg text-white">
                <Wrench size={18} />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Plumb<span className="text-accent">Flow</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              PlumbFlow is the Pacific Northwest's leading home service contractor. We focus on transparent upfront pricing, certified drug-tested specialists, and same-day restorations.
            </p>

            <div className="text-xs font-mono bg-slate-800 text-slate-400 p-3 rounded-xl border border-slate-700 inline-block">
              <div className="flex items-center gap-1.5 font-bold text-[10px] text-white">
                <ShieldCheck size={13} className="text-success" />
                OFFICIAL LICENSE CODES
              </div>
              <div className="mt-1">Contractor: LIC# PLUMBFH882K1</div>
              <div>Insured, Bonded & Registered</div>
            </div>
          </div>

          {/* Column 2 - Navigation */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Navigate</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
              <li>
                <button onClick={() => onNavigate("home")} className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
                  <ArrowRight size={10} /> Home Page
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("services")} className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
                  <ArrowRight size={10} /> Core Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("calculator")} className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
                  <ArrowRight size={10} /> Cost Estimator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("why-choose-us")} className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
                  <ArrowRight size={10} /> Why Choose Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("reviews")} className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
                  <ArrowRight size={10} /> Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 - Operating Hours & Contacts */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Operating Hours</h4>
            
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-primary shrink-0" />
                <div>
                  <div className="font-bold text-white">Regular Appointment Hours:</div>
                  <div>Monday – Sunday: 7:00 AM – 10:00 PM</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-ping shrink-0"></span>
                <div>
                  <div className="font-bold text-white">Emergency Services:</div>
                  <div className="text-success font-bold">Active 24 Hours / 7 Days / 365</div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <MapPin size={14} className="text-primary shrink-0" />
                <span>Seattle Metro Area (35-mile radius)</span>
              </div>
            </div>
          </div>

          {/* Column 4 - Local SEO list */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Service Cities</h4>
            <div className="flex flex-wrap gap-1.5">
              {cities.map((city) => (
                <span
                  key={city}
                  className="bg-slate-800 text-slate-400 border border-slate-700/60 px-2 py-1 rounded text-[10px] font-bold"
                >
                  📍 {city}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-bold">
        <span>© {currentYear} PlumbFlow HVAC & Plumbing Inc. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#licensing" className="hover:text-primary transition-colors">Affiliations & Licensing</a>
        </div>
      </div>

    </footer>
  );
}
