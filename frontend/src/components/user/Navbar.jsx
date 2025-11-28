import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <div className='w-full border-b border-gray-800 pb-4'>
      <div className='w-full flex justify-between items-center font-semibold'>
        <div className='flex items-center gap-2'>
          <img onClick={() => navigate(-1)} className='w-8 bg-black p-2 rounded-2xl cursor-pointer' src={assets.arrow_left} alt="" />
          <img onClick={() => navigate(+1)} className='w-8 bg-black p-2 rounded-2xl cursor-pointer' src={assets.arrow_right} alt="" />
        </div>
        <div className='flex items-center gap-4'>
          {isLoggedIn ? (
            <>
              <p className='bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer'>Explore Premium</p>
              <p className='bg-black py-1 px-3 rounded-2xl text-[15px] cursor-pointer'>Install App</p>
              <div className='relative'>
                <div onClick={() => setShowDropdown(!showDropdown)} className='bg-purple-500 text-black w-8 h-8 rounded-full flex items-center justify-center cursor-pointer font-bold hover:scale-105 transition'>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                {showDropdown && (
                  <div className='absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50'>
                    <div className='p-3 border-b border-gray-700'>
                      <p className='text-white font-semibold'>{user?.name}</p>
                      <p className='text-gray-400 text-xs'>{user?.email}</p>
                    </div>
                    <button onClick={handleLogout} className='w-full text-left px-4 py-2 text-white hover:bg-gray-800 transition'>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button onClick={() => navigate('/login')} className='bg-white text-black text-[15px] px-6 py-2 rounded-full font-semibold hover:scale-105 transition'>Login</button>
          )}
        </div>
      </div>
      {/* <div className='flex items-center gap-2 mt-4'>
        <p className='bg-white text-black px-4 py-1 rounded-2xl cursor-pointer'>All</p>
        <p className='bg-black text-white px-4 py-1 rounded-2xl cursor-pointer'>Music</p>
        <p className='bg-black text-white px-4 py-1 rounded-2xl cursor-pointer'>Podcasts</p>
      </div> */}
    </div>
  )
}

export default Navbar
