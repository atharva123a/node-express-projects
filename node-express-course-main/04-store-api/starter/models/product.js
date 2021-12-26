const mongoose = require('mongoose')

const schema = mongoose.Schema()

const productSchema = new mongoose.Schema({
	name : {
		type : String,
		required : [true, `product name is required`]
	},
	price : {
		type : Number,
		required : [true, `product price is required`]
	},
	featured : {
		type : Boolean,
		default : false
	},
	rating : {
		type : Number,
		default : 4.5
	},
	createAt : {
		type : Date,
		default : new Date()
	},
	company : {
		// the enum specifies the options that it will accept!
		type : String,
		enum : {
			values : ['ikea', 'liddy', 'caressa', 'marcos'],
			message : '{VALUE} is not supported'
		}
	}
})

module.exports = mongoose.model('Product', productSchema)