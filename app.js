const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const {serverPort} = require('./configs/config');
const connectDB = require("./configs/db");
const auth = require('./routes/auth');

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())

app.listen(serverPort, () => {
    console.log("connected!");
});
process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
    process.kill(process.pid, 'SIGINT');
});

app.use("/auth", auth)

connectDB().catch(err => console.log(err));
