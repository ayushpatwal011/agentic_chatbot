import { api } from "../utils/axios";

export const logout = async () => {
    try {
        await api.get('/auth/logout')
    } catch (e) {
        console.error("error logout", e);
    }
}