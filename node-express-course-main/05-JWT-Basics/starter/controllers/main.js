// controllers for our application


require('dotenv').config()

const CustomAPIError= require("../errors/custom-error")

const jwt = require('jsonwebtoken')



// const authMiddleWare = require('../middleware/auth')

const { StatusCodes } = require('http-status-codes')

const loginUser = async(req, res)=>{

    // ways to validate:
    // using mongoose validators:
    // joi a package that allows us to validate data
    // custom validation

    const { username, password } = req.body
    if(!username || !password){
        throw new CustomAPIError(
            `Please provide a valid username and password`, StatusCodes.BAD_REQUEST)
    }
    const id = new Date()
    // creates a token passsing it payload, our secret code and 
    // the expiry date for the token
    const token = jwt.sign({id, username},
        process.env.JWT_SECRET, {expiresIn : '30d'})
    res.status(StatusCodes.CREATED).json({msg : "user created", token})
}

const dashBoard = async(req, res) =>{
    // we have successfully refactored our code:
    const { username } = req.headers.userInfo
    const secret = Math.ceil(Math.random() * 100) // 1 to 100
    res.status(200).json({
        msg :  `Welcome back, ${username}`,
        "secret" : `Your secret token is : ${secret}`
    }) 
}

module.exports = {loginUser, dashBoard}