const asyncWrapper = (fn)=>{
    return async(req, res, next)=>{
        try {
            await fn(req, res, next)
        }catch(error){
            // it is calling the next middleware to handle the error!
            next(error)
        }
    }
}

module.exports = asyncWrapper;