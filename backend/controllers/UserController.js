require('dotenv').config()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// helpers

const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/getUserByToken')
const pwd = '-password'

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
        // create a password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // create user
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash,
        })

        try {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)
        } catch (err) {
            res.status(500).json({ message: err })
        }
    }

    static async login(req, res) {
        const { email, password } = req.body

        if (!email) {
            res.status(422).json({ message: 'O e-mail é obrigatório' })
            return
        }

        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória' })
            return
        }

        // check user existe
        const user = await User.findOne({ email: email })

        if (!user) {
            res.status(422).json({
                message: 'Usuário não cadastrado!'
            })
            return;
        }
        // check pass with db pass
        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) {
            res.status(422).json({
                message: 'Senha inválida!'
            })
            return
        }
        await createUserToken(user, req, res)
    }

    static async checkerUser(req, res) {
        let currentUser

        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, process.env.JW_SECRET)

            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined

        } else {
            currentUser = null
        }
        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id
        const user = await User.findById(id).select(pwd)

        try {
            if (!user) {
                res.status(422).json({
                    message: 'Usuário inválido'
                })
                return
            }
        } catch (err) {
            console.log(err)
        }
        res.status(200).json({ user })
    }

    static async editUser(req, res) {
        // const id = req.params.id

        // check user exist
        const token = getToken(req)
        const user = await getUserByToken(token)

        const { name, email, phone, password, confirmpassword } = req.body

        if(req.file){
           user.image = req.file.filename
        }


        // validate
        if (!name) {
            res.status(422).json({ message: 'Revise o nome' })
            return
        }

        user.name = name

        if (!email) {
            res.status(422).json({ message: 'Revise o E-mail' })
            return
        }

        // check email has taked
        const userExists = await User.findOne({ email: email })

        if (user.email !== email && userExists) {
            res.status(422).json({
                message: 'E-mail já em uso!'
            })
            return
        }

        user.email = email

        if (!phone) {
            res.status(422).json({ message: 'Revise o Telefone' })
            return
        }

        user.phone = phone

        if (password != confirmpassword) {
            res.status(422).json({ message: 'As senhas não conferem.' })
            return
        } else if (password === confirmpassword && password != null) {
            // creating new pass
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        try {

            // return user updated data
            await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true }
            )
            res.status(200).json({ message: 'Usuário atualizado com sucesso!' })

        } catch (err) {
            res.status(500).json({ message: err })
            return
        }

    }
}