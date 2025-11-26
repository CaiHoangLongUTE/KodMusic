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
  const [playlistsData, setPlaylistsData] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
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

  const fetchPlaylists = async (userId) => {
    try {
      if (!userId) return;
      const res = await axios.get(`${url}/api/playlist/user/${userId}`);
      if (res.data.playlists) {
        setPlaylistsData(res.data.playlists);
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  useEffect(() => {
    fetchSongs();
    fetchAlbums();

    // Fetch playlists if user is logged in
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchPlaylists(userId);
    }
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
      setCurrentPlaylist(null); // Clear playlist mode
      await setTrack(song);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  }

  const previous = async () => {
    if (currentPlaylist && currentPlaylist.songs && currentPlaylist.songs.length > 0) {
      const currentIndex = currentPlaylist.songs.findIndex(s => s._id === track?._id);
      if (currentIndex > 0) {
        setTrack(currentPlaylist.songs[currentIndex - 1]);
        setTimeout(() => {
          audioRef.current.play();
          setPlayStatus(true);
        }, 100);
      }
    } else {
      const currentIndex = songsData.findIndex(s => s._id === track?._id);
      if (currentIndex > 0) {
        setTrack(songsData[currentIndex - 1]);
        setTimeout(() => {
          audioRef.current.play();
          setPlayStatus(true);
        }, 100);
      }
    }
  }

  const next = async () => {
    if (currentPlaylist && currentPlaylist.songs && currentPlaylist.songs.length > 0) {
      const currentIndex = currentPlaylist.songs.findIndex(s => s._id === track?._id);
      if (currentIndex < currentPlaylist.songs.length - 1) {
        setTrack(currentPlaylist.songs[currentIndex + 1]);
        setTimeout(() => {
          audioRef.current.play();
          setPlayStatus(true);
        }, 100);
      }
    } else {
      const currentIndex = songsData.findIndex(s => s._id === track?._id);
      if (currentIndex < songsData.length - 1) {
        setTrack(songsData[currentIndex + 1]);
        setTimeout(() => {
          audioRef.current.play();
          setPlayStatus(true);
        }, 100);
      }
    }
  }

  const playPlaylist = async (playlist) => {
    if (playlist && playlist.songs && playlist.songs.length > 0) {
      setCurrentPlaylist(playlist);
      await setTrack(playlist.songs[0]);
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

      // Auto-advance to next song when current song ends
      audioRef.current.onended = () => {
        if (currentPlaylist && currentPlaylist.songs) {
          const currentIndex = currentPlaylist.songs.findIndex(s => s._id === track._id);
          if (currentIndex < currentPlaylist.songs.length - 1) {
            setTrack(currentPlaylist.songs[currentIndex + 1]);
            setTimeout(() => {
              audioRef.current.play();
              setPlayStatus(true);
            }, 100);
          } else {
            setPlayStatus(false);
            setCurrentPlaylist(null);
          }
        } else {
          // Regular next song behavior
          const currentIndex = songsData.findIndex(s => s._id === track._id);
          if (currentIndex < songsData.length - 1) {
            setTrack(songsData[currentIndex + 1]);
            setTimeout(() => {
              audioRef.current.play();
              setPlayStatus(true);
            }, 100);
          } else {
            setPlayStatus(false);
          }
        }
      };
    }
  }, [audioRef, currentPlaylist, track, songsData]);

  const contextValue = {
    audioRef, seekBar, seekBg,
    track, setTrack,
    playStatus, setPlayStatus,
    time, setTime,
    play, pause, playWithId,
    previous, next, seekSong,
    songsData, albumsData,
    playlistsData, setPlaylistsData,
    currentPlaylist, setCurrentPlaylist,
    fetchPlaylists, playPlaylist
  }

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  )
}

export default PlayerContextProvider