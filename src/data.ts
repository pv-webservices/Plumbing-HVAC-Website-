import { Service, Testimonial, FAQItem } from "./types";

export const SERVICES: Service[] = [
  {
    id: "plumbing-repair",
    title: "Plumbing Repair",
    icon: "Wrench",
    shortDesc: "Complete plumbing solutions from leaky faucets to complex repiping.",
    longDesc: "Our licensed plumbers handle general plumbing repairs, pipe leak detection, fixture installations, and toilet repairs. We use advanced diagnostic tools to resolve issues quickly and correctly the first time.",
    features: [
      "Leaky Pipe Repair & Repiping",
      "Faucet, Sink & Toilet Installations",
      "Sump Pump Service & Replacement",
      "Water Pressure Regulation"
    ],
    pricingRange: "$150 - $450"
  },
  {
    id: "drain-cleaning",
    title: "Drain Cleaning",
    icon: "Droplets",
    shortDesc: "Clear clogged drains and main sewer lines with high-speed rooter tech.",
    longDesc: "Whether it's a slow shower drain or a completely blocked sewer main line, we offer hydro-jetting, professional cabling, and camera inspections to clear your line and prevent future backups.",
    features: [
      "High-Pressure Hydro-Jetting",
      "Sewer Line Camera Inspections",
      "Clogged Drain Rooter Service",
      "Sewer Main Line Cleanses"
    ],
    pricingRange: "$99 - $350"
  },
  {
    id: "water-heaters",
    title: "Water Heaters",
    icon: "Flame",
    shortDesc: "Fast repairs and high-efficiency tankless/traditional installations.",
    longDesc: "No hot water? We repair all water heater brands. We also specialize in sizing and installing energy-efficient traditional tank heaters and space-saving tankless water heaters.",
    features: [
      "Same-Day Hot Water Restorations",
      "High-Efficiency Tankless Upgrades",
      "Traditional Tank Replacements",
      "Sediment Flush & Maintenance"
    ],
    pricingRange: "$180 - $3,500+"
  },
  {
    id: "ac-service",
    title: "AC Repair & Install",
    icon: "Wind",
    shortDesc: "Beat the heat with central AC, ductless mini-splits, and repairs.",
    longDesc: "From simple diagnostic tests and refrigerant recharging to entire energy-saving central air or heat pump installations, our HVAC experts keep your home perfectly cool during summer.",
    features: [
      "AC Diagnostic & Rapid Repairs",
      "High-Efficiency AC & Heat Pump Installs",
      "Refrigerant Leak Detection & Recharge",
      "Ductless Mini-Split Systems"
    ],
    pricingRange: "$150 - $4,800+"
  },
  {
    id: "heating-furnace",
    title: "Heating & Furnace Repair",
    icon: "Thermometer",
    shortDesc: "Reliable gas/electric furnace repair, maintenance, and replacement.",
    longDesc: "When winter strikes, you need a furnace that is reliable. We service gas, electric, and heat pump systems to ensure safe, energy-efficient heating all season long.",
    features: [
      "Furnace Repairs & Heat Exchanger Checks",
      "Gas & Electric Heating Replacements",
      "Annual Safety Tune-Ups & Cleaning",
      "Smart Thermostat Integrations"
    ],
    pricingRange: "$120 - $5,500+"
  },
  {
    id: "emergency-services",
    title: "Emergency Services",
    icon: "AlertTriangle",
    shortDesc: "24/7 priority response for burst pipes, flooding, or complete heat loss.",
    longDesc: "Emergency plumbing and HVAC issues don't wait for business hours. We provide priority emergency dispatch 24 hours a day, 7 days a week, 365 days a year with upfront pricing.",
    features: [
      "24/7 Emergency Dispatch",
      "Active Flooding & Burst Pipe Control",
      "Gas Leak Safety & Line Repair",
      "No-Heat Emergency Support in Freeze"
    ],
    pricingRange: "$199+ (Diagnostic)"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Robert M.",
    location: "Seattle, WA",
    rating: 5,
    servicePerformed: "Emergency Pipe Repair",
    text: "Woke up at 2 AM to a burst pipe in the basement. Called PlumbFlow and they had a technician at my house in 45 minutes! Marcus was extremely professional, explained the price upfront, and fixed it within an hour. Saved us from thousands in water damage!",
    date: "July 2, 2026",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120"
  },
  {
    id: "2",
    name: "Sarah L.",
    location: "Bellevue, WA",
    rating: 5,
    servicePerformed: "Tankless Water Heater Install",
    text: "We upgraded to a tankless water heater with PlumbFlow. Their price calculator gave us a very realistic range, and the final quote was right in line. The installation was neat, and we now have endless hot water. Excellent experience!",
    date: "June 25, 2026",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
  },
  {
    id: "3",
    name: "David K.",
    location: "Tacoma, WA",
    rating: 5,
    servicePerformed: "AC Seasonal Tune-Up",
    text: "Great customer service. Booking online was incredibly simple. The technician, Dave, called when he was 20 minutes away, wore shoe covers in the house, and did a thorough tune-up. They are now my go-to for all HVAC and plumbing needs.",
    date: "June 18, 2026",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
  },
  {
    id: "4",
    name: "Emily R.",
    location: "Kirkland, WA",
    rating: 5,
    servicePerformed: "Clogged Main Drain Clearing",
    text: "Highly recommend PlumbFlow! Very honest. Another contractor told me I needed a full sewer replacement. PlumbFlow ran a camera, showed me it was just a severe root clog, and cleared it for a fraction of the cost. I appreciate their honesty!",
    date: "May 30, 2026",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120"
  }
];

