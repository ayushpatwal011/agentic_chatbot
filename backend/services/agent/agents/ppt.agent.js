import { generatePPT } from "../utils/generateppt.js";
import { getModel } from "../config/llmModels.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import checkAgentLimit from "./ratelimit.js";

export const pptAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId, "ppt");
    const llm = getModel("ppt");
    const prompt = `
You are an elite professional presentation writer and content strategist.
First, think about what are the most important sub-topics to cover for: ${state.prompt}
Then write the final presentation content.

Generate a well-structured, detailed slide deck outline based on the user's topic below.

Requirements:
- Generate exactly 6 slides
- Each slide must have 4 to 6 concise, informative bullet points
- Title should be short and compelling
- Subtitle should briefly expand on the title's context
- Slide titles should be clear and topic-specific
- Bullet points should be specific, well-researched, and non-generic (avoid vague filler like "overview" or "conclusion" with no substance)
- Keep each bullet point short — ideally under 15 words, suitable for on-screen display
- Do NOT include markdown, code fences, or any explanation
- Return ONLY valid JSON matching this exact structure:

{
  "title": "",
  "subtitle": "",
  "slides": [
    {
      "title": "",
      "points": ["", "", ""]
    }
  ]
}
Only return the final JSON. Do not include your thinking process in the output.


`;
    const res = await llm.invoke(prompt);
    const data = JSON.parse(res.content);
    const buffer = await generatePPT(data);

    const filename = `ppt-${Date.now()}.pptx`;
    await uploadToS3(
      filename,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );
    const downloadUrl = await getFromS3(filename, 24 * 60);

    return {
      ...state,
      aiResponse: `### PPT Generated Successfully!

**${data.title}**

[Download PPT Document](${downloadUrl})

*Note: The download link is secure and will expire in 24 hours.*`,
    };
  } catch (error) {
    console.error("error in pptagent", error);
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed to generate PPT presentation."
    };
  }
};
