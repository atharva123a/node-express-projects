// controllers for our application


require('dotenv').config()

const CustomAPIError= require("../errors/custom-error")

const jwt = require('jsonwebtoken')



const loginUser = async(req, res)=>{

    // ways to validate:
    // using mongoose validators:
    // joi a package that allows us to validate data
    // custom validation

    const { username, password } = req.body
    if(!username || !password){
        throw new CustomAPIError(
            `Please provide a valid username and password`, 400)
    }
    const id = new Date()
    // creates a token passsing it payload, our secret code and 
    // the expiry date for the token
    const token = jwt.sign({id, username},
        process.env.JWT_SECRET, {expiresIn : '30d'})
    res.status(200).json({msg : "user created", token})
}

const dashBoard = async(req, res) =>{
    
    const authHeader = req.headers.authorization;
    
    if(!authHeader || authHeader.startsWith('Bearer') === false){
        throw new CustomAPIError(`No token provided!`, 401)
    }
    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded)
        const secret = Math.floor(Math.random() * 100)
        res.status(200).json({
            msg :  `Welcome, ${decoded.username}`,
            "secret" : `This is your secret token : ${secret}`
        })
    } catch (error) {
        throw new CustomAPIError("Invalid Token", 401)
    }
}

module.exports = {loginUser, dashBoard}