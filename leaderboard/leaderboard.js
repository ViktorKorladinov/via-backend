const Score = require("../schemas/score");

exports.add = async (req, res, _) => {
    const {score} = req.body
    const {username} = res.locals;

    Score.create({
        username, points: score,
    }).then((score) => res.status(201).json({
        message: `Score uploaded successfully`, id: score._id
    })).catch((error) => res.status(400).json({
        message: "Score upload unsuccessful", error: error.message,
    }));
}

exports.top = async (req, res, _) => {
    let limit = req.params.limit ? parseInt(req.params.limit) : 10
    Score.find().sort('-points').limit(limit).then(scores => {
        res.status(200).json({scores})
    }).catch(err => err)
}

