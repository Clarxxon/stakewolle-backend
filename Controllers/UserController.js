const { User, Roles } = require('../models/models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const ApiError = require('../error/ApiError')

const generateToken = (id, email, roles) => {
		return jwt.sign(
				{ id, email, roles },
				process.env.SECRET_KEY,
				{ expiresIn: '24h' }
		)
}

class UserController {
		async registration(req, res, next) {
				const { email, password } = req.body;
				try {
						const candidate = await User.findOne({where: {email}})
						if (candidate) {
								return next(ApiError.badRequest('Пользователь с таким email уже существует'))
						}
						const hashPassword = bcrypt.hashSync(password, 5)
						const user = await User.create({email, password: hashPassword})
						const roles = await Roles.create({userId: user.id})
						const token = generateToken(user.id, email, roles.roles)
						res.json({token})
				}catch (e) {
						next(ApiError.badRequest(e.message))
				}
		}
		async login(req, res, next) {
				const { email, password } = req.body
				try {
						const user = await User.findOne({where: {email}})
						if (!user) {
								return next(ApiError.badRequest('Пользователь с таким email не зарегистрирован'))
						}
						const comparePassword = bcrypt.compareSync(password, user.password)
						if (!comparePassword) {
								return next(ApiError.badRequest('Неверный пароль'))
						}
						const roles = await Roles.findOne({where: {userId: user.id}})
						const token = generateToken(user.id, user.email, roles.roles)
						res.json(token)
				}catch(e) {
						next(ApiError.badRequest(e.message))
				}
		}
		async getAll(req, res, next) {
				const users = await User.findAll({
						include: [{model: Roles}]
				})
				res.json(users)
		}
}

module.exports = new UserController()