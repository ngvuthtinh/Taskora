require('dotenv').config();
const express = require ('express')
const cors = require ('cors')
const connectDB = require('./database/database')
const authRoutes = require('./routes/authRoutes')


const app = express();

// Connect DB
connectDB();

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    console.log("Hello")
})


app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
