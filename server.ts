import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Enable JSON parser for incoming API requests
app.use(express.json());

// In-memory data store for bookings and leads
const bookings: any[] = [
  {
    id: "B-8831",
    name: "John Doe",
    phone: "(206) 555-0144",
    email: "john.doe@example.com",
    address: "1420 Pine St, Seattle, WA 98101",
    zip: "98101",
    serviceType: "AC Repair",
    urgency: "Same-day",
    date: "2026-07-09",
    timeSlot: "10:00 AM - 12:00 PM",
    description: "AC is making a loud buzzing noise and not cooling.",
    status: "Confirmed",
    technician: "Alex Rivera",
    createdAt: new Date().toISOString()
  }
];

const leads: any[] = [];

// API - Get App Info & Config
app.get("/api/info", (req, res) => {
  res.json({
    companyName: "PlumbFlow HVAC & Plumbing",
    phone: "(206) 555-0199",
    emergencyPhone: "(206) 555-0199",
    license: "LIC# PLUMBFH882K1",
    serviceArea: {
      cities: ["Seattle", "Bellevue", "Tacoma", "Kirkland", "Redmond", "Renton", "Kent", "Everett", "Lynnwood", "Federal Way", "Issaquah", "Sammamish"],
      radius: "35 miles from downtown Seattle"
    }
  });
});

// API - Chat Assistant
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // Offline/fallback agent responses
      return handleOfflineChat(message, res);
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemInstruction = `You are an expert customer service assistant for "PlumbFlow HVAC & Plumbing", a professional plumbing and HVAC company in the Seattle Metro Area.
Our contact number is (206) 555-0199 (click-to-call) and our license is LIC# PLUMBFH882K1. We are licensed, bonded, insured, and offer a 100% satisfaction guarantee.

Your instructions:
1. Be extremely helpful, reassuring, and professional. Homeowners are often in a stressful emergency situation.
2. If they describe an EMERGENCY (e.g. active flooding, no heat in winter, gas odor, sewer backup, burst pipe):
   - Direct them immediately to CALL (206) 555-0199 for dispatch.
   - Give them 1-2 rapid safety steps (e.g., turn off main water shutoff, leave the house if gas smell, do not touch electrical panels).
   - Use bold styling for the phone number and urgent warnings.
3. If they want pricing or estimates:
   - Mention we offer transparent upfront, flat-rate pricing.
   - Guide them to use our Interactive Price Calculator on the page to get an instant estimated range.
   - Mention we do an on-site diagnosis to give them an exact, guaranteed price before any work begins.
4. If they want to book:
   - Direct them to use our online Scheduler/Booking tool on this page to pick an exact, real-time slot.
   - Or they can call (206) 555-0199.
5. Answer specific questions accurately:
   - Service Area: King County, Snohomish County, and Pierce County, including Seattle, Bellevue, Tacoma, Kirkland, Redmond, Renton, Kent, Everett, etc.
   - Hours: 24/7 for emergency dispatch. Regular bookings run 7 AM - 10 PM.
   - Diagnostics: Low flat rate diagnostic fee which is WAIVED if they perform the repair with us.

Keep replies concise (2-4 sentences max) and formatted in easy-to-read markdown. Use bullet points if listing steps. Maintain a polite, local-business, helpful tone.`;

    // Map history to Google GenAI contents format
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role === "user" || msg.role === "model") {
          contents.push({
            role: msg.role,
            parts: [{ text: msg.text }]
          });
        } else if (msg.role === "assistant") {
          contents.push({
            role: "model",
            parts: [{ text: msg.text }]
          });
        }
      }
    }

    // Push the current user message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text || "I'm sorry, I couldn't process that response." });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

