const router = require('express').Router()

const UserController = require('../controllers/UserController')


// middleWares
const verifyToken = require('../helpers/verifyToken')
const { ìmageUpload, imageUpload } = require('../helpers/imageUpload')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkeruser', UserController.checkerUser)
router.get('/:id', UserController.getUserById)
router.patch('/edit/:id', verifyToken, imageUpload.single("image"), UserController.editUser)

module.exports = router