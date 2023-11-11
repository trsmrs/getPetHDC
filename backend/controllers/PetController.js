const Pet = require("../models/Pet")


// helpers
const getToken = require("../helpers/get-token")
const getUserByToken = require("../helpers/getUserByToken")


module.exports = class PetController {
    // Create Pet
    static async create(req, res) {
        const { age, name, weight, color } = req.body

        const available = true

        // images

        // validations
        if (!name) {
            res.status(422).json({ message: 'O Nome é obrigatório' })
            return
        }
        if (!age) {
            res.status(422).json({ message: 'A idade é obrigatória' })
            return
        }
        if (!weight) {
            res.status(422).json({ message: 'O Peso é obrigatório' })
            return
        }
        if (!color) {
            res.status(422).json({ message: 'A Cor é obrigatória' })
            return
        }

        // get ownser pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        // create pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            }
        })

        try {
            const newPet = await pet.save()
            res.status(201).json({
                message: 'Pet cadastrado com sucesso!',
                newPet,
            })
        } catch (err) {
            res.status(500).json({ message: err })
        }
    }
}