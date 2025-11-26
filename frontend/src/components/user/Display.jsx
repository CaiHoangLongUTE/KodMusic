import React, { useContext, useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import DisplayHome from './DisplayHome'
import DisplayAlbum from './DisplayAlbum'
import PlaylistList from './PlaylistList'
import PlaylistDetail from './PlaylistDetail'
import { PlayerContext } from '../../context/PlayerContext'

const Display = () => {
  const displayRef = useRef();
  const location = useLocation();
  const { albumsData } = useContext(PlayerContext);
  const isAlbum = location.pathname.includes("album");
  const albumId = isAlbum ? location.pathname.split('/').pop() : "";
  const album = albumsData.find(a => a._id === albumId);
  const bgColor = album?.bgColor || '#121212';

  useEffect(() => {
    if (isAlbum && album) {
      displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`
    } else {
      displayRef.current.style.background = `#121212`
    }
  }, [isAlbum, bgColor, album])

  return (
    <div ref={displayRef} className='w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0'>
      <Routes>
        <Route path='/' element={<DisplayHome />} />
        <Route path='/album/:id' element={<DisplayAlbum />} />
        <Route path='/playlists' element={<PlaylistList />} />
        <Route path='/playlist/:id' element={<PlaylistDetail />} />
      </Routes>
    </div>
  )
}

export default Display
