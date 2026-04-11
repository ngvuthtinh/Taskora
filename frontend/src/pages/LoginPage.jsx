import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginAPI, registerAPI } from '../services/authService';

const LoginPage = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLoginView) {
                const data = await loginAPI(email, password);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                toast.success('Logged in successfully!');
                navigate('/dashboard');
            } else {
                await registerAPI(name, email, password);
                toast.success('Account created! You can now sign in.');
                setIsLoginView(true);
                setPassword('');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Something went wrong!';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4">
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md transition-all duration-300">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        Taskora
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        {isLoginView ? 'Sign in to your account' : 'Create a new account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {!isLoginView && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all placeholder:text-slate-400 text-slate-700"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all placeholder:text-slate-400 text-slate-700"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all placeholder:text-slate-400 text-slate-700"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-2 bg-slate-800 text-white py-3 rounded-xl hover:bg-slate-900 transition-all duration-200 font-semibold shadow-md active:scale-[0.98]"
                    >
                        {isLoginView ? 'Sign In' : 'Create Account'}
                    </button>

                    <div className="mt-4 text-center text-sm text-slate-500">
                        {isLoginView ? (
                            <>
                                Don't have an account?{' '}
                                <button type="button" onClick={() => setIsLoginView(false)} className="text-slate-800 font-semibold hover:underline">
                                    Sign up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button type="button" onClick={() => setIsLoginView(true)} className="text-slate-800 font-semibold hover:underline">
                                    Sign in
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;