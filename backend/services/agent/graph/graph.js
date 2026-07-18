import { StateGraph, START, END } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { chatAgent } from "../agents/chat.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { imageGenAgent } from "../agents/vision.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { router } from "./router.js";
import { pdfRag } from "../agents/pdfRag.js";
import { imageAnalyzer } from "../agents/imageAnalyzer.js";

const workflow = new StateGraph(agentState);

workflow.addNode('router', router)
workflow.addNode('chat', chatAgent)
workflow.addNode('search', searchAgent)
workflow.addNode('pdf', pdfAgent)
workflow.addNode('ppt', pptAgent)
workflow.addNode('vision', imageGenAgent)
workflow.addNode('coding', codingAgent)

workflow.addNode('pdfRag', pdfRag)
workflow.addNode('imageAnalyzer', imageAnalyzer)


workflow.addEdge(START, 'router')
workflow.addConditionalEdges('router',(state) => {
    switch (state.agent) {
        case 'chat':
            return 'chat'
        case 'search':
            return 'search'
        case 'pdf':
            return 'pdf'
        case 'ppt':
            return 'ppt'
        case 'vision':
            return 'vision'
        case 'coding':
            return 'coding'
        case 'pdfRag':
            return 'pdfRag'
        case 'imageAnalyzer':
            return 'imageAnalyzer'
        default:
            return 'chat'
    }
},{
    chat: 'chat',
    search: 'search',
    pdf: 'pdf',
    ppt: 'ppt',
    vision: 'vision',
    coding: 'coding',
    pdfRag: 'pdfRag',
    imageAnalyzer: 'imageAnalyzer',
})

workflow.addEdge('search', 'chat')
workflow.addEdge('chat', END)
workflow.addEdge('pdf', END)
workflow.addEdge('ppt', END)
workflow.addEdge('vision', END)
workflow.addEdge('coding', END)
workflow.addEdge('pdfRag', END)
workflow.addEdge('imageAnalyzer', END)

export const graph = workflow.compile()

