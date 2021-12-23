// controller for login:

const loginUser = (req, res)=>{
    const {name} = req.body;
    if(name){
        return res.status(200).json({success : true, msg : `Welcome ${name}`})
    }
    res.status(400).json({success : false, msg : `Enter valid credentials!`})
}

module.exports = { loginUser }