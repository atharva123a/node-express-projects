
const { customApiError } = require('../errors/custom-error')

const errorHandleMiddleWare = (err, req, res, next)=>{
   
    if(err instanceof customApiError){
        return res.status(err.statusCode).json({msg : err.message})
    }
    return res.status(500).
    json({msg : `Something went wrong, please try again later`})
}

module.exports = errorHandleMiddleWare