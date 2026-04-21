import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllUserBoardsAPI, createNewBoardAPI, deleteBoardAPI } from '../services/boardService';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar/Navbar';

const DashboardPage = () => {
    const [boards, setBoards] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        try {
            const newBoard = await createNewBoardAPI({ title: 'Untitled Board', type: 'private' });
            toast.success('Board created successfully!');
            navigate(`/board/${newBoard._id}`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to create board');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col transition-colors duration-300">
            <Navbar />

            <main className="max-w-6xl mx-auto w-full p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Your Workspaces</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Create New Board Button */}
                    <div
                        onClick={handleCreateBoard}
                        className="bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-200 group"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 mb-3 transition-colors">
                            <span className="text-xl font-bold leading-none">+</span>
                        </div>
                        <span className="font-semibold text-slate-600 dark:text-slate-400">Create new board</span>
                    </div>

                    {/* Board List */}
                    {boards.map(board => (
                        <div
                            key={board._id}
                            onClick={() => navigate(`/board/${board._id}`)}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 flex flex-col justify-between min-h-[160px] group relative"
                        >
                            <div className="pr-8">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors break-words">{board.title}</h3>
                                {board.description && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{board.description}</p>
                                )}
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-md">
                                    {board.type === 'private' ? 'Private' : 'Public'}
                                </span>
                            </div>

                            {/* 3-dots Menu Button */}
                            <div className="absolute top-4 right-4" ref={openMenuId === board._id ? menuRef : null}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(openMenuId === board._id ? null : board._id);
                                    }}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${openMenuId === board._id ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200' : 'text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 focus:opacity-100'}`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                                </button>

                                {/* Dropdown */}
                                {openMenuId === board._id && (
                                    <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (!window.confirm('Delete this board permanently?')) return;
                                                try {
                                                    await deleteBoardAPI(board._id);
                                                    setBoards(boards.filter(b => b._id !== board._id));
                                                    toast.success('Board deleted');
                                                } catch (err) {
                                                    toast.error('Failed to delete board');
                                                }
                                                setOpenMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-bold flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;

