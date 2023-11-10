const router = require('express').Router()

const UserController = require('../controllers/UserController')


// middleWares
const verifyToken = require('../helpers/verifyToken')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkeruser', UserController.checkerUser)
router.get('/:id', UserController.getUserById)
router.patch('/edit/:id', verifyToken, UserController.editUser)

module.exports = router