require('dotenv').config();
const express = require ('express')
const cors = require ('cors')
const connectDB = require('./config/database')
const authRoutes = require('./routes/authRoutes')
const boardRoutes = require('./routes/boardRoutes')
const columnRoutes = require('./routes/columnRoutes')
const cardRoutes = require('./routes/cardRoutes')
const userRoutes = require('./routes/userRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const { errorHandler } = require('./middlewares/errorMiddleware')
const { initCronJobs } = require('./utils/cronJobs')


const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT']
  }
});

// Gán io vào app để có thể dùng ở các controller khác
app.set('socketio', io);

// Connect DB
connectDB();

// Start Background Tasks
initCronJobs();

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
app.use('/api/users', userRoutes)
app.use('/api/notifications', notificationRoutes)

app.use(errorHandler);

// Socket.io Logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Người dùng tham gia vào phòng của một Board cụ thể
    socket.on('joinBoard', (boardId) => {
        socket.join(boardId);
        console.log(`User ${socket.id} joined board: ${boardId}`);
    });

    // Người dùng rời khỏi phòng
    socket.on('leaveBoard', (boardId) => {
        socket.leave(boardId);
        console.log(`User ${socket.id} left board: ${boardId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 8000
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
