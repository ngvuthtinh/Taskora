// src/pages/BoardPage.jsx
import React, { useEffect, useState } from 'react';
import { fetchBoardDetailsAPI } from '../services/boardService';

const BoardPage = () => {
  const [board, setBoard] = useState(null);

  // LƯU Ý: Tạm thời chúng ta hardcode (gắn cứng) 1 cái ID của Board vào đây để test.
  // Lên MongoDB Compass hoặc dùng Postman lấy 1 cái ID Board có sẵn của bạn dán vào nhé!
  const mockBoardId = '69cc8bcc8f41f8e27ec3183e'; 

  useEffect(() => {
    // Định nghĩa hàm gọi API
    const loadBoard = async () => {
      try {
        const boardData = await fetchBoardDetailsAPI(mockBoardId);
        setBoard(boardData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu board:', error);
      }
    };

    loadBoard();
  }, []); 

  if (!board) {
    return <div className="h-screen flex items-center justify-center text-2xl font-bold">Đang tải dữ liệu...</div>;
  }

 
  return (
    <div className="min-h-screen bg-blue-600 p-4">
      <h1 className="text-white text-3xl font-bold mb-6">
        Tên Bảng: {board.title}
      </h1>
      
      <pre className="bg-white p-4 rounded text-sm overflow-auto">
        {JSON.stringify(board.columnOrderIds, null, 2)}
      </pre>
    </div>
  );
};

export default BoardPage;