import React, { useState, useEffect } from "react";
import { Calculator, ArrowRight, ArrowLeft, Check, Phone, Calendar, Loader, ShieldAlert } from "lucide-react";
import { Lead } from "../types";

interface PriceCalculatorProps {
  onOpenBooking: () => void;
  preSelectedService?: string;
}

export default function PriceCalculator({ onOpenBooking, preSelectedService }: PriceCalculatorProps) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<"Plumbing" | "HVAC" | "Both" | "">("");
  const [service, setService] = useState("");
  const [urgency, setUrgency] = useState<"Standard" | "Same-day" | "Emergency">("Standard");
  const [propertyType, setPropertyType] = useState("Single-family House");
  const [unitAge, setUnitAge] = useState("5-10 years");
  
  // Lead submission form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("Morning (7AM - 12PM)");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);

  // Automatically adjust services based on selected category
  const servicesMap: Record<string, string[]> = {
    Plumbing: ["General Pipe Repair", "Drain Clog / Rooter Service", "Water Heater Repair", "Water Heater Installation", "Sewer Line Backups", "Sump Pump Repair"],
    HVAC: ["AC is Not Cooling", "Furnace / Heating Outage", "AC Regular Maintenance Tune-Up", "Furnace Annual Tune-Up", "Ductless Mini-Split Install", "Heat Pump Service"],
    Both: ["Leaky Pipe + No Warm Air", "Water Heater + AC Install", "Complete Seasonal Inspections", "Other Plumbing & HVAC Combos"]
  };

  // Pre-select helper from other parts of the UI
  useEffect(() => {
    if (preSelectedService) {
      if (preSelectedService.includes("Plumbing") || preSelectedService.includes("Drain")) {
        setCategory("Plumbing");
        // Find match
        const matchingService = servicesMap.Plumbing.find(s => s.toLowerCase().includes(preSelectedService.split(" ")[0].toLowerCase())) || servicesMap.Plumbing[0];
        setService(matchingService);
      } else if (preSelectedService.includes("AC") || preSelectedService.includes("Furnace") || preSelectedService.includes("Heating") || preSelectedService.includes("HVAC")) {
        setCategory("HVAC");
        const matchingService = servicesMap.HVAC.find(s => s.toLowerCase().includes(preSelectedService.split(" ")[0].toLowerCase())) || servicesMap.HVAC[0];
        setService(matchingService);
      } else {
        setCategory("Both");
        setService(servicesMap.Both[0]);
      }
      setStep(3); // Jump straight to step 3 since category & service is selected
    }
  }, [preSelectedService]);

  const handleCategorySelect = (cat: "Plumbing" | "HVAC" | "Both") => {
    setCategory(cat);
    setService("");
    setStep(2);
  };

  const handleServiceSelect = (srv: string) => {
    setService(srv);
    setStep(3);
  };

  // Calculate estimated range dynamically
  const calculateEstimateRange = (): { min: number; max: number } => {
    let min = 150;
    let max = 300;

    if (service.includes("Pipe Repair")) {
      min = 150; max = 320;
    } else if (service.includes("Drain Clog") || service.includes("Rooter")) {
      min = 99; max = 250;
    } else if (service.includes("Water Heater Repair")) {
      min = 180; max = 450;
    } else if (service.includes("Water Heater Installation")) {
      min = 1200; max = 2800;
    } else if (service.includes("Sewer")) {
      min = 250; max = 800;
    } else if (service.includes("Sump Pump")) {
      min = 200; max = 550;
    } else if (service.includes("AC is Not Cooling")) {
      min = 150; max = 400;
    } else if (service.includes("Furnace / Heating Outage")) {
      min = 120; max = 380;
    } else if (service.includes("Tune-Up") || service.includes("Maintenance")) {
      min = 89; max = 180;
    } else if (service.includes("Mini-Split") || service.includes("Heat Pump")) {
      min = 3500; max = 7500;
    } else if (category === "Both") {
      min = 300; max = 950;
    }

    // Adjust based on urgency multiplier
    if (urgency === "Same-day") {
      min += 50;
      max += 80;
    } else if (urgency === "Emergency") {
      min += 120;
      max += 200;
    }

    // Adjust based on unit age (older units might require deeper diagnostic)
    if (unitAge === "Older than 10 years") {
      min += 20;
      max += 50;
    }

    return { min, max };
  };

  const estimate = calculateEstimateRange();
  const estimateString = `$${estimate.min.toLocaleString()} - $${estimate.max.toLocaleString()}`;

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !zip) return;

    setLoading(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          zip,
          serviceType: `${category} - ${service}`,
          urgency,
          estimatedRange: estimateString,
          preferredDate,
          preferredTime
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSubmittedLead(data.lead);
        setSuccess(true);
        setStep(5);
      }
    } catch (err) {
      console.error("Lead submission error", err);
    } finally {
      setLoading(false);
    }
  };

  const resetCalculator = () => {
    setStep(1);
    setCategory("");
    setService("");
    setUrgency("Standard");
    setName("");
    setPhone("");
    setZip("");
    setSuccess(false);
  };

  return (
    <section id="calculator" className="py-20 bg-brand-bg/40 border-y border-blue-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-primary rounded-full text-xs font-bold tracking-wider uppercase">
            <Calculator size={14} />
            Transparency First
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-dark-blue tracking-tight">
            Interactive Cost Estimator
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Get an instant, realistic pricing range for your repair in under 45 seconds. No credit card, no surprises.
          </p>
        </div>

        {/* Dynamic Wizard Box */}
        <div className="bg-white border border-blue-100/80 rounded-3xl shadow-xl overflow-hidden min-h-[460px] flex flex-col">
          
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1.5 relative">
            <div
              className="bg-primary h-full transition-all duration-300 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>

          {/* Stepper Labels */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>STEP {step} OF 5</span>
            <span className="text-primary font-mono tracking-wider">
              {step === 1 && "CHOOSE SERVICE TYPE"}
              {step === 2 && "SPECIFY SERVICE"}
              {step === 3 && "URGENCY & SYSTEM AGE"}
              {step === 4 && "YOUR COST RANGE & CONFIRMATION"}
              {step === 5 && "ESTIMATE RESERVED!"}
            </span>
          </div>

          {/* Step Contents */}
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
            
            {/* STEP 1: Select Category */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-display font-bold text-dark-blue">
                  What service category do you need help with?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "Plumbing", desc: "Leaky pipes, sewer blocks, water heaters, faucets", color: "from-blue-500 to-indigo-600" },
                    { id: "HVAC", desc: "Air conditioning, furnaces, heat pumps, thermostats", color: "from-orange-500 to-amber-600" },
                    { id: "Both", desc: "Combined heating, air conditioning, and pipe repairs", color: "from-sky-500 to-blue-700" }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id as any)}
                      className={`text-left p-5 border-2 rounded-2xl transition-all duration-200 cursor-pointer hover:border-primary hover:shadow-lg hover:shadow-blue-50 relative group ${
                        category === cat.id ? "border-primary bg-blue-50/40" : "border-slate-200 bg-white"
                      }`}
                    >
                      {category === cat.id && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                      <div className="text-lg font-bold text-dark-blue font-display">{cat.id}</div>
                      <div className="text-xs text-slate-500 mt-2.5 leading-relaxed">{cat.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Select Specific Service */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(1)} className="text-slate-400 hover:text-primary transition-all p-1 hover:bg-slate-50 rounded-lg">
                    <ArrowLeft size={18} />
                  </button>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-dark-blue">
                    Select the specific {category} issue you are facing:
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[250px] overflow-y-auto pr-1">
                  {category && servicesMap[category].map((srv) => (
                    <button
                      key={srv}
                      onClick={() => handleServiceSelect(srv)}
                      className={`text-left p-4 border rounded-xl transition-all hover:bg-slate-50 hover:border-blue-300 font-semibold text-xs sm:text-sm cursor-pointer flex items-center justify-between ${
                        service === srv ? "border-primary bg-blue-50/20 text-primary" : "border-slate-200 text-slate-700"
                      }`}
                    >
                      <span>{srv}</span>
                      <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Select Urgency and Unit Info */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(2)} className="text-slate-400 hover:text-primary transition-all p-1 hover:bg-slate-50 rounded-lg">
                    <ArrowLeft size={18} />
                  </button>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-dark-blue">
                    Select your requested priority & system age:
                  </h3>
                </div>

                <div className="space-y-5">
                  {/* Urgency selection */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2.5">Required Service Urgency</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "Standard", desc: "Next standard appointment slot", fee: "+$0 Standard Rate" },
                        { id: "Same-day", desc: "Priority dispatch within 12 hours", fee: "+$50 Priority Dispatch" },
                        { id: "Emergency", desc: "Immediate dispatch 24/7 (45-90 min)", fee: "+$120 Urgent Emergency" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setUrgency(item.id as any)}
                          className={`p-3 border text-left rounded-xl transition-all cursor-pointer ${
                            urgency === item.id 
                              ? "border-primary bg-blue-50/30 text-dark-blue font-bold shadow-sm" 
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <div className="text-sm font-bold">{item.id}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-1">{item.desc}</div>
                          <div className="text-[10px] text-primary font-bold font-mono mt-1">{item.fee}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Property type and age */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Property Type</label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold text-slate-700 bg-white"
                      >
                        <option>Single-family House</option>
                        <option>Townhouse</option>
                        <option>Apartment / Condo</option>
                        <option>Commercial Property</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">System / Unit Age (Est.)</label>
                      <select
                        value={unitAge}
                        onChange={(e) => setUnitAge(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-semibold text-slate-700 bg-white"
                      >
                        <option>Under 2 years (Newer)</option>
                        <option>2-5 years</option>
                        <option>5-10 years</option>
                        <option>Older than 10 years</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setStep(4)}
                    className="bg-primary hover:bg-primary/95 text-white font-display font-semibold px-6 py-3 rounded-xl flex items-center gap-2 text-sm cursor-pointer shadow-md"
                  >
                    Calculate Final Range
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Estimate results & Lead Submission Form */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(3)} className="text-slate-400 hover:text-primary transition-all p-1 hover:bg-slate-50 rounded-lg">
                    <ArrowLeft size={18} />
                  </button>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-dark-blue">
                    Your Instant Estimate is Ready!
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Estimated Pricing Result Block */}
                  <div className="lg:col-span-5 bg-gradient-to-b from-blue-50 to-brand-bg/40 border border-blue-100 rounded-2xl p-5 text-center space-y-4">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary bg-white border border-blue-200 px-3 py-1 rounded-full">
                      Estimated Cost Range
                    </span>
                    <div className="text-3xl sm:text-4xl font-display font-extrabold text-dark-blue tracking-tight font-mono py-2">
                      {estimateString}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                      Includes diagnostic fee, labor, and standard repair parts. We provide a **guaranteed flat quote** on-site. Diagnostic fee is waived if repair is performed.
                    </div>
                  </div>

                  {/* Lead Reservation Form */}
                  <form onSubmit={handleSubmitLead} className="lg:col-span-7 space-y-3 bg-slate-50 p-4 sm:p-5 border border-slate-100 rounded-2xl">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200/80 pb-2">
                      🔒 Secure This Price Range & Request Booking
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="John Smith"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full border border-slate-200 bg-white rounded-lg p-2.5 text-xs font-semibold text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="(206) 555-0199"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full border border-slate-200 bg-white rounded-lg p-2.5 text-xs font-semibold text-slate-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Zip Code *</label>
                        <input
                          type="text"
                          required
                          placeholder="98101"
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          className="w-full border border-slate-200 bg-white rounded-lg p-2.5 text-xs font-semibold text-slate-700"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Preferred Date</label>
                        <input
                          type="date"
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full border border-slate-200 bg-white rounded-lg p-2.5 text-xs font-semibold text-slate-700"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Preferred Slot</label>
                        <select
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          className="w-full border border-slate-200 bg-white rounded-lg p-2.5 text-xs font-semibold text-slate-700"
                        >
                          <option>Morning (7AM - 12PM)</option>
                          <option>Afternoon (12PM - 5PM)</option>
                          <option>Evening (5PM - 10PM)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-accent hover:bg-accent/95 disabled:bg-accent/50 text-white font-display font-bold py-3.5 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/10 mt-3"
                    >
                      {loading ? (
                        <>
                          <Loader size={16} className="animate-spin" />
                          Reserving Your Quote...
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          Secure My Quote & Book Priority Dispatch
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-slate-400 text-center leading-tight">
                      No commitment required. We will call you within 15 minutes of reservation to confirm availability.
                    </p>
                  </form>

                </div>
              </div>
            )}

            {/* STEP 5: Success state */}
            {step === 5 && (
              <div className="text-center py-8 space-y-6 max-w-xl mx-auto">
                <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Check size={32} strokeWidth={3} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold text-dark-blue">
                    Estimate Lock-In Confirmed!
                  </h3>
                  <p className="text-sm text-slate-600">
                    Thank you, <strong>{name}</strong>! We have reserved your pricing estimate range of <strong className="font-mono text-primary text-base">{estimateString}</strong> for your requested service: <strong className="text-slate-700">{service}</strong>.
                  </p>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 space-y-3 text-left">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert size={14} />
                    Next Steps
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">1.</span>
                      <span>An expert coordinator will call your number <strong className="text-dark-blue font-mono">{phone}</strong> within 10 to 15 minutes to answer questions and dispatch a specialist.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">2.</span>
                      <span>Our certified technician (equipped with shoe covers & tools) will perform a precision diagnostic of your system to confirm the issue.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary">3.</span>
                      <span>You get a guaranteed final flat-rate quote. Upon your approval, they fix it right on the spot!</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href="tel:2065550199"
                    className="flex-1 bg-dark-blue hover:bg-primary text-white py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Phone size={16} />
                    Call to Confirm Now
                  </a>
                  <button
                    onClick={resetCalculator}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                  >
                    Estimate Another Service
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Bottom disclaimer */}
          {step < 5 && (
            <div className="bg-slate-50 border-t border-slate-100 py-3.5 px-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2 font-medium">
              <span>🛡️ All pricing estimations are powered by regional standard flat-rates</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                Seattle Metro Average: Live System Up to Date
              </span>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
