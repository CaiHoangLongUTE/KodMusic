import React, { useState, useContext } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { PlayerContext } from '../../context/PlayerContext'
import CreatePlaylistModal from './CreatePlaylistModal'

const Sidebar = () => {

  const navigate = useNavigate();
  const { playlistsData } = useContext(PlayerContext);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handlePlaylistClick = () => {
    if (playlistsData && playlistsData.length > 0) {
      navigate('/playlists');
    } else {
      setShowCreateModal(true);
    }
  };

  return (
    <div className='w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex'>
      <div className='bg-[#121212] h-[15%] rounded flex flex-col justify-around'>
        <div onClick={() => navigate('/')} className='flex items-center gap-3 pl-8 cursor-pointer'>
          <img className='w-6' src={assets.home_icon} alt="" />
          <p className='font-bold'>Home</p>
        </div>
        <div className='flex items-center gap-3 pl-8 cursor-pointer'>
          <img className='w-6' src={assets.search_icon} alt="" />
          <p className='font-bold'>Search</p>
        </div>
      </div>

      <div className='bg-[#121212] h-[85%] rounded'>
        <div className='p-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <img className='w-8' src={assets.stack_icon} alt="" />
            <p className='font-semibold'>Your Library</p>
          </div>
          <div className='flex items-center gap-3'>
            <img className='w-5' src={assets.arrow_icon} alt="" />
            <img className='w-5' src={assets.plus_icon} alt="" />
          </div>
        </div>
        <div className='p-4 bg-[#242424] rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mx-4'>
          <h1>
            {playlistsData && playlistsData.length > 0 ? 'Your Playlists' : 'Create your playlist'}
          </h1>
          <p className='font-light'>
            {playlistsData && playlistsData.length > 0
              ? `${playlistsData.length} playlist${playlistsData.length > 1 ? 's' : ''}`
              : "it's easy we will help you"}
          </p>
          <button
            onClick={handlePlaylistClick}
            className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'
          >
            {playlistsData && playlistsData.length > 0 ? 'Playlists' : 'Create PlayList'}
          </button>
        </div>
        <div className='p-4 bg-[#242424] rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mx-4 mt-4'>
          <h1>Let's find some podcasts to follow</h1>
          <p className='font-light'>we'll keep you update on new episodes</p>
          <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>Browse podcasts</button>
        </div>
      </div>

      {showCreateModal && (
        <CreatePlaylistModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export default Sidebar
