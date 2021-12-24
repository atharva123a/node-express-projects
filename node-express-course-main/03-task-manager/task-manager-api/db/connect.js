
const mongoose = require('mongoose')


const connect = (url)=>{
    // returns a promise!
    mongoose.connect(url, {
        useNewUrlParser : true,
        useCreateIndex : true,
        useFindAndModify : false,
        useUnifiedTopology : true     
    })
}

module.exports = connect;