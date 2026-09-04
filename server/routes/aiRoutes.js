const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/generate-email", async (req, res) => {
  try {
    const {
      company,
      contact,
      role,
      industry,
      location,
      employees,
      revenue,
      score,
      priority,
    } = req.body;

    // Validate required fields
    if (!company || !contact || !role) {
      return res.status(400).json({
        success: false,
        message: "Company, contact and role are required",
      });
    }

    const prompt = `
You are a professional B2B sales assistant.

Write a short, personalized cold outreach email for the following lead.

Lead information:
Company: ${company}
Contact: ${contact}
Role: ${role}
Industry: ${industry || "Not provided"}
Location: ${location || "Not provided"}
Employees: ${employees || "Not provided"}
Revenue: ${revenue || "Not provided"}
Lead Score: ${score || "Not provided"}/100
Priority: ${priority || "Not provided"}

Requirements:
- Write a professional and natural B2B sales email.
- Personalize the email using the contact's name, role, and company.
- Keep the email under 150 words.
- Do not invent facts about the company.
- Do not mention the lead score or priority in the email.
- Do not use "I hope this email finds you well".
- Clearly explain why the outreach may be relevant.
- Include a simple, non-pushy call to action.
- Return only the email.
`;

    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: prompt,
    });

    const email = interaction.output_text;

    if (!email) {
      return res.status(500).json({
        success: false,
        message: "Gemini returned an empty response",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        email,
      },
    });
  } catch (error) {
    console.error("=================================");
    console.error("GEMINI API ERROR");
    console.error("=================================");
    console.error(error.message);
    console.error("=================================");

    res.status(500).json({
      success: false,
      message: "Failed to generate AI email",
      error: error.message,
    });
  }
});

module.exports = router;