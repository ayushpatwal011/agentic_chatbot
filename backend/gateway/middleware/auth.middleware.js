import redis from '../../shared/redis/redis.js'

export const protect = async (req, res, next) => {
	try {
		const sessionId = req.cookies?.session

		if (!sessionId) {
			return res.status(401).json({ message: 'Unauthorized : session not found' })
		}
		const session = await redis.get(`session:${sessionId}`)
		if (!session) {
			return res.status(401).json({ message: "session expired or invalid" })
		}
		const user = JSON.parse(session)
		req.user = user
		next()
	} catch (e) {
		return res.status(500).json({ message: 'Internal server error' })
	}
}