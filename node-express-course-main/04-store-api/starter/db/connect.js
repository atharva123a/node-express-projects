const mongoose = require('mongoose')

// in order to prevent error messages:
const connectDb = async(url)=>{
  await mongoose.connect(url, {
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify : false,
    useUnifiedTopology : true
  })
}

module.exports = connectDb