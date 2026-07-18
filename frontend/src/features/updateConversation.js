import { api } from "../utils/axios"

export const updateConversation = async (payload) => {
    try {
        const {data} = await api.post('/chat/update-conversation', payload)
        return data
    } catch (e) {
        console.error("error in updating conversation", e)
        return []
    }
}