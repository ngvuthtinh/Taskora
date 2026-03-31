const express = require ('express')
const cors = require ('cors')
require('dotenv').config();
const connectDB = require('./database/database')

const app = express();

// Connect DB
connectDB();

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    console.log("Hello")
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
