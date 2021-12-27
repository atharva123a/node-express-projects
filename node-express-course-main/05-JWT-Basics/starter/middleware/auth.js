// middleware for authenticating user:

require('dotenv').config()

const CustomAPIError = require('../errors/custom-error')

const jwt = require('jsonwebtoken')

const authMiddleWare = async(req, res, next)=>{
    let token = req.headers.authorization
    if(!token || token.startsWith("Bearer") === false){
        throw new CustomAPIError(`No token found`, 401)
    }
    token = token.split(' ')[1]
    try {
       const data = jwt.verify(token, process.env.JWT_SECRET)
       const {id, username} = data;
       req.headers.userInfo = {id, username}
    } catch (error) {
        throw new CustomAPIError('Invalid token', 401)
    }
    next()
}

module.exports = authMiddleWare