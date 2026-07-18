import { getModel } from "../config/llmModels.js"

export const router = async (state) => {

    if(state.agent && state.agent !== "auto"){
        return {...state, agent: state.agent}
    }

    if (state.file?.mimetype === "application/pdf") {
        return { ...state, agent: "pdfRag" }
    }
    if (state.file?.mimetype?.startsWith("image/")) {
        return { ...state, agent: "imageAnalyzer" }
    }

    const llm = await getModel("router")
    const prompt = ` You are an agent router.
    Available agents
    -chat
    -search
    -pdf
    -ppt
    -vision
    -coding

    Rules:
    chat:
    General conversation,
    explaination,
    learning,
    question

    search:
    current event
    latest info
    news
    fact checking

    pdf:
    Question about generate pdf
    or document context

    ppt:
    Question about generate ppt
    or presentation context

    vision:
    Image generation
    image editing
    image analysis

    coding:
    code generation
    code debugging
    explanation of code
    build project
    api design

    Return only one word:
    'chat' or 'search' or 'pdf' or 'ppt' or 'vision' or 'coding'

    User Quary:
    ${state.prompt}
    `

    const response = await llm.invoke(prompt)
    const agent = response.content.toLowerCase().trim();

    const validAgent = ['chat','search','pdf','ppt','vision','coding']
    if(validAgent.includes(agent)){
        return {...state, agent:agent}
    }
    return {...state, agent:'chat'}

}