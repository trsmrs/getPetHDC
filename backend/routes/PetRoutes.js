const router = require('express').Router()

const PetController = require('../controllers/PetController')

// middlewares 
const verifyToken = require('../helpers/verifyToken')



router.post('/create', verifyToken, PetController.create)


module.exports = router