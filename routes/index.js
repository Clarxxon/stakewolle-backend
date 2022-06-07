const Router = require('express')
const router = new Router()
const NetCardRouter = require('./NetCardRouter')
const UsersRouter = require('./UsersRouter')

router.use('/net-card', NetCardRouter)
router.use('/users', UsersRouter)

module.exports = router