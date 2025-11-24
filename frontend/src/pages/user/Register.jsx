import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { assets } from '../../assets/assets';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await register(name, email, password);
        setLoading(false);
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-green-900 via-black to-purple-900 flex items-center justify-center p-4'>
            <div className='bg-black/70 backdrop-blur-md p-8 rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl'>
                <div className='flex justify-center mb-6'>
                    <img className='w-12' src={assets.music_note} alt="Logo" />
                </div>
                <h2 className='text-white text-3xl font-bold text-center mb-8'>Create Account</h2>

                {error && <div className='bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm'>{error}</div>}

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='text-gray-300 text-sm mb-2 block'>Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className='w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition' placeholder='Your Name' />
                    </div>
                    <div>
                        <label className='text-gray-300 text-sm mb-2 block'>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className='w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition' placeholder='your@email.com' />
                    </div>
                    <div>
                        <label className='text-gray-300 text-sm mb-2 block'>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" className='w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition' placeholder='••••••••' />
                    </div>
                    <button type="submit" disabled={loading} className='w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed'>{loading ? 'Creating...' : 'Sign Up'}</button>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-gray-400 text-sm'>Already have an account? <Link to="/login" className='text-green-500 hover:underline'>Log in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
