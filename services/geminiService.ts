import { GoogleGenAI, Type } from "@google/genai";
import { ClassificationResult, ClaimRecord } from '../types';
import { COVERAGE_DESCRIPTIONS } from './mockData';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({ apiKey });
};

// Simulated System Prompt for Classification based on user's dataset patterns
const CLASSIFICATION_SYSTEM_INSTRUCTION = `
You are an advanced Deep Learning Text Classifier for an Insurance Classification System.
Your goal is to address the challenges of unstructured text data and class imbalance in insurance claims.

Task:
1. Analyze the input claim description. Handle unstructured nuances, typos, abbreviations (e.g., "IV" for Insured Vehicle, "OV" for Other Vehicle), and complex sentence structures.
2. Extract "Meaningful Features": Identify key entities, vehicle parts, injury types, or environmental factors that drive the decision (mimicking deep learning feature extraction).
3. Classify the claim into the correct "Coverage Code" and "Accident Source".
4. Provide a confidence score based on the clarity of the pattern.

Here is the schema for Coverage Codes observed in the 190k training set:
- AD: Auto Damage (Collision, Rear-end, Backing into, Merging)
- GB: General Liability/Bodily Injury (Slip and fall, Elevator accidents, Premises liability)
- PA: Personal/Product Liability (Hot coffee burns, Food products, Lid popping off)
- AB: Auto Bodily Injury (Passenger injuries, Multi-vehicle collision)
- AL: Auto Liability (Loading/Unloading, Machinery operation causing damage)
- GD: General Damage (Excavation, Chemical emissions, Environmental)
- RC: Residential/Commercial (Appliance failure, Spoilage)
- AN: Auto vs Pedestrian/Bicycle

Return the result in JSON format.
`;

export const classifyClaimDescription = async (description: string): Promise<ClassificationResult> => {
  try {
    const ai = getAiClient();
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Classify this unstructured claim description: "${description}"`,
      config: {
        systemInstruction: CLASSIFICATION_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coverageCode: { type: Type.STRING, description: "The 2 letter coverage code" },
            accidentSource: { type: Type.STRING, description: "The source or cause of the accident" },
            confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 100" },
            reasoning: { type: Type.STRING, description: "Why this classification was chosen" },
            extractedFeatures: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 3-5 key phrases or entities extracted from the text (e.g., 'Rear-ended', 'Wet floor')" 
            }
          },
          required: ["coverageCode", "accidentSource", "confidence", "reasoning", "extractedFeatures"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ClassificationResult;
    }
    throw new Error("No response from model");
  } catch (error) {
    console.error("Classification error:", error);
    throw error;
  }
};

export const chatWithDataset = async (
  message: string, 
  history: { role: string, parts: { text: string }[] }[],
  datasetContext: ClaimRecord[]
) => {
  try {
    const ai = getAiClient();

    // In a real production app with 190k rows, we would use a Vector DB (RAG).
    // For this frontend demo, we serialize a subset of the dataset (top 50 rows) into the prompt context.
    const contextString = JSON.stringify(datasetContext.slice(0, 50));

    const systemInstruction = `
      You are an AI Assistant for an Insurance Analytics platform. 
      You have access to a dataset of insurance claims (Provided below as context).
      
      Your goals:
      1. Answer questions about specific claims in the context.
      2. Analyze trends (e.g., "What is the most common accident source?").
      3. Explain coverage codes.
      
      If the user asks about specific stats that require calculation on the whole 190k dataset, 
      provide an estimate based on the provided sample context or explain that you are analyzing the visible sample.
      
      Dataset Context Sample:
      ${contextString}
      
      Reference for Codes:
      ${JSON.stringify(COVERAGE_DESCRIPTIONS)}
    `;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};