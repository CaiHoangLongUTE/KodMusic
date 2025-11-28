import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const AdminSidebar = () => {
    return (
        <div className='bg-[#003A10] min-h-screen pl-[4vw]'>
            <div className='mt-5 flex items-center gap-3'>
                <img src={assets.music_note} className='w-10 sm:w-12' alt="KodMusic" />
                <span className='text-white text-xl sm:text-2xl font-bold hidden sm:block'>KodMusic</span>
            </div>
            <div className='flex flex-col gap-5 mt-10'>
                <NavLink to='/admin/add-song' className='flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium'>
                    <img src={assets.add_song} className='w-5' alt="" />
                    <p className='hidden sm:block'>Add Song</p>
                </NavLink>
                <NavLink to='/admin/list-song' className='flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium'>
                    <img src={assets.song_icon} className='w-5' alt="" />
                    <p className='hidden sm:block'>List Song</p>
                </NavLink>
                <NavLink to='/admin/add-album' className='flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium'>
                    <img src={assets.add_album} className='w-5' alt="" />
                    <p className='hidden sm:block'>Add Album</p>
                </NavLink>
                <NavLink to='/admin/list-album' className='flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium'>
                    <img src={assets.album_icon} className='w-5' alt="" />
                    <p className='hidden sm:block'>List Album</p>
                </NavLink>
                <NavLink to='/admin/list-user' className='flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium'>
                    <img src={assets.user_icon} className='w-5' alt="" />
                    <p className='hidden sm:block'>List User</p>
                </NavLink>
            </div>
        </div>
    )
}

export default AdminSidebar
