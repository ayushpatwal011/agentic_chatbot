import { addMessages } from "../config/memory.js";
import { graph } from "../graph/graph.js";
import axios from "axios";
import fs from "fs";

export const agent = async (req, res, next) => {
  try {
    const { prompt, conversationId, agent } = req.body;
    const file = req.file;
    

    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: "user",
      content: prompt,
    });
    const result = await graph.invoke({
      prompt,
      conversationId,
      agent,
      file,
    });
    
    await addMessages({ conversationId, role: "user", content: prompt });
    await addMessages({
      conversationId,
      role: "assistant",
      content: result.aiResponse,
    });
    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: "assistant",
      content: result?.aiResponse,
      images: result?.images,
      artifacts: result?.artifacts,
    });
    return res.status(200).json({
      answer: result?.aiResponse,
      images: result?.images,
      artifacts: result?.artifacts,
    });
  } catch (e) {
    next(e)
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};
