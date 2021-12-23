// handle routes in this case:

const { Router } = require('express')
const express = require('express')

const route = express.Router()

route.get('/',(req, res)=>{
    res.status(200).json({"success" : true,
    "data" : 'no data curretly!'
})
})

route.post('/', (req, res)=>{
    const { name } = req.body;
    if(name.length < 1){
        console.log("failed to add task!")
        return res.status(401).json({succcess : false, msg : "Please Enter some task!"})
    }
    else {
        console.log("here added task!")
        res.status(200).json({success : true, data : name})
    }
})

module.exports = route;