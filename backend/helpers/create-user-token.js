require('dotenv').config()
const jwt = require('jsonwebtoken')
const createUserToken = async (user, req, res) =>{

    // create token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, process.env.JW_SECRET)

    // return token
    res.status(200).json({
        message: 'Você está autendicado',
        token: token,
        userId: user._id
    })
}



module.exports = createUserToken