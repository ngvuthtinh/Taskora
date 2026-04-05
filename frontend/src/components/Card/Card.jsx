
const Card = ({ card }) => {
    return (
        <div className="bg-white p-3 rounded shadow-sm border border-gray-200 cursor-pointer hover:border-blue-500 transition-colors">
            <h4 className="text-sm font-medium text-gray-800">{card.title}</h4>
            <h4 className="text-sm font-small text-gray-800">{card.description}</h4>
            <div className="text-xs text-gray-500 mt-2 flex flex-col gap-1">
                {card.memberIds?.map(memberId => (
                    <span key={memberId}>👤 {memberId}</span>
                ))}
            </div>
        </div>
    )
}

export default Card