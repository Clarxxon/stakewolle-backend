class AdminController {
		verify(req, res, next) {
				const {password} = req.query
				if (password === process.env.ADMIN_PASSWORD) {
						res.json({access: true})
				} else {
						res.json({access: false})
				}
		}
}

module.exports = new AdminController()