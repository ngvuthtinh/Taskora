import { Draggable } from '@hello-pangea/dnd';

const Card = ({ card, index }) => {
    return (
        <Draggable draggableId={card._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white p-3 rounded shadow-sm border ${snapshot.isDragging ? 'border-green-500 shadow-md transform rotate-2' : 'border-gray-200'} cursor-pointer hover:border-blue-500 transition-colors`}
                >
                    <h4 className="text-sm font-medium text-gray-800">{card.title}</h4>
                    <h4 className="text-sm font-small text-gray-800">{card.description}</h4>
                    <div className="text-xs text-gray-500 mt-2 flex flex-col gap-1">
                        {card.memberIds?.map(memberId => (
                            <span key={memberId}>👤 {memberId}</span>
                        ))}
                    </div>
                </div>
            )}
        </Draggable>
    )
}

export default Card