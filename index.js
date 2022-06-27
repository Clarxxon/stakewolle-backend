require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const router = require('./routes/index')
const NetCardController = require('./Controllers/NetCardController')
const fileUpload = require('express-fileupload')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const port = process.env.PORT || 8000
const path = require('path')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(fileUpload({}))
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(cors())
app.use('/api', router)

app.use(errorHandler)


const start = async () => {
		try {
			app.listen(port, () => console.log(`Started on ${port} port`))
			setInterval(async () => {
				await NetCardController.refresh()
				console.log('Database has been refreshed')
			}, 2 * 60 * 60 * 1000) // every 2 hours
		}catch(e) {
			console.log(e)
		}
}


start()