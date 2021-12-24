const mongoose = require('mongoose')

const TaskScehma = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'must provide name'],
        trim : true,
        maxlength : [20, 'name cannot be more than 20 characters!']
    }, 
    completed : {
        type : Boolean,
        default : false
    }
})

// takes in a name first and then the schema:
module.exports = mongoose.model('Task', TaskScehma)