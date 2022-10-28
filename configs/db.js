const Mongoose = require("mongoose")
const {mongo_username, mongo_pass} = require("./config");
const db = `mongodb+srv://${mongo_username}:${mongo_pass}@node-backend-db.jlsei.mongodb.net/?retryWrites=true&w=majority`

const connectDB = async () => {
    await Mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log("MongoDB Connected")
}
module.exports = connectDB