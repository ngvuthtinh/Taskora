import Card from '../Card/Card';
import { useState } from 'react';

const Column = ({ column, boardId, createNewCard }) => {

    const [openNewCardForm, setOpenNewCardForm] = useState(false)

    const [newCardTitle, setNewCardTitle] = useState('')

    const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);

    const addNewCard = async () => {
        if (!newCardTitle.trim()) {
            return
        }

        const newCardData = {
            title: newCardTitle,
            columnId: column._id,
            boardId: boardId
        }

        await createNewCard(newCardData)

        toggleOpenNewCardForm();
        setNewCardTitle('');
    }

    return (
        <div className="bg-gray-100 p-4 rounded-xl w-72 shrink-0 flex flex-col max-h-full">
            {/* Tiêu đề Cột */}
            <h3 className="font-bold text-gray-700 mb-4 px-1">{column.title}</h3>

            {/* Khu vực chứa các Card (có thể cuộn dọc nếu nhiều thẻ) */}
            <div className="flex flex-col gap-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
                {column.cardOrderIds?.map(card => (
                    <Card key={card._id} card={card} />
                ))}
            </div>


            {!openNewCardForm ? (
                // TRẠNG THÁI 1: NÚT BẤM BÌNH THƯỜNG
                <button
                    onClick={toggleOpenNewCardForm}
                    className="mt-4 flex items-center gap-2 text-gray-500 hover:text-blue-600 hover:bg-gray-200 p-2 rounded transition-colors w-full text-left text-sm font-medium"
                >
                    <span>+ Thêm thẻ mới</span>
                </button>
            ) : (
                // TRẠNG THÁI 2: FORM NHẬP LIỆU INLINE (Chuẩn Trello)
                <div className="mt-3 p-2 bg-white rounded-lg shadow-sm border border-blue-500">
                    <textarea
                        autoFocus
                        className="w-full text-sm p-1 outline-none resize-none"
                        rows="2"
                        placeholder="Nhập tiêu đề cho thẻ này..."
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        // Bắt sự kiện nhấn Enter để tạo luôn, khỏi cần bấm nút
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addNewCard();
                            }
                        }}
                    />
                    <div className="flex items-center gap-2 mt-2">
                        <button
                            onClick={addNewCard}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
                        >
                            Thêm
                        </button>
                        <button
                            onClick={toggleOpenNewCardForm}
                            className="text-gray-500 hover:text-gray-800 font-bold px-2"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Column