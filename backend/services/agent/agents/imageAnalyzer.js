import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import fs from "fs/promises";
import checkAgentLimit from "./ratelimit.js";

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export const imageAnalyzer = async (state) => {
  
  try {
    await checkAgentLimit(state.userId, 'vision');
    if (!state?.file?.path) {
      return { ...state, aiResponse: "No image file was provided." };
    }

    if (!ALLOWED_MIME_TYPES.includes(state.file.mimetype)) {
      return { ...state, aiResponse: "Unsupported file type. Please upload a valid image." };
    }

    const llm = await getModel("imageAnalyzer");
    const imageBuffer = await fs.readFile(state.file.path);
    const base64img = imageBuffer.toString("base64");

    const message = [
      new SystemMessage(
        `You are an expert image analysis agent.
        Rules:
        - Analyse only the uploaded image
        - Answer the user's question accurately
        - If text exists in the image, extract it
        - If a chart or table exists, explain it
        - If something is blurry or unclear, say so
        - Use Markdown when helpful
        - Do not hallucinate`
      ),
      new HumanMessage({
        content: [
          {
            type: "text",
            text: state.prompt || "Please analyze this image.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${state.file.mimetype};base64,${base64img}`,
            },
          },
        ],
      }),
    ];

    const res = await llm.invoke(message);

    return {
      ...state,
      aiResponse: res.content,
    };
  } catch (error) {
     console.error("error in imageAnalyzer", error);
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed to Analyze image."
    };
  } finally {
    if (state.file) {
      
      await fs.unlink(state.file.path);
    }

    }
};