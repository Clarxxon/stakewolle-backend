require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const sequelize = require('./db')
const models = require('./models/models')
const router = require('./routes/index')
const fileUpload = require('express-fileupload')
const port = process.env.PORT || 5000
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

				app.listen(process.env.PORT || 3000, () => console.log(`Started on ${port} port`))
		}catch(e) {
				console.log(e)
		}
}


start()