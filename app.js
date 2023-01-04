const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {serverPort} = require('./configs/config')
const connectDB = require('./configs/db')
const auth = require('./routes/auth')
const leaderboard = require('./routes/leaderboard')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const app = express()
const whitelist = ['http://localhost:3000']
const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2')
})

process.on('SIGINT', function () {
    process.kill(process.pid, 'SIGINT')
})
app.use('/auth', auth)
app.use('/api/leaderboard', leaderboard)
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(serverPort, () => {
    console.log('connected!')
})

connectDB().catch(err => console.log(err))
