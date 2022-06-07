const Router = require('express')
const router = new Router()
const UserController = require('../Controllers/UserController')

router.post('/registration', UserController.registration)
router.get('/login', UserController.login)
router.get('/', UserController.getAll)

module.exports = router