// Fallback chat assistant handler when API key is missing
function handleOfflineChat(message: string, res: any) {
  const msgLower = message.toLowerCase();
  let reply = "";

  if (msgLower.includes("leak") || msgLower.includes("flood") || msgLower.includes("burst") || msgLower.includes("emergency") || msgLower.includes("water flowing")) {
    reply = "⚠️ **URGENT EMERGENCY DETECTED!**\nPlease call us immediately at **(206) 555-0199** for 24/7 rapid emergency dispatch. \n\n*Quick Safety Tip:* If water is actively flooding, immediately locate your home's main water shutoff valve (usually near the street, basement, or garage) and turn it clockwise to stop the water.";
  } else if (msgLower.includes("heater") || msgLower.includes("hot water")) {
    reply = "We offer complete Water Heater repair, maintenance, and installations! We specialize in both traditional tank heaters and modern high-efficiency tankless water heaters. Feel free to use our **Price Calculator** on the page or book an appointment online right now.";
  } else if (msgLower.includes("ac") || msgLower.includes("air condition") || msgLower.includes("cool") || msgLower.includes("warm") || msgLower.includes("furnace") || msgLower.includes("heating")) {
    reply = "Our certified HVAC technicians handle all heating and cooling systems, including AC repairs, furnace replacements, and regular seasonal maintenance. You can get an instant estimate using our price calculator, or book a technician online in real-time.";
  } else if (msgLower.includes("price") || msgLower.includes("cost") || msgLower.includes("how much") || msgLower.includes("estimate")) {
    reply = "At PlumbFlow, we believe in complete transparency. We have a low diagnostic fee which is waived if we do the repair. We use **flat-rate, upfront pricing** so there are never any surprise fees. Please use the **Interactive Price Calculator** on this page to get an instant range for common repairs!";
  } else if (msgLower.includes("area") || msgLower.includes("city") || msgLower.includes("seattle") || msgLower.includes("where")) {
    reply = "We serve the entire Seattle Metro Area, including Seattle, Bellevue, Tacoma, Kirkland, Redmond, Renton, Kent, Everett, and surrounding communities. If you are within 35 miles of downtown Seattle, we've got you covered!";
  } else {
    reply = "Hello! Thanks for reaching out to **PlumbFlow HVAC & Plumbing**. We are available 24/7 for any heating, cooling, or plumbing needs. You can call us anytime at **(206) 555-0199**, use our **Price Calculator**, or schedule a booking directly from our webpage!";
  }

  res.json({ text: reply });
}

// API - Create Booking
app.post("/api/bookings", (req, res) => {
  const { name, phone, email, address, zip, serviceType, urgency, date, timeSlot, description } = req.body;

  if (!name || !phone || !address || !serviceType || !date || !timeSlot) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  // Assign a mock technician based on service
  let technician = "Sarah Connor";
  if (serviceType.includes("AC") || serviceType.includes("Furnace") || serviceType.includes("HVAC")) {
    technician = "Marcus Aurelius";
  } else if (serviceType.includes("Drain") || serviceType.includes("Plumb")) {
    technician = "Dave Miller";
  }

  const newBooking = {
    id: `B-${Math.floor(1000 + Math.random() * 9000)}`,
    name,
    phone,
    email: email || "n/a",
    address,
    zip: zip || "",
    serviceType,
    urgency: urgency || "Standard",
    date,
    timeSlot,
    description: description || "",
    status: "Confirmed",
    technician,
    createdAt: new Date().toISOString()
  };

  bookings.push(newBooking);
  res.status(201).json({ success: true, booking: newBooking });
});

// API - Get Bookings
app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

// API - Submit Lead (Calculator Leads)
app.post("/api/leads", (req, res) => {
  const { name, phone, zip, serviceType, urgency, estimatedRange, preferredDate, preferredTime } = req.body;

  if (!name || !phone || !zip || !serviceType) {
    return res.status(400).json({ error: "Missing required contact details." });
  }

  const newLead = {
    id: `L-${Math.floor(1000 + Math.random() * 9000)}`,
    name,
    phone,
    zip,
    serviceType,
    urgency,
    estimatedRange,
    preferredDate: preferredDate || "Not specified",
    preferredTime: preferredTime || "Not specified",
    status: "New Estimate Request",
    createdAt: new Date().toISOString()
  };

  leads.push(newLead);
  res.status(201).json({ success: true, lead: newLead });
});

// API - Get Leads
app.get("/api/leads", (req, res) => {
  res.json(leads);
});

// Vite middleware for development or static serving for production
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[PlumbFlow Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});
