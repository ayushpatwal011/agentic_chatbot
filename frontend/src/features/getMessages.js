import { api } from "../utils/axios";

export const getMessages = async (id) => {
    try {
        const { data } = await api.get(`/chat/get-messages/${id}`)
        return data;
    } catch (e) {
        console.error("error getMessages", e);
        return []
    }
}