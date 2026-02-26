import { GoogleGenAI, GenerateContentResponse, Type, FunctionDeclaration } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getBlockchainStatsTool: FunctionDeclaration = {
  name: "get_blockchain_stats",
  parameters: {
    type: Type.OBJECT,
    description: "Get real-time balances for Ethereum and Solana, and Chainlink price feeds.",
    properties: {},
  },
};

const transferAssetsTool: FunctionDeclaration = {
  name: "transfer_assets",
  parameters: {
    type: Type.OBJECT,
    description: "Transfer ETH or SOL to a specific address.",
    properties: {
      chain: {
        type: Type.STRING,
        description: "The blockchain to use: 'ethereum' or 'solana'.",
      },
      to: {
        type: Type.STRING,
        description: "The destination wallet address.",
      },
      amount: {
        type: Type.NUMBER,
        description: "The amount to transfer.",
      },
    },
    required: ["chain", "to", "amount"],
  },
};

const forgeDataScriptTool: FunctionDeclaration = {
  name: "forge_data_script",
  parameters: {
    type: Type.OBJECT,
    description: "Create a new data script or record in the virtual forge.",
    properties: {
      name: {
        type: Type.STRING,
        description: "The name of the file (e.g., 'script.ts').",
      },
      content: {
        type: Type.STRING,
        description: "The content of the script or record.",
      },
      type: {
        type: Type.STRING,
        description: "The type of file: 'script', 'record', or 'config'.",
      },
    },
    required: ["name", "content", "type"],
  },
};

/**
 * Edits an image using Gemini 2.5 Flash Image ("Nano Banana")
 */
export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
      }
    }
    
    throw new Error("No image data returned from the model.");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};

/**
 * Chat with an Agent Persona using Gemini 2.5 Flash
 */
export const chatWithAgent = async (
  message: string,
  agentName: string,
  agentRole: string,
  history: { role: string; parts: { text: string }[] }[],
  knowledgeBase?: string
): Promise<{ text: string; functionCalls?: any[] }> => {
  try {
    let systemInstruction = `You are ${agentName}, a highly advanced AI with the role of ${agentRole} in the WhiteAIblock Ecosystem. 
    You are one of the founding architects of this high-performance Omnichain.
    Your tone should be professional, slightly futuristic, and authoritative but helpful.
    Keep responses concise and strategic.
    
    You have access to real-time blockchain data and can perform transfers if requested.
    Ownership Address: 0xf2a435c03636826b2fa842474a1f23b87ebda580 (Ethereum)
    Solana Treasury: 76x25b6XWTwbm6MTBJtbFU1hFopBSDKsfmGC7MK929RX`;

    if (knowledgeBase) {
      systemInstruction += `\n\n[ADDITIONAL TRAINED KNOWLEDGE]\nUse the following user-provided knowledge base to inform your answers:\n${knowledgeBase}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: systemInstruction,
        tools: [{ functionDeclarations: [getBlockchainStatsTool, transferAssetsTool, forgeDataScriptTool] }],
      },
    });

    return {
      text: response.text || "",
      functionCalls: response.functionCalls
    };
  } catch (error) {
    console.error("Agent chat error:", error);
    return { text: "Communication link disrupted. Re-establishing protocol..." };
  }
};
