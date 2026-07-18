import { getMessages } from "../utils/getMessages.js";
import redis  from "../../../shared/redis/redis.js";

export const getMemory = async (conversationId) => {
    const key = `messages-${conversationId}`

    const exists = await redis.get(key);

    if (exists) {
       return JSON.parse(exists);
    }
    const messages = await getMessages(conversationId);
    if (!messages) {
        return [];
    }
    await redis.set(key, JSON.stringify(messages), "EX", 24*60*60);
    return messages;
};

export const addMessages = async ({ conversationId, role, content }) => {
    const key = `messages-${conversationId}`;

    const rawMessages = await redis.get(key);
    const messages = rawMessages ? JSON.parse(rawMessages) : [];
    
    messages.push({role, content});
    if (messages.length > 20) {
        messages.shift();
    }

    await redis.set(key, JSON.stringify(messages), "EX", 24*60*60);
}