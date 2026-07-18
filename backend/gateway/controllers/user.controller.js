export const getCurrentUser = async (req, res) => {
	try {
		return res.status(200).json({ user: req.user })
	} catch (e) {
		return res.status(500).json({ message: 'getcurrentuser error', })
	}
}