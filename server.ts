import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import axios from "axios";
import multer from "multer";

let pdfParse: any;

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || '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',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to find absolute or relative knowledge base file path reliably across development and container runtimes
  const getKnowledgeBasePath = (): string => {
    let localDir = "";
    try {
      if (typeof __dirname !== "undefined") {
        localDir = __dirname;
      }
    } catch (e) {
      // ignore
    }

    const possiblePaths: string[] = [
      path.join(process.cwd(), "goldi_solar_knowledge.txt")
    ];

    if (localDir) {
      possiblePaths.push(path.join(localDir, "goldi_solar_knowledge.txt"));
      possiblePaths.push(path.join(localDir, "..", "goldi_solar_knowledge.txt"));
    }

    possiblePaths.push("./goldi_solar_knowledge.txt");
    possiblePaths.push("/goldi_solar_knowledge.txt");

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }
    // Default fallback to standard path
    return path.join(process.cwd(), "goldi_solar_knowledge.txt");
  };

  // API Routes
  app.post("/api/solar-ai", async (req, res) => {
    try {
      const { prompt, messages = [] } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Format previous context
      const chatContext = Array.isArray(messages) 
        ? messages.map(m => ({ role: m.role, content: m.content })) 
        : [{ role: "user", content: prompt }];


      // Read dynamic business guidelines from goldi_solar_knowledge.txt
      let knowledgeBase = "";
      try {
        const kbPath = getKnowledgeBasePath();
        if (fs.existsSync(kbPath)) {
          knowledgeBase = fs.readFileSync(kbPath, "utf8");
        }
      } catch (kbErr) {
        console.error("Could not read knowledge base file:", kbErr);
      }

      // Step 1: Extract parameters and classify the prompt using the LLM
      const extractionSystemPrompt = `You are a precise data extraction and classification assistant for Goldi Solar in India.
Analyze the user's query and extract a JSON object with:
1. "extractedBill": The monthly electricity bill in INR as a pure number. If they mention an annual bill, divide by 12. If not mentioned but they mention units consumed, estimate the bill as units * 8. If they write "2000 bill", extract 2000. If they write "4500", extract 4500. Else null.
2. "extractedLocation": The city, town, or state in India if mentioned, else null.
3. "extractedArea": The roof area or house size in sq ft if mentioned as a number, else null.
4. "detectedLanguage": The language the user used to ask the question (e.g., "Hindi", "English", "Gujarati", "Hinglish").
5. "estimatedUnits": The monthly electricity units (kWh) consumed, if explicitly mentioned, else null.
6. "queryType": A string that classifies the query. Must be exactly one of:
   - "greeting": if the user is saying a greeting (like "Hi", "Hello", "Namaste", "Kem cho", "Who are you", "how are you") without asking any specific solar or calculation questions.
   - "calculation": if the user is explicitly asking to calculate/estimate their solar potential, or provided specific billing/consumption numbers (like a bill amount, units, roof area, or asked "how much solar system for my house?").
   - "general_info": if the user is asking general questions about solar panels, Goldi Solar, costs, efficiency, benefits, or anything else, but is NOT asking for a specific calculation/estimation for their own house/bill.

Return ONLY a valid JSON object matching this schema. Do not include any markdown code block formatting or backticks. Return the raw JSON string only.`;

      let extractionResponseText = "";
      try {
        const extractionCompletion = await openai.chat.completions.create({
          model: "meta/llama-3.1-8b-instruct",
          messages: [
            { "role": "system", "content": extractionSystemPrompt },
            { "role": "user", "content": prompt }
          ],
          temperature: 0.1,
          max_tokens: 256,
          stream: false
        });
        extractionResponseText = extractionCompletion.choices[0]?.message?.content || "";
      } catch (err) {
        console.error("Extraction call failed, using default values", err);
      }

      let extractedData = {
        extractedBill: null as number | null,
        extractedLocation: null as string | null,
        extractedArea: null as number | null,
        detectedLanguage: "English",
        estimatedUnits: null as number | null,
        queryType: "calculation"
      };

      if (extractionResponseText) {
        try {
          const cleanJson = extractionResponseText.replace(/```json/g, "").replace(/```/g, "").trim();
          extractedData = JSON.parse(cleanJson);
        } catch (parseErr) {
          console.error("Failed to parse extraction JSON. Response was:", extractionResponseText);
          // Simple regex fallback
          const billMatch = prompt.match(/(?:bill|rupees|rs\.?|inr|₹)\s*(\d+[\d,]*)/i) || prompt.match(/(\d+[\d,]*)\s*(?:bill|rupees|rs\.?|inr|₹)/i);
          if (billMatch) {
            extractedData.extractedBill = parseInt(billMatch[1].replace(/,/g, ""), 10);
            extractedData.queryType = "calculation";
          }
        }
      }

      // Quick local override: if we found a bill, area, or units, it is definitely a calculation query
      if (extractedData.extractedBill || extractedData.extractedArea || extractedData.estimatedUnits) {
        extractedData.queryType = "calculation";
      }
      
      // Also fallback regex check if still no bill found
      if (!extractedData.extractedBill) {
        const fallbackMatch = prompt.match(/(?:bill|rupees|rs\.?|inr|₹)\s*(\d+[\d,]*)/i) || prompt.match(/(\d+[\d,]*)\s*(?:bill|rupees|rs\.?|inr|₹)/i) || prompt.match(/^(\d{3,5})\s*$/);
        if (fallbackMatch) {
          extractedData.extractedBill = parseInt(fallbackMatch[1].replace(/,/g, ""), 10);
          extractedData.queryType = "calculation";
        }
      }

      // Quick local override for common simple greetings to make sure they are categorized correctly
      const lowerPrompt = prompt.toLowerCase().trim();
      const hasNumber = /\d+/.test(lowerPrompt);
      const isSimpleGreeting = !hasNumber && (
        lowerPrompt === "hi" ||
        lowerPrompt === "hello" ||
        lowerPrompt === "hey" ||
        lowerPrompt === "hy" ||
        lowerPrompt === "yo" ||
        lowerPrompt === "hola" ||
        lowerPrompt === "namaste" ||
        lowerPrompt === "kem cho" ||
        lowerPrompt === "ram ram" ||
        lowerPrompt === "su che" ||
        lowerPrompt === "hlo" ||
        lowerPrompt === "hlw" ||
        lowerPrompt === "pranam" ||
        lowerPrompt === "kemcho" ||
        lowerPrompt === "kaise ho" ||
        lowerPrompt === "how are you" ||
        lowerPrompt === "who are you"
      );

      if (isSimpleGreeting) {
        extractedData.queryType = "greeting";
      }

      // Case 1: Simple Greetings
      if (extractedData.queryType === "greeting") {
        const greetingPrompt = `You are a warm, polite, and friendly AI Assistant for Goldi Solar in India.
The user said: "${prompt}"
The user's detected language is: ${extractedData.detectedLanguage}

Our official company business guidelines and product knowledge base:
${knowledgeBase || "Goldi Solar is a leading quality-conscious solar brand in India."}

Your task:
1. Respond to their greeting in a short, polite, and helpful manner.
2. CRITICAL RULE: If the detectedLanguage is "English" or the user's input is a simple greeting (like "hi", "hello", "hey", "hy", "hlw", "hlo", etc.), you MUST reply in pure, friendly English, introducing yourself as the Goldi AI Assistant and asking how you can help them (e.g., "Hello! I am your Goldi AI Assistant. How can I help you today?"). You MUST stop at asking "How can I help you today?". Do NOT ask them to share their monthly electricity bill, units, or location in this greeting. Do NOT mix any Hindi, Hinglish, or Devanagari words.
3. If the detectedLanguage is "Hindi" or "Hinglish" or the user greeted in Hindi/Hinglish (like "namaste", "kaise ho", etc.), reply in natural Hinglish (using Latin script), introduce yourself as Goldi AI Assistant, and ask how you can help them (e.g., "Namaste! Main Goldi AI Assistant hoon. Aaj main aapki kya sahayata kar sakta hoon?"), and stop there. Do NOT ask for bills or locations yet.
4. If the detectedLanguage is "Gujarati", reply 100% in beautiful, polite, and proper Gujarati script (ગુજરાતી લિપિ) introducing yourself as Goldi AI Assistant, and ask how you can help them (e.g., "નમસ્તે! હું ગોલ્ડી AI આસિસ્ટન્ટ છું. આજે હું તમારી શું મદદ કરી શકું?"), and stop there. Do NOT write in Latin/English alphabets or mix Hindi words.
5. Keep the message natural, friendly, and EXTREMELY concise (maximum 1-2 sentences). Format your response to have a blank line (\n\n) between the introduction and the question. Do not mention any numbers or assume any bill.`;

        let greetingResponse = "";
        try {
          const greetingCompletion = await openai.chat.completions.create({
            model: "meta/llama-3.1-8b-instruct",
            messages: [
              { "role": "system", "content": greetingPrompt },
              ...chatContext
            ],
            temperature: 0.5,
            max_tokens: 256,
            stream: false
          });
          greetingResponse = greetingCompletion.choices[0]?.message?.content || "";
        } catch (err) {
          greetingResponse = "Hello! I am your Goldi AI Assistant. How can I help you today?";
        }

        return res.json({
          extractedBill: null,
          extractedLocation: null,
          extractedArea: null,
          recommendedKw: null,
          spaceRequiredSqFt: null,
          yearlySavings: null,
          estimatedCost: null,
          co2ReductionTons: null,
          message: greetingResponse.trim().replace(/\n{3,}/g, '\n\n')
        });
      }

      // Case 2: General Informational Queries
      if (extractedData.queryType === "general_info") {
        const infoPrompt = `You are a highly helpful and expert AI Assistant for Goldi Solar in India.
The user asked a general informational or non-calculational question: "${prompt}"
The user's detected language is: ${extractedData.detectedLanguage}

Our official company business guidelines and product knowledge base:
${knowledgeBase || "Goldi Solar is a leading quality-conscious solar brand in India."}

Your task:
1. Answer their question directly and concisely. Do not add long preambles.
2. CRITICAL RULE: You MUST reply in the language specified as detectedLanguage: "${extractedData.detectedLanguage}".
   - If detectedLanguage is "English", you MUST answer 100% in pure English. Do NOT mix any Hindi, Hinglish, or Devanagari words.
   - If detectedLanguage is "Hindi" or "Hinglish", answer in natural Hinglish (using Latin script).
   - If detectedLanguage is "Gujarati", you MUST reply 100% in proper, grammatically correct Gujarati script (ગુજરાતી લિપિ). Do NOT write Gujarati using Latin/English letters, and do NOT mix Hindi words.
3. If the user asks about products or solar modules, you MUST ONLY recommend the EXACT products listed in the knowledge base (e.g., "HELOC Pro" and "HELOC Plus"). Do NOT invent or mention older series like "Goldi Gnate" or "Goldi HELOC Series". Include a link to our internal explore modules page (e.g., "Explore our modules here: [Explore Modules](/explore-modules)").
4. Do NOT assume any default bill amount, or perform any personalized calculations. Do not mention default numbers (like 2000 bill, 2.5 kW, etc.).
5. End your response by nicely suggesting that if they want a personalized solar system size and savings estimate, they can share their monthly electricity bill (in ₹) or units consumed (in kWh).
6. Structure the response beautifully using Markdown. Use short paragraphs and bullet points for readability. Separate paragraphs with exactly one blank line (\n\n). Do NOT use excessive blank lines.
7. Also include a short Call To Action to contact us (e.g., "Contact us to get started: [1800-833-5511](tel:18008335511)") as the final line.`;

        let infoResponse = "";
        try {
          const infoCompletion = await openai.chat.completions.create({
            model: "meta/llama-3.1-8b-instruct",
            messages: [
              { "role": "system", "content": infoPrompt },
              ...chatContext
            ],
            temperature: 0.4,
            max_tokens: 512,
            stream: false
          });
          infoResponse = infoCompletion.choices[0]?.message?.content || "";
        } catch (err) {
          infoResponse = "Goldi Solar panels are highly efficient, reliable, and durable. Please share your monthly electricity bill or units consumed so I can calculate your solar savings and recommended system size!";
        }

        return res.json({
          extractedBill: null,
          extractedLocation: extractedData.extractedLocation,
          extractedArea: extractedData.extractedArea,
          recommendedKw: null,
          spaceRequiredSqFt: null,
          yearlySavings: null,
          estimatedCost: null,
          co2ReductionTons: null,
          message: infoResponse.trim().replace(/\n{3,}/g, '\n\n')
        });
      }

      // Case 3: Calculation Queries
      let bill = extractedData.extractedBill;
      if (!bill && extractedData.estimatedUnits) {
        bill = extractedData.estimatedUnits * 8;
      }

      // If they want calculation but we didn't extract any bill/units/area, prompt them to provide it
      if (!bill && !extractedData.extractedArea) {
        const askForDetailsPrompt = `You are a helpful AI Assistant for Goldi Solar in India.
The user wants to calculate their solar savings/potential but did not provide specific details like their electricity bill or consumption.
User query: "${prompt}"
The user's detected language is: ${extractedData.detectedLanguage}

Our official company business guidelines and product knowledge base:
${knowledgeBase || "Goldi Solar is a leading quality-conscious solar brand in India."}

Your task:
1. Warmly ask the user to provide their monthly electricity bill (in ₹), units consumed per month (in kWh), or their available roof space (in sq ft) so that you can run a precise calculation.
2. CRITICAL RULE: You MUST reply in the language specified as detectedLanguage: "${extractedData.detectedLanguage}".
   - If detectedLanguage is "English", reply 100% in friendly English (e.g., "Could you please share your monthly electricity bill in Rupees or units consumed so I can calculate your solar savings?"). Do NOT mix any Hindi or Hinglish words.
   - If detectedLanguage is "Hindi" or "Hinglish", reply in natural Hinglish (using Latin script).
   - If detectedLanguage is "Gujarati", reply 100% in friendly and polite Gujarati script (ગુજરાતી લિપિ) (e.g., "કૃપા કરીને તમારું માસિક વીજળી બિલ (રૂપિયામાં) અથવા વપરાશ કરેલ યુનિટ શેર કરો, જેથી હું તમારી સોલાર બચતની ગણતરી કરી શકું."). Do NOT write Gujarati using Latin/English characters.
3. Do NOT make any assumptions or show any default calculations. Do not mention default numbers.
4. Keep the message friendly, professional, and short.`;

        let askResponse = "";
        try {
          const askCompletion = await openai.chat.completions.create({
            model: "meta/llama-3.1-8b-instruct",
            messages: [
              { "role": "system", "content": askForDetailsPrompt },
              ...chatContext
            ],
            temperature: 0.4,
            max_tokens: 256,
            stream: false
          });
          askResponse = askCompletion.choices[0]?.message?.content || "";
        } catch (err) {
          askResponse = "Please share your monthly electricity bill amount (in ₹) or units consumed, and I will calculate your solar system size and savings!";
        }

        return res.json({
          extractedBill: null,
          extractedLocation: extractedData.extractedLocation,
          extractedArea: null,
          recommendedKw: null,
          spaceRequiredSqFt: null,
          yearlySavings: null,
          estimatedCost: null,
          co2ReductionTons: null,
          message: askResponse.trim().replace(/\n{3,}/g, '\n\n')
        });
      }

      // We have numerical data to calculate!
      // If we only have roof space and no bill, estimate bill assuming they want to maximize their space
      if (!bill && extractedData.extractedArea) {
        // Estimate kW based on area (100 sq ft per kW)
        const estimatedKw = Math.max(1.0, Math.floor(extractedData.extractedArea / 100));
        // Back-calculate bill (1 kW generates ~120 units per month, cost per unit is ₹8)
        bill = estimatedKw * 120 * 8;
      }

      // Step 2: Accurate server-side calculations
      const costPerUnit = 8;
      const monthlyUnits = bill! / costPerUnit;
      const rawKw = monthlyUnits / 120;
      
      // Round up to nearest 0.5 kW, minimum of 1.0 kW
      let recommendedKw = Math.ceil(rawKw * 2) / 2;
      if (recommendedKw < 1.0) {
        recommendedKw = 1.0;
      }

      const spaceRequiredSqFt = recommendedKw * 100;
      const estimatedCost = recommendedKw * 50000;
      const yearlySavings = bill! * 12;
      const co2ReductionTons = Number((recommendedKw * 39.2).toFixed(2));

      // Step 3: Generate localized summary message using the calculated values
      const messageSystemPrompt = `You are a Smart Solar Savings Predictor assistant for Goldi Solar in India.
The user asked: "${prompt}"
The user's detected language is: ${extractedData.detectedLanguage}

Our official company business guidelines and product knowledge base:
${knowledgeBase || "Goldi Solar is a leading quality-conscious solar brand in India."}

We have calculated the mathematically precise solar estimation results for them based on their monthly bill of ₹${bill}:
- Recommended System Size: ${recommendedKw} kW
- Required Roof Space: ${spaceRequiredSqFt} sq ft
- Yearly Savings: ₹${yearlySavings.toLocaleString('en-IN')}
- Estimated Cost of Installation: ₹${estimatedCost.toLocaleString('en-IN')}
- Lifetime CO2 Emission Reduction: ${co2ReductionTons} Tons
- Location: ${extractedData.extractedLocation || "India"}

Your task is to write an ULTRA-SHORT and friendly response (maximum 1 to 2 sentences).

CRITICAL RULES:
1. You MUST write this message in the language specified as detectedLanguage: "${extractedData.detectedLanguage}".
   - If detectedLanguage is "English", you MUST answer 100% in pure English. Do NOT mix any Hindi, Hinglish, or Devanagari words.
   - If detectedLanguage is "Hindi" or "Hinglish", reply in natural Hinglish (using Latin script).
   - If detectedLanguage is "Gujarati", you MUST reply 100% in proper, grammatically correct Gujarati script (ગુજરાતી લિપિ). Do NOT write Gujarati using Latin/English characters. Do NOT mix Hindi or Hinglish words in the Gujarati response. Make it sound native and professional.
2. DO NOT change or alter any of the calculated numbers above. Use them exactly as provided.
3. Maximum 1 or 2 sentences total before the CTA. Do NOT explain the numbers, do NOT mention the environment or CO2, and do NOT repeat the dashboard stats. Just write a quick encouraging summary like "A solar system can significantly reduce your electricity bills!".
4. Structure the response beautifully using Markdown. Use short paragraphs and bullet points if needed. Separate paragraphs with exactly one blank line (\n\n). Do NOT use excessive blank lines.
5. ALWAYS include a brief Call to Action (CTA) at the end, formatted EXACTLY as a markdown link like this: "Contact us to get started: [1800-833-5511](tel:18008335511)".
6. Do not return JSON. Just return the plain text response message.`;

      let responseMessage = "";
      try {
        const messageCompletion = await openai.chat.completions.create({
          model: "meta/llama-3.1-8b-instruct",
          messages: [
            { "role": "system", "content": messageSystemPrompt },
            ...chatContext
          ],
          temperature: 0.3,
          max_tokens: 512,
          stream: false
        });
        responseMessage = messageCompletion.choices[0]?.message?.content || "";
      } catch (err) {
        console.error("Message generation call failed, using default template", err);
        responseMessage = `Based on your monthly bill of ₹${bill!.toLocaleString('en-IN')}, we recommend a ${recommendedKw} kW solar system. It requires ${spaceRequiredSqFt} sq ft of roof space. The estimated installation cost is ₹${estimatedCost.toLocaleString('en-IN')} and it will save you ₹${yearlySavings.toLocaleString('en-IN')} per year.`;
      }

      // Return the final payload matching the exact required schema
      const resultPayload = {
        extractedBill: bill,
        extractedLocation: extractedData.extractedLocation,
        extractedArea: extractedData.extractedArea,
        recommendedKw: recommendedKw,
        spaceRequiredSqFt: spaceRequiredSqFt,
        yearlySavings: yearlySavings,
        estimatedCost: estimatedCost,
        co2ReductionTons: co2ReductionTons,
        message: responseMessage.trim().replace(/\n{3,}/g, '\n\n')
      };

      res.json(resultPayload);
    } catch (error: any) {
      console.error("AI Error Details:", error);
      const errorMessage = error.message || "Failed to process the request.";
      res.status(500).json({ error: errorMessage });
    }
  });

  // Admin Middleware / Helper to verify password
  const verifyAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers["authorization"] || req.headers["x-admin-password"];
    const expectedPassword = (process.env.ADMIN_PASSWORD || "goldisolar2026").trim();
    if (authHeader) {
      const cleanHeader = String(authHeader).trim();
      if (
        cleanHeader === expectedPassword || 
        cleanHeader === `Bearer ${expectedPassword}` ||
        cleanHeader.toLowerCase() === expectedPassword.toLowerCase() ||
        cleanHeader.toLowerCase() === `bearer ${expectedPassword.toLowerCase()}`
      ) {
        return next();
      }
    }
    res.status(401).json({ error: "Unauthorized. Invalid admin password." });
  };

  // Verify Password
  app.post("/api/admin/verify-password", (req, res) => {
    const { password } = req.body;
    const expectedPassword = (process.env.ADMIN_PASSWORD || "goldisolar2026").trim();
    if (password && String(password).trim() === expectedPassword) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, error: "Incorrect password" });
    }
  });

  // Get current knowledge base
  app.get("/api/admin/get-knowledge", verifyAdmin, (req, res) => {
    try {
      const kbPath = getKnowledgeBasePath();
      if (fs.existsSync(kbPath)) {
        const content = fs.readFileSync(kbPath, "utf8");
        res.json({ content });
      } else {
        res.json({ content: "" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to read knowledge base file" });
    }
  });

  // Save/Update knowledge base
  app.post("/api/admin/save-knowledge", verifyAdmin, (req, res) => {
    try {
      const { content } = req.body;
      const kbPath = getKnowledgeBasePath();
      fs.writeFileSync(kbPath, content || "", "utf8");
      res.json({ success: true, message: "Knowledge base updated successfully" });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to save knowledge base" });
    }
  });

  // Helper functions for scraping and crawling
  const cleanHtmlText = (html: string): string => {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const resolveUrl = (base: string, href: string): string | null => {
    try {
      const resolved = new URL(href, base);
      if (resolved.protocol === "http:" || resolved.protocol === "https:") {
        resolved.hash = "";
        return resolved.toString();
      }
    } catch (e) {
      // ignore
    }
    return null;
  };

  const isAssetFile = (urlStr: string): boolean => {
    const lower = urlStr.toLowerCase();
    const assetExtensions = [
      ".png", ".jpg", ".jpeg", ".gif", ".svg", ".pdf", ".zip", ".tar", ".gz",
      ".mp4", ".mp3", ".wav", ".css", ".js", ".json", ".xml", ".ico", ".woff", ".woff2"
    ];
    return assetExtensions.some(ext => lower.endsWith(ext) || lower.includes(ext + "?"));
  };

  const extractInternalLinks = (html: string, baseUrl: string, baseDomain: string): string[] => {
    const links: string[] = [];
    const hrefRegex = /href=["']([^"']+)["']/gi;
    let match;
    while ((match = hrefRegex.exec(html)) !== null) {
      const rawHref = match[1];
      const resolved = resolveUrl(baseUrl, rawHref);
      if (resolved && !isAssetFile(resolved)) {
        try {
          const resolvedUrlObj = new URL(resolved);
          // Only crawl same domain/subdomain
          if (resolvedUrlObj.hostname.replace("www.", "") === baseDomain.replace("www.", "")) {
            links.push(resolved);
          }
        } catch (e) {
          // ignore
        }
      }
    }
    return Array.from(new Set(links));
  };

  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
  });

  app.post("/api/admin/parse-pdf", verifyAdmin, (req, res) => {
    upload.single("pdf")(req, res, async (err) => {
      if (err) {
        console.error("Multer upload error:", err);
        return res.status(400).json({ error: err.message || "Failed to upload file." });
      }
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No PDF file provided." });
        }

        const mod = await import("pdf-parse");
        const PDFParse = mod.PDFParse;
        const parser = new PDFParse({ data: req.file.buffer });
        const pdfData = await parser.getText();
        const text = pdfData.text;

        if (!text || !text.trim()) {
          return res.status(400).json({ error: "Could not extract text from the PDF." });
        }

        console.log(`Extracted ${text.length} characters from PDF. Sending to AI for summarization...`);

        const pagePrompt = `Extract key business guidelines, product details, solar panels information, prices, contact details, policies, and solar specifications from this PDF content:

Text:
"${text.substring(0, 10000)}"

Task: Return a concise, high-quality list of bullet points detailing the key facts. Be completely factual. Do NOT add conversational preambles.`;
        
        const comp = await openai.chat.completions.create({
          model: "meta/llama-3.1-8b-instruct",
          messages: [
            { "role": "system", "content": "You are a professional factual extraction agent. Return only bullet points of facts or nothing. No chatty introductions." },
            { "role": "user", "content": pagePrompt }
          ],
          temperature: 0.1,
          max_tokens: 500,
          stream: false
        });

        const extractedContent = comp.choices[0]?.message?.content?.trim() || "No content extracted by AI.";
        res.json({ extractedContent });

      } catch (err: any) {
        console.error("PDF parsing failed:", err);
        res.status(500).json({ error: err.message || "Failed to parse PDF file." });
      }
    });
  });

  // Scrape and extract text/facts from a URL (single or multi-page entire website)
  app.post("/api/admin/scrape-website", verifyAdmin, async (req, res) => {
    try {
      const { url, scrapeMode, maxPages } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const mode = scrapeMode || "entire";
      const limit = Math.min(Number(maxPages) || 8, 15);

      // Add protocol if missing
      let targetUrl = url.trim();
      if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = "https://" + targetUrl;
      }

      const startingUrlObj = new URL(targetUrl);
      const baseDomain = startingUrlObj.hostname;

      const crawledPages: { url: string; text: string }[] = [];
      const visited = new Set<string>();

      if (mode === "single") {
        console.log(`Scraping single URL: ${targetUrl}`);
        const response = await axios.get(targetUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
          },
          timeout: 10000
        });
        const cleanText = cleanHtmlText(response.data || "");
        if (cleanText) {
          crawledPages.push({ url: targetUrl, text: cleanText });
        }
      } else {
        // Multi-page crawl!
        const queue: string[] = [targetUrl];
        visited.add(targetUrl);

        while (queue.length > 0 && crawledPages.length < limit) {
          const currentUrl = queue.shift()!;
          console.log(`Crawling: ${currentUrl} (${crawledPages.length + 1}/${limit})`);

          try {
            const response = await axios.get(currentUrl, {
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
              },
              timeout: 8000
            });

            const html = response.data;
            if (typeof html === "string") {
              const cleanText = cleanHtmlText(html);
              if (cleanText) {
                crawledPages.push({ url: currentUrl, text: cleanText });
              }

              // Extract and add subpages to the queue
              const extracted = extractInternalLinks(html, currentUrl, baseDomain);
              for (const link of extracted) {
                if (!visited.has(link) && visited.size < 50) {
                  visited.add(link);
                  queue.push(link);
                }
              }
            }
          } catch (crawlErr: any) {
            console.error(`Crawl failed for ${currentUrl}:`, crawlErr.message);
          }
        }
      }

      if (crawledPages.length === 0) {
        return res.status(404).json({ error: "Failed to scrape any content from the provided website URL. Ensure it is correct and public." });
      }

      console.log(`Finished crawling. Successfully fetched ${crawledPages.length} pages. Extracting facts page by page...`);

      // Concurrently run extraction for each page to gather facts
      const extractionPromises = crawledPages.map(async (page) => {
        try {
          const pagePrompt = `Extract key business guidelines, product details, solar panels information, prices, contact details, policies, and solar specifications from this website page content (${page.url}):

Text:
"${page.text.substring(0, 7000)}"

Task: Return a concise, high-quality list of bullet points detailing the key facts. Be completely factual. If this page doesn't contain useful details (e.g. it's just a blank cookie notice or header), return nothing. Do NOT add conversational preambles.`;

          const comp = await openai.chat.completions.create({
            model: "meta/llama-3.1-8b-instruct",
            messages: [
              { "role": "system", "content": "You are a professional factual extraction agent. Return only bullet points of facts or nothing. No chatty introductions." },
              { "role": "user", "content": pagePrompt }
            ],
            temperature: 0.1,
            max_tokens: 500,
            stream: false
          });

          return comp.choices[0]?.message?.content?.trim() || "";
        } catch (err: any) {
          console.error(`AI Extraction failed for page ${page.url}:`, err.message);
          return "";
        }
      });

      const rawFactsArray = await Promise.all(extractionPromises);
      const allRawFacts = rawFactsArray.filter(Boolean).join("\n\n");

      if (!allRawFacts.trim()) {
        return res.json({ extractedContent: "No useful company or product information could be extracted from the crawled pages." });
      }

      console.log("Consolidating and structuring facts from all pages...");
      const masterPrompt = `You are an expert solar knowledge engineer. We have crawled the website "${targetUrl}" and extracted facts from its subpages.

Below are the raw extracted facts:
${allRawFacts}

Your task:
1. Deduplicate, group, and organize these facts into structured sections.
2. Use this exact text-based format for sections:
[SECTION NAME]
- Fact, specification, or policy bullet point here
- Another related factual bullet point here

3. Focus heavily on:
- Company Profile & Mission
- Solar Module Specifications, capacity (kW, Wp), materials, warranties
- Pricing, estimates, payment terms, policies
- Contact info, addresses, customer support
- Any specific technical parameters or customer guidelines

4. CRITICAL: Do NOT return any markdown code block fences (like \`\`\` or \`\`\`text), and do NOT write introductory or closing conversational text. Just return the structured sections and bullet points directly.`;

      const finalComp = await openai.chat.completions.create({
        model: "meta/llama-3.1-8b-instruct",
        messages: [
          { "role": "system", "content": "You are a high-fidelity solar knowledge base organizer. Format output purely in text sections with brackets and bullet points. Never use markdown code blocks." },
          { "role": "user", "content": masterPrompt }
        ],
        temperature: 0.2,
        max_tokens: 1500,
        stream: false
      });

      const extractedContent = finalComp.choices[0]?.message?.content?.trim() || "No content consolidated by AI.";
      res.json({ extractedContent });
    } catch (err: any) {
      console.error("Scraping failed:", err);
      res.status(500).json({ error: err.message || "Failed to scrape the website" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
