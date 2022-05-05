const Router = require('express')
const router = new Router()
const AdminController = require('../Controllers/AdminController')

router.get('/', AdminController.verify)

module.exports = router