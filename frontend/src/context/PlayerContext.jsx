import { createContext, useState, useRef, useEffect } from "react";
import axios from 'axios';
import { url } from '../App';

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {

  const audioRef = useRef();
  const seekBar = useRef();
  const seekBg = useRef();

  const [songsData, setSongsData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);
  const [track, setTrack] = useState(null);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 }
  })

  const fetchSongs = async () => {
    try {
      const res = await axios.get(`${url}/api/song/list`);
      if (res.data.songs && res.data.songs.length > 0) {
        setSongsData(res.data.songs);
        setTrack(res.data.songs[0]);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await axios.get(`${url}/api/album/list`);
      if (res.data.albums && res.data.albums.length > 0) {
        setAlbumsData(res.data.albums);
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, []);

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  }

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  }

  const playWithId = async (id) => {
    const song = songsData.find(s => s._id === id);
    if (song) {
      await setTrack(song);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  }

  const previous = async () => {
    const currentIndex = songsData.findIndex(s => s._id === track._id);
    if (currentIndex > 0) {
      await setTrack(songsData[currentIndex - 1]);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  }

  const next = async () => {
    const currentIndex = songsData.findIndex(s => s._id === track._id);
    if (currentIndex < songsData.length - 1) {
      await setTrack(songsData[currentIndex + 1]);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  }

  const seekSong = (e) => {
    if (audioRef.current && audioRef.current.duration) {
      const clickPosition = e.nativeEvent.offsetX;
      const seekBarWidth = seekBg.current.offsetWidth;
      const newTime = (clickPosition / seekBarWidth) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.ontimeupdate = () => {
        const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        seekBar.current.style.width = `${progress}%`;

        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60),
            minute: Math.floor(audioRef.current.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            minute: Math.floor(audioRef.current.duration / 60),
          },
        });
      };
    }
  }, [audioRef]);

  const contextValue = {
    audioRef, seekBar, seekBg,
    track, setTrack,
    playStatus, setPlayStatus,
    time, setTime,
    play, pause, playWithId,
    previous, next, seekSong,
    songsData, albumsData
  }

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  )
}

export default PlayerContextProvider