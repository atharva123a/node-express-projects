const express = require('express')

const router = express.Router()

const {loginUser, dashBoard} = require('../controllers/main')

router.route('/login').post(loginUser)
router.route('/dashboard').get(dashBoard)

module.exports = router