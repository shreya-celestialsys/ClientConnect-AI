
import { GoogleGenAI } from "@google/genai";
import { BusinessProfile, SearchResult, Lead, GroundingSource } from "../types";

export async function findPotentialClients(
  profile: BusinessProfile, 
  excludedNames: string[] = []
): Promise<SearchResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const exclusionPrompt = excludedNames.length > 0 
    ? `IMPORTANT: Exclude these specific companies from the search results as they are already in our database: ${excludedNames.join(', ')}.`
    : "";

  const regionsPrompt = profile.targetRegions.length > 0
    ? `Focus the search specifically on businesses located in or operating within these regions: ${profile.targetRegions.join(', ')}.`
    : "Search globally for the best matches.";

  const prompt = `
    Act as a B2B lead generation expert and market researcher. 
    Our business profile: "${profile.companyName}" (${profile.industry}). ${profile.description}.
    Core Keywords: ${profile.keywords.join(', ')}.
    ${regionsPrompt}

    ${exclusionPrompt}

    TASK: Find 6-8 REAL potential B2B clients using Google Search. Perform a deep search including SMEs, startups, and niche market players.
    
    You MUST format each company exactly as follows for parsing:
    ---COMPANY_START---
    Name: [Full Company Name]
    Industry: [Industry Sector]
    Size: [Estimated Company Size/Stage, e.g., "Startup", "SME", "Enterprise"]
    Description: [1-2 sentences describing their operations]
    WhyFit: [Specific strategic reason they need our services in their region]
    ContactInfo: [If available, provide website or contact details, separated by commmas]
    ---COMPANY_END---

    Ensure the companies are currently active. Provide a high-level summary of the regional market opportunity after the list.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        // tools: [{ googleSearch: {} }],                      //Commented temporarily as free limit exceeded
        temperature: 0.7,
      },
    });

    const text = response.text || "";
    const leads: Lead[] = [];
    
    const companyBlocks = text.split('---COMPANY_START---');
    companyBlocks.forEach((block) => {
      if (!block.includes('---COMPANY_END---')) return;
      const content = block.split('---COMPANY_END---')[0];
      
      const getValue = (key: string) => {
        const match = content.match(new RegExp(`${key}:\\s*(.*)`, 'i'));
        return match ? match[1].trim() : "";
      };

      const name = getValue('Name');
      if (name) {
        leads.push({
          id: Math.random().toString(36).substr(2, 9),
          name,
          industry: getValue('Industry'),
          size: getValue('Size'),
          description: getValue('Description'),
          ContactInfo: getValue('ContactInfo'),
          whyFit: getValue('WhyFit'),
          isExistingClient: false
        });
      }
    });

    const sources: GroundingSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || "Search Reference",
        uri: chunk.web?.uri || "#"
      })) || [];

    return {
      leads,
      sources,
      rawText: text
    };
  } catch (error) {
    console.error("Error in lead generation service:", error);
    throw error;
  }
}
