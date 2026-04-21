require('dotenv').config();
const express = require ('express')
const cors = require ('cors')
const connectDB = require('./config/database')
const authRoutes = require('./routes/authRoutes')
const boardRoutes = require('./routes/boardRoutes')
const columnRoutes = require('./routes/columnRoutes')
const cardRoutes = require('./routes/cardRoutes')
const { errorHandler } = require('./middlewares/errorMiddleware')


const app = express();

// Connect DB
connectDB();

app.use(cors({
  origin: 'http://localhost:5173', // Chỉ ông này được gọi, mấy ông khác cấm
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}))

app.use(express.json())


app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes)
app.use('/api/columns', columnRoutes)
app.use('/api/cards', cardRoutes)

app.use(errorHandler);

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
