import React, { useState, useContext } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { PlayerContext } from '../../context/PlayerContext'
import CreatePlaylistModal from './CreatePlaylistModal'
import SearchModal from './SearchModal'
import { AuthContext } from '../../context/AuthContext'

const Sidebar = () => {

  const navigate = useNavigate();
  const { playlistsData } = useContext(PlayerContext);
  const { token } = useContext(AuthContext);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handlePlaylistClick = () => {
    if (!token) {
      navigate('/login');
      return;
    }
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
          <p className='font-bold'>Trang chủ</p>
        </div>
        <div onClick={() => setShowSearchModal(true)} className='flex items-center gap-3 pl-8 cursor-pointer'>
          <img className='w-6' src={assets.search_icon} alt="" />
          <p className='font-bold'>Tìm kiếm</p>
        </div>
      </div>

      <div className='bg-[#121212] h-[85%] rounded'>
        <div className='p-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <img className='w-8' src={assets.stack_icon} alt="" />
            <p className='font-semibold'>Thư viện</p>
          </div>
          <div className='flex items-center gap-3'>
            <img className='w-5' src={assets.arrow_icon} alt="" />
            <img className='w-5' src={assets.plus_icon} alt="" />
          </div>
        </div>
        <div className='p-4 bg-[#242424] rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mx-4'>
          <h1>
            {playlistsData && playlistsData.length > 0 ? 'Danh sách phát của bạn' : 'Tạo danh sách phát'}
          </h1>
          <p className='font-light'>
            {playlistsData && playlistsData.length > 0
              ? `${playlistsData.length} playlist${playlistsData.length > 1 ? 's' : ''}`
              : "thật dễ dàng, chúng tôi sẽ giúp bạn"}
          </p>
          <button
            onClick={handlePlaylistClick}
            className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'
          >
            {playlistsData && playlistsData.length > 0 ? 'Danh sách phát' : 'Tạo danh sách phát'}
          </button>
        </div>
        <div className='p-4 bg-[#242424] rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mx-4 mt-4'>
          <h1>Hãy tìm vài podcast để theo dõi</h1>
          <p className='font-light'>chúng tôi sẽ cập nhật các tập mới cho bạn</p>
          <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>Duyệt podcast</button>
        </div>
      </div>

      {showCreateModal && (
        <CreatePlaylistModal onClose={() => setShowCreateModal(false)} />
      )}

      {showSearchModal && (
        <SearchModal onClose={() => setShowSearchModal(false)} />
      )}
    </div>
  )
}

export default Sidebar
