const Router = require('express')
const router = new Router()
const NetCardRouter = require('./NetCardRouter')
const AdminRouter = require('./AdminRouter')

router.use('/net-card', NetCardRouter)
router.use('/admin-login', AdminRouter)

module.exports = router