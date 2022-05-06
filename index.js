require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const sequelize = require('./db')
const models = require('./models/models')
const router = require('./routes/index')
const fileUpload = require('express-fileupload')
const port = process.env.PORT || process.env.DEV_PORT || 8000
const path = require('path')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(fileUpload({}))
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(cors())
app.use('/api', router)


const start = async () => {
		try {
				await sequelize.authenticate()
				await sequelize.sync()
				console.log('started')

				//app.listen(port, () => console.log(`Started on ${port} port`))
		}catch(e) {
				console.log(e)
		}
}


start()