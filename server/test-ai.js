require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

console.log("Checking Gemini API key...");

if (!process.env.GEMINI_API_KEY) {
  console.log("❌ GEMINI_API_KEY NOT FOUND");
  process.exit(1);
}

console.log("✅ GEMINI_API_KEY FOUND");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const testGemini = async () => {
  try {
    console.log("Generating test response...\n");

    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: "Say hello in one short sentence.",
    });

    console.log("✅ Gemini API is working!\n");
    console.log(interaction.output_text);
  } catch (error) {
    console.log("❌ Gemini API failed:");
    console.log(error.message);
  }
};

testGemini();