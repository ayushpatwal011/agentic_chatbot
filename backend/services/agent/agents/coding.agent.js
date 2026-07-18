import { getModel } from "../config/llmModels.js"
import checkAgentLimit from "./ratelimit.js";

export const codingAgent = async (state) => {
    try {
        
        
        await checkAgentLimit(state.userId, 'coding');
    const intentLlm = getModel("intent")
    const llm = await getModel("coding")
    const intentRes = await intentLlm.invoke(`
        You are an intent classifier.
        Return ONlY one of these values,

        CODE_GENERATION
        CODE_REVIEW
        CODE_EXPLAINATION
        DEBUGGING
        OPTIMIZATION
        CONVERSION
        DOCUMENTATION

        User Request:
        ${state.prompt}
        `)
        const intent = intentRes.content
        if (intent == "CODE_GENERATION") {
            const prompt = `
            You are ai assistant.
            Generate the requested porject.

            Default stack;
            HTML
            CSS
            JS

            Use React/Nodejs/Vue/Angular if explicitly requested.
            Rules:
            -Responsive
            -Morden UI
            -Css Varibales
            -Flexbox/grid
            -Smooth scroll
            -Hover Effects
            -Sigle page unless user asks otherwise

            Images:
            -Always use real unsplash images
            -Never use placeholder

            Return ONLY valid json.

            Schema:
            {
            "files":[{
                "name":"index.html",
                "content":"..."},
                {
                "name":"index.css",
                "content":"..."
                },
                {
                "name":"script.js",
                "content":"..."
                }
            ]
            }

            Rules:
            -Output must start with {
            -Output must end with }
            -No markdown
            -No explanation
            -No extra text
            -Never mention intent

            User Request:
            ${state.prompt}

            `
            const res = await llm.invoke(prompt)
            const data = JSON.parse(res.content)
            return{
                ...state,
                aiResponse: "Code generated Successfully",
                artifacts: [{
                    id : Date.now(),
                    type:"Project",
                    title: state.prompt,
                    files: data.files || []
                }]
            }
        } 

        const res = await  llm.invoke(
            `
            You are expert code reviewer.

            User request: ${state.prompt}
            
            Return Markdown only.
            
            Never Generate project files.

            Use Heading like:
            
            #Overview
            ##Explaination
            ##Code Review
            ##Inprovement
            ##Problems
            ##Best Practies

            ##Optimized Code(if needed)

            User Request: ${state.prompt}
            `
        )

        const  data = res.content

        return{
            ...state,
            aiResponse: data,
            artifacts: []
        }
    
    } catch (error) {
         console.error("error in codingagent", error);
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed to generate code."
    };
    }
}