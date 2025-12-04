import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/user/Sidebar'
import Player from './components/user/Player'
import Display from './components/user/Display'
import Login from './pages/user/Login'
import Register from './pages/user/Register'
import { PlayerContext } from './context/PlayerContext'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddSong from './pages/admin/AddSong';
import AddAlbum from './pages/admin/AddAlbum';
import ListSong from './pages/admin/ListSong';
import ListAlbum from './pages/admin/ListAlbum';
import ListUser from './pages/admin/ListUser';
import AdminLayout from './components/admin/AdminLayout';

export const url = 'http://localhost:8000';

const App = () => {
  const { audioRef, track } = useContext(PlayerContext)

  return (
    <div className='h-screen bg-black'>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route path="/*" element={
          <>
            <div className='h-[90%] flex'>
              <Sidebar />
              <Display />
            </div>
            <Player />
            <audio ref={audioRef} src={track?.file || ''} preload='auto'></audio>
          </>
        } />

        {/* Admin Routes */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route path='add-song' element={<AddSong />} />
          <Route path='list-song' element={<ListSong />} />
          <Route path='add-album' element={<AddAlbum />} />
          <Route path='list-album' element={<ListAlbum />} />
          <Route path='list-user' element={<ListUser />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
