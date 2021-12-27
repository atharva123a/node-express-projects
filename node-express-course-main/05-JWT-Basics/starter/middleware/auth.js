// middleware for authenticating user:

require('dotenv').config()


const { BadRequestError, 
    UnauthenticatedError, 
    CustomAPIError}  = require('../errors/index')

const jwt = require('jsonwebtoken')


const authMiddleWare = async(req, res, next)=>{
    let token = req.headers.authorization
    if(!token || token.startsWith("Bearer") === false){
        throw new BadRequestError('No token found!')
    }
    token = token.split(' ')[1]
    try {
       const data = jwt.verify(token, process.env.JWT_SECRET)
       const {id, username} = data;
       req.headers.userInfo = {id, username}
    } catch (error) {
        throw new UnauthenticatedError(`Invalid Token`)
    }
    next()
}

module.exports = authMiddleWare