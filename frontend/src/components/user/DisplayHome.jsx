import React, { useContext } from 'react'
import AlbumItem from './AlbumItem'
import SongItem from './SongItem'
import { PlayerContext } from '../../context/PlayerContext'

const DisplayHome = () => {
  const { songsData, albumsData } = useContext(PlayerContext);

  const albumRef = React.useRef(null);
  const songRef = React.useRef(null);

  const handleScroll = (ref) => (e) => {
    if (ref.current) {
      e.preventDefault();
      ref.current.scrollLeft += e.deltaY;
    }
  };

  React.useEffect(() => {
    const albumContainer = albumRef.current;
    const songContainer = songRef.current;

    const onWheelAlbum = handleScroll(albumRef);
    const onWheelSong = handleScroll(songRef);

    if (albumContainer) {
      albumContainer.addEventListener('wheel', onWheelAlbum, { passive: false });
    }
    if (songContainer) {
      songContainer.addEventListener('wheel', onWheelSong, { passive: false });
    }

    return () => {
      if (albumContainer) {
        albumContainer.removeEventListener('wheel', onWheelAlbum);
      }
      if (songContainer) {
        songContainer.removeEventListener('wheel', onWheelSong);
      }
    };
  }, []);

  return (
    <>
      <div className='mb-4'>
        <h1 className='my-5 font-bold text-2xl'>Bảng xếp hạng nổi bật</h1>
        <div ref={albumRef} className='flex overflow-auto'>
          {albumsData.map((item, index) => (<AlbumItem key={index} name={item.name} desc={item.desc} id={item._id} image={item.image} />))}
        </div>
      </div>
      <div className='mb-4'>
        <h1 className='my-5 font-bold text-2xl'>Những bản hit hôm nay</h1>
        <div ref={songRef} className='flex overflow-auto'>
          {songsData.map((item, index) => (<SongItem key={index} name={item.name} desc={item.desc} id={item._id} image={item.image} />))}
        </div>
      </div>
    </>
  )
}

export default DisplayHome 
