import { api } from "../utils/axios";

const getCurrentUser = async () => {
	try {
		const { data } = await api.get('/me')
		return data
	} catch (e) {
		console.error('error in getCurrentUser', e);
		return null
	}
}
export default getCurrentUser