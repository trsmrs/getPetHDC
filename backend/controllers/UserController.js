const User = require('../models/User')

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body

        // validations
        if (!name || !email || !phone || !password || !confirmpassword) {
            res.status(422).json({ message: 'Revise os campos' })
            return;
        }

        if (password != confirmpassword) {
            res.status(422).json({ message: 'As senhas não conferem.' })
            return;
        }

        // check user existe
        const userExists = await User.findOne({ email: email })

        if (userExists) {
            res.status(422).json({
                message: 'Este e-mail já está em uso!'
            })
            return;
        }
    }
}