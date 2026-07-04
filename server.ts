import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: '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',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/solar-ai", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const systemInstruction = `You are a Smart Solar Savings Predictor assistant for Goldi Solar in India.
The user will provide a natural language description of their situation (e.g., house size, location, monthly electricity bill).
Extract the relevant details and calculate/estimate the following:
1. Recommended solar system size in kilowatts (kW).
2. Estimated roof space required (in sq ft).
3. Estimated yearly savings (in INR).
4. Estimated cost of the system (in INR).
5. Estimated Lifetime CO2 emission reduction (in Tons).

Standard calculations (strictly follow these):
- Cost per unit of electricity = 8 INR.
- Monthly Units Consumed = Monthly Bill / 8.
- 1 kW generates = 120 units per month.
- Recommended System Size (kW) = Monthly Units Consumed / 120. (Round up to nearest 0.5 or 1 kW).
- 1 kW needs = 100 sq ft of roof space.
- Cost of solar installation = 50,000 INR per kW.
- Yearly Savings = Monthly Bill * 12.
- Lifetime CO2 Emission Reduction (Tons) = Recommended System Size (kW) * 39.2.

Return ONLY a valid JSON object with the following keys, no markdown blocks, no extra text:
{
  "extractedBill": number (monthly bill in INR, if provided or inferred, else null),
  "extractedLocation": string (if provided, else null),
  "extractedArea": number (in sq ft, if provided, else null),
  "recommendedKw": number (in kW),
  "spaceRequiredSqFt": number,
  "yearlySavings": number,
  "estimatedCost": number,
  "co2ReductionTons": number,
  "message": "A short, simple, and friendly summary message. Clearly state the recommended system size, estimated cost, yearly savings, and lifetime CO2 emission reduction. CRITICAL: You MUST write this message in the exact same language that the user used in their prompt (e.g., Gujarati, Hindi, English, etc.)."
}`;

      try {
        const completion = await openai.chat.completions.create({
          model: "openai/gpt-oss-20b",
          messages: [
            {"role": "system", "content": systemInstruction},
            {"role": "user", "content": prompt}
          ],
          temperature: 0.2,
          top_p: 1,
          max_tokens: 1024,
          stream: false
        });

        const textResponse = completion.choices[0]?.message?.content;
        
        if (!textResponse) {
            throw new Error("No response from AI");
        }
        
        const cleanJson = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(cleanJson);
        res.json(data);
      } catch (apiError: any) {
        throw apiError;
      }
    } catch (error: any) {
      console.error("AI Error Details:", error);
      const errorMessage = error.message || "Failed to process the request.";
      res.status(500).json({ error: errorMessage });
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
