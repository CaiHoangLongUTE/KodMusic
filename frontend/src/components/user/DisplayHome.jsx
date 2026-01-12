import React, { useContext } from 'react'
import AlbumItem from './AlbumItem'
import SongItem from './SongItem'
import { PlayerContext } from '../../context/PlayerContext'

const DisplayHome = () => {
  const { songsData, albumsData } = useContext(PlayerContext);

  return (
    <>
      <div className='mb-4'>
        <h1 className='my-5 font-bold text-2xl'>Bảng xếp hạng nổi bật</h1>
        <div className='flex overflow-auto'>
          {albumsData.map((item, index) => (<AlbumItem key={index} name={item.name} desc={item.desc} id={item._id} image={item.image} />))}
        </div>
      </div>
      <div className='mb-4'>
        <h1 className='my-5 font-bold text-2xl'>Hit lớn nhất hôm nay</h1>
        <div className='flex overflow-auto'>
          {songsData.map((item, index) => (<SongItem key={index} name={item.name} desc={item.desc} id={item._id} image={item.image} />))}
        </div>
      </div>
    </>
  )
}

export default DisplayHome 
