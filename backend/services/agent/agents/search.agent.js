import searchTool from "../config/tavily.js";
import checkAgentLimit from "./ratelimit.js";

export const searchAgent = async (state) => {
    await checkAgentLimit(state.userId, 'search');
    try {
        const result = await searchTool.invoke({
            query: state.prompt
        });
             
        return {
            ...state,
            searchResults: result,
            images: result.images 
        };
        
    } catch (e) {
        console.error("error in searchagent", e);
        return {
            ...state,
            searchResults: [],
            images: [],
            aiResponse: e?.data?.message || "Failed to fetch search results."
        };
    }
};