const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/auth.js', './routes/leaderboard.js']

swaggerAutogen(outputFile, endpointsFiles)