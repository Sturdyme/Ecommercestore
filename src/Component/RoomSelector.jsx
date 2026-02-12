


export default function RoomSelector({ setRoom}) {
    return (
        <div> 
            {["general", "tech", "random"].map((room) => (
                <button 
                key={room}
                onClick={() => setRoom(room)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                > 
                    #{room}
                </button>
            ))}
        </div>
    )
}