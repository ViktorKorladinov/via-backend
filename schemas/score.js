const Mongoose = require("mongoose")
const ScoreSchema = new Mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },
}, {timestamps: true})
const Score = Mongoose.model("score", ScoreSchema)
module.exports = Score