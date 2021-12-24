const notFound = (req, res)=> 
res.status(404).json("Resource not found!")

module.exports = notFound