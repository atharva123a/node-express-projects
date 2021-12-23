const auth = (req, res, next)=>{
    const {user} = req.query;

    // we bluff authorized a user:
    if(user === 'john'){
        req.user = {name:"john", id : 3}
        next()
    }
    else {
        res.status(401).send("Unauthorized")
    }
}

module.exports = auth;