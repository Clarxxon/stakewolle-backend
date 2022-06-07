const Router = require('express')
const router = new Router()
const NetCardController = require('../Controllers/NetCardController')

// router.post('/', NetCardController.create)
router.get('/', NetCardController.getAll)
router.get('/more/:id', NetCardController.getMoreData)

module.exports = router