export const FAQS: FAQItem[] = [
  {
    id: "q1",
    category: "pricing",
    question: "Do you offer upfront, flat-rate pricing?",
    answer: "Yes, absolutely. We charge a flat diagnostic fee to send a technician to your home and find the issue. Once diagnosed, we provide a complete flat-rate price quote before any work begins. There are never any surprises or hidden hourly fees."
  },
  {
    id: "q2",
    category: "emergencies",
    question: "How fast can you respond to an emergency?",
    answer: "For emergency service, we aim to have a technician at your doorstep within 45 to 90 minutes. Our dispatchers are active 24/7 to send help as quickly as possible. If you are experiencing active flooding or a gas leak, call us immediately."
  },
  {
    id: "q3",
    category: "general",
    question: "Are your technicians licensed and background-checked?",
    answer: "Every single PlumbFlow technician is fully licensed, bonded, insured, background-checked, and drug-tested. We also provide regular training on the latest safety standards and advanced home service technologies."
  },
  {
    id: "q4",
    category: "services",
    question: "Do you offer warranties on your parts and labor?",
    answer: "Yes! We stand behind our work with a 100% Satisfaction Guarantee. Most plumbing and HVAC repairs come with a 1-year parts and labor warranty, and new system installations come with up to a 10-year manufacturer and installation warranty."
  },
  {
    id: "q5",
    category: "pricing",
    question: "Do you offer financing for larger HVAC or plumbing projects?",
    answer: "Yes, we partner with premier financing providers to offer flexible, low-monthly-payment financing plans (including 0% APR options) for major investments like new heat pumps, furnaces, sewer repipes, and tankless water heaters."
  },
  {
    id: "q6",
    category: "general",
    question: "What is your service area?",
    answer: "We proudly serve the entire Greater Seattle Metro area, including Seattle, Bellevue, Tacoma, Kirkland, Redmond, Renton, Kent, Everett, Lynnwood, Federal Way, Issaquah, and surrounding communities. If you're unsure if you're in range, enter your zip code in our calculator or give us a call!"
  }
];

export const SERVICE_AREAS = [
  { name: "Seattle", zipCodes: ["98101", "98103", "98105", "98109", "98115", "98118", "98122", "98144"] },
  { name: "Bellevue", zipCodes: ["98004", "98005", "98006", "98007", "98008"] },
  { name: "Tacoma", zipCodes: ["98402", "98403", "98405", "98406", "98409"] },
  { name: "Kirkland", zipCodes: ["98033", "98034"] },
  { name: "Redmond", zipCodes: ["98052", "98053"] },
  { name: "Renton", zipCodes: ["98055", "98056", "98057", "98058", "98059"] },
  { name: "Kent", zipCodes: ["98030", "98031", "98032", "98042"] },
  { name: "Everett", zipCodes: ["98201", "98203", "98204", "98208"] }
];
