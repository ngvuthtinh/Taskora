import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8000'; // URL của Backend

export const socket = io(SOCKET_URL, {
    autoConnect: false // Chỉ kết nối khi cần thiết (đã đăng nhập)
});

// Hàm hỗ trợ join phòng
export const joinBoardRoom = (boardId) => {
    if (socket.connected) {
        socket.emit('joinBoard', boardId);
    } else {
        socket.connect();
        socket.on('connect', () => {
            socket.emit('joinBoard', boardId);
        });
    }
};

// Hàm hỗ trợ rời phòng
export const leaveBoardRoom = (boardId) => {
    socket.emit('leaveBoard', boardId);
};
