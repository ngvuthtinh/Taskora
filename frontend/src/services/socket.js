import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8000'; // Backend URL

export const socket = io(SOCKET_URL, {
    autoConnect: false // Connect only when needed (after login)
});

// Helper to join a room
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

// Helper to leave a room
export const leaveBoardRoom = (boardId) => {
    socket.emit('leaveBoard', boardId);
};
