const express = require('express')

const router = express.Router()

const {loginUser, dashBoard} = require('../controllers/main')
const authMiddleWare = require('../middleware/auth')

router.route('/login').post(loginUser)
// only users authorized will be passed down to our dashBoard:
router.route('/dashboard').get(authMiddleWare, dashBoard)

module.exports = router