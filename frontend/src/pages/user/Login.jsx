import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { assets } from '../../assets/assets';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-purple-900 via-black to-green-900 flex items-center justify-center p-4'>
            <div className='bg-black/70 backdrop-blur-md p-8 rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl'>
                <div className='flex justify-center mb-6'>
                    <img className='w-12' src={assets.music_note} alt="Logo" />
                </div>
                <h2 className='text-white text-3xl font-bold text-center mb-8'>Chào mừng trở lại</h2>

                {error && <div className='bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm'>{error}</div>}

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='text-gray-300 text-sm mb-2 block'>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className='w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition' placeholder='your@email.com' />
                    </div>
                    <div>
                        <label className='text-gray-300 text-sm mb-2 block'>Mật khẩu</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className='w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition' placeholder='••••••••' />
                    </div>
                    <button type="submit" disabled={loading} className='w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed'>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-gray-400 text-sm'>Chưa có tài khoản? <Link to="/register" className='text-green-500 hover:underline'>Đăng ký</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
