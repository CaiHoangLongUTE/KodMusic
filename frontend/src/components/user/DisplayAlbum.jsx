import React, { useContext } from 'react'
import Navbar from './Navbar'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets';
import { PlayerContext } from '../../context/PlayerContext';

const DisplayAlbum = () => {

  const { id } = useParams();
  const { albumsData, songsData, playWithId } = useContext(PlayerContext);
  const albumData = albumsData.find(album => album._id === id);
  const albumSongs = songsData.filter(song => song.album === albumData?.name);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (!albumData) {
    return <div className='text-white p-8'>Album not found</div>
  }

  return (
    <>
      <div className='sticky top-0 backdrop-blur-md z-10 pb-4'>
        <Navbar />
      </div>
      <div className='mt-10 flex gap-8 flex-col md:flex-row md:items-end'>
        <img className='w-36 rounded' src={albumData.image} alt="" />
        <div className='flex flex-col'>
          <p className='font-bold text-[#a7a7a7]'>Album</p>
          <h2 className='text-5xl font-bold mb-4 md:text-7xl'>{albumData.name}</h2>
          <h4>{albumData.desc}</h4>
        </div>
      </div>

      <div className='grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]'>
        <p><b className='mr-4'>#</b>Title</p>
        <p>Album</p>
        <p className='hidden sm:block'>Date Added</p>
        <img className='m-auto w-4' src={assets.clock_icon} alt="" />
      </div>
      <hr />
      {
        albumSongs.length > 0 ? (
          albumSongs.map((song, index) => (
            <div onClick={() => playWithId(song._id)} className='grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer' key={song._id}>
              <p className='text-white'>
                <b className='mr-4 text-[#a7a7a7]'>{index + 1}</b>
                <img className='inline w-10 mr-5' src={song.image} alt="" />
                {song.name}
              </p>
              <p className='text-[15px]'>{albumData.name}</p>
              <p className='text-[15px] hidden sm:block'>{formatDate(song.createdAt)}</p>
              <p className='text-[15px] flex items-center justify-center'>{song.duration}</p>
            </div>
          ))
        ) : (
          <div className='text-white p-8'>No songs in this album yet</div>
        )
      }
    </>
  )
}

export default DisplayAlbum
