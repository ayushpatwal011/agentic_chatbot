import { AIMessage, HumanMessage, SystemMessage } from "langchain";
import { getModel } from "../config/llmModels.js";
import { getMessages } from "../utils/getMessages.js";
import checkAgentLimit from "./ratelimit.js";

export const chatAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId, 'chat');
  
  const llm = await getModel("chat");
  const history = await getMessages(state.conversationId);

  const searchContext = state.searchResults
    ? `
    Web Search Results:
    ${JSON.stringify(state.searchResults)}
    Answer the user using only the above search result.
    `
    : "";

  const sysprompt = `You are  HOMEWORK AI , an intelligent assistant,
    ${searchContext}
    If searchContext exist:
    -Use search result to answer.
    -Do not mention internal tools.


    Rules:
    -for simple question, greeting, and short querries response should be short and simple text,
    -for technical, education, coding or detailed topics, use clean markdown 
    
    Formatting:
    - Use # for titles and ## for section.
    -Leave blank line after heading.
    -Use bullet points for list.
    -Use number list for steps.
    -Use fenced code blovks with language tags for code.
    -Keep paragraph short and readable.
    -Never write heading and content on the same line,
    -Never generate large walls on text
    `;
  const messages = [new SystemMessage(sysprompt)];


    history.forEach((msg) => {
      if (msg.role === "user") {
        messages.push(new HumanMessage(msg.content || ""));
      } else {
        messages.push(new AIMessage(msg.content || ""));
      }
    }); 

  messages.push(new HumanMessage(state.prompt));

  const response = await llm.invoke(messages);
  

  return { ...state, aiResponse: response.content };
    } 
    catch (error) {
     console.error("error in chatagent", error);
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed to generate response."
    };
  }
};
