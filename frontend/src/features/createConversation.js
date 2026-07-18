import { api } from "../utils/axios"

export const createConversation = async () => {
    try {
        const {data} = await api.get('/chat/create-conversation')
        return data
    } catch (e) {
        console.error("error in creating conversation", e)
        return []
    }
}