import Card from '../Card/Card';

const Column = ({ column }) => {
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

            {/* Nút thêm Card mới (tạm thời để trưng bày) */}
            <button className="mt-4 flex items-center gap-2 text-gray-500 hover:text-blue-600 hover:bg-gray-200 p-2 rounded transition-colors w-full text-left text-sm font-medium">
                <span>+ Thêm thẻ mới</span>
            </button>
        </div>
    )
}

export default Column