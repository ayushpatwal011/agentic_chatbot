import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { getModel } from "../config/llmModels.js";
import axios from "axios";
import checkAgentLimit from "./ratelimit.js";

export const imageGenAgent = async (state) => {
  try {

    await checkAgentLimit(state.userId, 'vision');
    
    const llm = getModel("vision");
    const res = await llm.invoke(`You are an elite AI image prompt engineer.
Convert the user request into a highly detailed prompt for image generation.

Requirements:
- Cinematic lighting
- Professional composition
- Ultra realistic
- High detail
- Beautiful color palette
- Sharp focus
- 8k quality
- Photorealistic
- Depth of field

Return only the image prompt.

User request:
${state.prompt}`);
    const prompt = res.content.trim();

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    const imageRes = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 30000,
    });

    const buffer = Buffer.from(imageRes.data);
    const filename = `image-${Date.now()}.png`;

    await uploadToS3(filename, buffer, "image/png");
    const downloadUrl = await getFromS3(filename, 24*60);

    return {
      ...state,
      aiResponse: `Here is the image I generated for you:

[Download Image](${downloadUrl})

*Note: The download link is secure and will expire in 24 hours.*`,
      images: [downloadUrl],
    };
  } catch (error) {
     console.log("error in vision agent", error);
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed to generate image."
    };

  }
};
