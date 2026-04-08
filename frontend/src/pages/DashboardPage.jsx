import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllUserBoardsAPI, createNewBoardAPI } from '../services/boardService';
import { toast } from 'react-toastify';

const DashboardPage = () => {
    const [boards, setBoards] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const myBoards = await fetchAllUserBoardsAPI();
                setBoards(myBoards);
            } catch (error) {
                toast.error('Failed to load boards');
            }
        };
        fetchBoards();
    }, []);

    const handleCreateBoard = async () => {
        const title = window.prompt("Enter new board title:");
        if (!title || !title.trim()) return;
        try {
            const newBoard = await createNewBoardAPI({ title, type: 'private' });
            setBoards([newBoard, ...boards]);
            toast.success('Board created successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create board');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <header className="px-8 py-5 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm">
                <h1 className="text-slate-800 text-2xl font-extrabold tracking-tight">Taskora</h1>
                <div className="flex items-center gap-4">
                    <button onClick={handleLogout} className="text-sm font-semibold text-slate-500 hover:text-slate-800">
                        Logout
                    </button>
                    <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center font-bold text-slate-600 shadow-sm">
                        U
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-slate-800">Your Workspaces</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Create New Board Button */}
                    <div 
                        onClick={handleCreateBoard}
                        className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] cursor-pointer hover:bg-slate-200/50 hover:border-slate-400 transition-all duration-200 group"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-slate-300 mb-3 transition-colors">
                            <span className="text-xl font-bold leading-none">+</span>
                        </div>
                        <span className="font-semibold text-slate-600">Create new board</span>
                    </div>

                    {/* Board List */}
                    {boards.map(board => (
                        <div 
                            key={board._id} 
                            onClick={() => navigate(`/board/${board._id}`)}
                            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between min-h-[160px] group"
                        >
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{board.title}</h3>
                                {board.description && (
                                    <p className="text-sm text-slate-500 line-clamp-2">{board.description}</p>
                                )}
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
                                    {board.type === 'private' ? 'Private' : 'Public'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
