import React, { useContext, useState } from 'react'
import { PlayerContext } from '../../context/PlayerContext'
import SelectPlaylistModal from './SelectPlaylistModal'

const SongItem = ({ name, image, desc, id }) => {

  const { playWithId } = useContext(PlayerContext)
  const [showPlaylistModal, setShowPlaylistModal] = useState(false)

  const handleAddToPlaylist = (e) => {
    e.stopPropagation() // Prevent playing the song when clicking the button
    setShowPlaylistModal(true)
  }

  return (
    <>
      <div className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26] group relative'>
        <div onClick={() => playWithId(id)}>
          <img className='rounded' src={image} alt="" />
          <p className='font-bold mt-2 mb-1'>{name}</p>
          <p className='text-slate-200 text-sm'>{desc}</p>
        </div>

        {/* Add to Playlist button - bottom right corner, shows on hover */}
        <button
          onClick={handleAddToPlaylist}
          className='absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 hover:scale-110 transition-all shadow-lg z-10'
          title='Thêm vào danh sách phát'
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
        </button>
      </div>

      {showPlaylistModal && (
        <SelectPlaylistModal
          songId={id}
          songName={name}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </>
  )
}

export default SongItem
