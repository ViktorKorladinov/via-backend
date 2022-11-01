const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { serverPort } = require('./configs/config')
const connectDB = require('./configs/db')
const auth = require('./routes/auth')
const leaderboard = require('./routes/leaderboard')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2')
})

process.on('SIGINT', function () {
    process.kill(process.pid, 'SIGINT')
})
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept')
    next()
})
app.use('/auth', auth)
app.use('/api/leaderboard', leaderboard)
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(serverPort, () => {
    console.log('connected!')
})

connectDB().catch(err => console.log(err))
