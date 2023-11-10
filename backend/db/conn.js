const mongoose = require('mongoose')
require('dotenv').config()
const mongoURI = process.env.MONGO_URI


async function main() {
    await mongoose.connect(mongoURI)
    console.log('Connected to Mongoose')
}

main().catch((err) => console.log(err))

module.exports = mongoose