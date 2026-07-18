import fs from "fs";
import { PDFParse } from "pdf-parse"; // note: PDFParse, not PdfParse
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { vectorStore } from "../config/vectorDb.js";
import { getModel } from "../config/llmModels.js";
import checkAgentLimit from "./ratelimit.js";

export const pdfRag = async (state) => {

    await checkAgentLimit(state.userId, 'pdf');

  let parser;
  try {
    if (!state.file?.path) {
      return { ...state, aiResponse: "No PDF file was provided." };
    }
    const buffer = fs.readFileSync(state.file.path);
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const text = result.text;

    if (!text?.trim()) {
      return { ...state, aiResponse: "Could not extract any text from this PDF." };
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const docs = await splitter.createDocuments([text]);
    const collectionName = `pdf-${Date.now()}`;

    const store = await vectorStore(docs, collectionName);
    const relevantDocs = await store.similaritySearch(state.prompt, 4);

    if (relevantDocs.length === 0) {
      return { ...state, aiResponse: "I could not find the information from the uploaded PDF." };
    }

    const context = relevantDocs.map((d) => d.pageContent).join("\n\n");
    const llm = await getModel("pdfRag");

    const message = [
      new SystemMessage(
        `You are a PDF helper bot. You must answer questions related to the PDF content.
        Rules:
        - Answer only from the PDF context
        - Do not answer questions unrelated to the PDF content
        - If the question is unrelated, say you could not find the information in the uploaded PDF
        - Use Markdown formatting`
      ),
      new HumanMessage(`Context: ${context}\n\nQuestion: ${state.prompt}`),
    ];

    const res = await llm.invoke(message);

    return { ...state, aiResponse: res.content };
  } catch (error) {
    console.error("error in pdfRag", error);
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed to generate PDF."
    };
  } finally {
    if (parser) {
      try {
        await parser.destroy(); 
      } catch (e) {
        console.error("parser cleanup failed", e);
      }
    }
    if (state.file?.path) {
      try {
        fs.unlinkSync(state.file.path);
      } catch (e) {
        console.error("Failed to unlink file in pdfRag:", e);
      }
    }
  }
};