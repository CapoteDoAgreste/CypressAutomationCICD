import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

export const getInventoryInsights = async (products: Product[]): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "API Key not found. Please configured the environment variable.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Analyze the following inventory list and provide 3 short, actionable insights or warnings regarding stock levels, potential overstock, or revenue opportunities.
      Format the output as a simple HTML unordered list (<ul><li>...</li></ul>) without markdown code blocks.
      
      Inventory Data:
      ${JSON.stringify(products.map(p => ({ name: p.name, qty: p.quantity, price: p.price })))}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No insights available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to retrieve AI insights at this time.";
  }
};