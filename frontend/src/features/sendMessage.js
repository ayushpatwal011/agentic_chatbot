import { api } from "../utils/axios";

export const sendMessage = async (payload) => {
    try {
        const { data } = await api.post('/agent/chat', payload)
        return data
    } catch (e) {
        console.error("error in sendMessage", e);
        return null
    }
}