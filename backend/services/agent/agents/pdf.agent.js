import { getModel } from "../config/llmModels.js";
import { generatePDF } from "../utils/generatepdf.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import checkAgentLimit from "./ratelimit.js";

export const pdfAgent = async (state) => {
  try {
        await checkAgentLimit(state.userId, 'pdf');
    const llm = getModel("pdf");
    const prompt = `
You are an elite professional document writer and content strategist.
First, think about what are the most important sub-topics to cover for: ${state.prompt}
Then write the final presentation content.

Generate a well-structured, detailed document outline based on the user's topic below.

Requirements:
- Generate 4 to 5 sections
- Each section must have 3 to 5 concise, informative bullet points
- Title should be short and compelling
- Subtitle should briefly expand on the title's context
- Section headings should be clear and topic-specific
- Bullet points should be well-researched, specific, and non-generic
- Do NOT include markdown, code fences, or any explanation
- Return ONLY valid JSON matching this exact structure:

{
  "title": "",
  "subtitle": "",
  "sections": [
    {
      "heading": "",
      "points": []
    }
  ]
}
Only return the final JSON. Do not include your thinking process in the output.
`;

    const res = await llm.invoke(prompt)
    const data = JSON.parse(res.content);
    const pdfBuffer  =await generatePDF(data)

    const filename = `pdf-${Date.now()}.pdf`
    await uploadToS3(filename, pdfBuffer, "application/pdf")

    const downloadUrl = await getFromS3(filename, 24*60)
    
    return {
        ...state,
        aiResponse: `### PDF Document Generated Successfully!

[Download PDF Document](${downloadUrl})

*Note: The download link is secure and will expire in 24 hours.*`
    }


  } catch (error) {
    console.error("pdgagent error", error);
    
    return { ...state, aiResponse: "Failed to generate Pdf" };
  }
};
