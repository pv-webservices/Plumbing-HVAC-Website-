import React, { useState } from "react";
import { Calendar, Clock, User, Phone, MapPin, Check, Mail, Info, FileText, AlertTriangle, Loader2 } from "lucide-react";
import { Booking } from "../types";

interface BookingFormProps {
  initialService?: string;
  onSuccess?: () => void;
}

export default function BookingForm({ initialService = "General Pipe Repair", onSuccess }: BookingFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [serviceType, setServiceType] = useState(initialService);
  const [urgency, setUrgency] = useState<"Standard" | "Same-day" | "Emergency">("Standard");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("Morning (7:00 AM - 12:00 PM)");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingResult, setBookingResult] = useState<Booking | null>(null);

  // Define some common services for booking selection
  const serviceCategories = [
    "General Pipe Repair",
    "Drain Clog & Cleaning",
    "Water Heater Replacement",
    "Water Heater Repair",
    "AC Diagnostic & Repair",
    "AC New Installation",
    "Furnace Diagnostic & Repair",
    "Furnace Replacement",
    "Sewer Line Hydro-Jetting",
    "Sump Pump Diagnostic",
    "Emergency Support"
  ];

  // Define slots and fake live occupancy status
  const slots = [
    { label: "Morning (7:00 AM - 12:00 PM)", status: "Popular", count: 2 },
    { label: "Afternoon (12:00 PM - 5:00 PM)", status: "Limited", count: 1 },
    { label: "Evening (5:00 PM - 10:00 PM)", status: "Filling Fast", count: 3 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address || !date || !timeSlot) return;

    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          address,
          zip,
          serviceType,
          urgency,
          date,
          timeSlot,
          description
        })
      });

      if (response.ok) {
        const data = await response.json();
        setBookingResult(data.booking);
        setSuccess(true);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      console.error("Booking Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Service & Urgency Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Service Needed</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 text-xs sm:text-sm font-semibold text-slate-700 bg-white"
              >
                {serviceCategories.map((srv) => (
                  <option key={srv} value={srv}>
                    {srv}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Urgency Level</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "Standard", style: "border-slate-200 text-slate-700" },
                  { id: "Same-day", style: "border-orange-200 text-orange-700" },
                  { id: "Emergency", style: "border-red-200 text-red-700" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUrgency(item.id as any)}
                    className={`p-2.5 border text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      urgency === item.id 
                        ? "bg-slate-900 border-slate-900 text-white" 
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    {item.id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Alert Banner */}
          {(urgency === "Emergency" || urgency === "Same-day") && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3 text-red-800 animate-pulse">
              <AlertTriangle className="shrink-0 text-red-600 mt-0.5" size={18} />
              <div className="text-xs leading-relaxed">
                <span className="font-extrabold">🚨 CRITICAL EMERGENCY RECOVERY DISPATCH:</span> For rapid 45-minute arrival on active house flooding, burst mains, or frozen pipe emergencies, please call us directly at <a href="tel:2065550199" className="underline font-black hover:text-red-950">(206) 555-0199</a>. Phone dispatch bypasses all email delay queues!
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
              Contact & Address Details
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-xs font-bold text-slate-500 block mb-1">Full Name *</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="(206) 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 block mb-1">Service Address *</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="1420 Pine St, Seattle, WA"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Zip Code *</label>
                <input
                  type="text"
                  required
                  placeholder="98101"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Email Address (For Appointment confirmation)</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="sarah.j@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Time & Scheduling */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
              Appointment Schedule & Availability
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Choose Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-3 text-xs sm:text-sm font-semibold text-slate-700 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Available Hours Slot *</label>
                <div className="space-y-2">
                  {slots.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setTimeSlot(item.label)}
                      className={`w-full text-left p-3 border rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer ${
                        timeSlot === item.label
                          ? "border-primary bg-blue-50/50 text-dark-blue font-bold"
                          : "border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100/75"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-primary" />
                        <span>{item.label}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        item.status === "Limited" 
                          ? "bg-orange-100 text-orange-700" 
                          : "bg-blue-100 text-primary"
                      }`}>
                        {item.count} slots left
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Explain the situation or issue (Optional)</label>
            <div className="relative">
              <FileText size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <textarea
                rows={3}
                placeholder="Water is slowly dripping from under the heater tank. We turned off the valve for now..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white"
              ></textarea>
            </div>
          </div>

          {/* Terms info banner */}
          <div className="flex gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] text-slate-500 font-semibold leading-relaxed">
            <Info size={14} className="text-primary shrink-0 mt-0.5" />
            <span>
              By clicking Book, you agree to receive transactional scheduling confirmation calls & SMS reminders. Diagnostic fee is waived with any repair done. Cancellation is 100% free anytime.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-display font-extrabold py-4 rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Dispatching & Allocating Specialist...
              </>
            ) : (
              <>
                <Check size={18} />
                Confirm Real-Time Booking Slot
              </>
            )}
          </button>
        </form>
      ) : (
        /* Success State display */
        <div className="text-center py-6 space-y-6">
          <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto shadow-md">
            <Check size={32} strokeWidth={3} />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-display font-extrabold text-dark-blue">
              Booking Confirmed Successfully!
            </h3>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Hi <strong>{name}</strong>! Your service dispatcher is on the schedule. We have allocated senior engineer <strong className="text-primary">{bookingResult?.technician || "Dave Miller"}</strong> for your appointment.
            </p>
          </div>

          {/* Summary receipt card */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 text-left space-y-3.5 max-w-md mx-auto text-xs text-slate-600 font-semibold shadow-sm">
            <div className="flex justify-between border-b border-slate-200/80 pb-2 font-mono text-[10px] text-slate-400">
              <span>APPOINTMENT RECEIPT</span>
              <span>ID: {bookingResult?.id || "B-7721"}</span>
            </div>

            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400">Service:</span>
              <span className="col-span-2 text-dark-blue font-bold">{serviceType}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400">Date & Slot:</span>
              <span className="col-span-2 text-slate-700 font-bold">{date} during {timeSlot}</span>
            </div>

            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400">Location:</span>
              <span className="col-span-2 text-slate-700">{address} (Zip: {zip})</span>
            </div>

            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-400">Assigned Expert:</span>
              <span className="col-span-2 text-success font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-ping"></span>
                {bookingResult?.technician || "Dave Miller"} (Senior Tech)
              </span>
            </div>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-xs text-slate-600 max-w-md mx-auto text-center font-medium leading-relaxed">
            💬 A confirmation text has been dispatched to <strong className="text-dark-blue font-mono">{phone}</strong>. Our dispatch operator will call you about 20 minutes prior to {bookingResult?.technician || "Dave"}'s arrival to confirm.
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setSuccess(false);
                setName("");
                setPhone("");
                setAddress("");
                setZip("");
                setDescription("");
              }}
              className="bg-slate-100 hover:bg-slate-250 text-slate-700 font-bold px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
            >
              Book Another Service Slot
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
