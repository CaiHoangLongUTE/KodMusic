import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { url } from '../../App';
import { PlayerContext } from '../../context/PlayerContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const SearchModal = ({ onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({
        songs: [],
        albums: [],
        playlists: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const { playWithId } = useContext(PlayerContext);
    const navigate = useNavigate();

    // Debounced search effect
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.trim()) {
                performSearch(searchQuery);
            } else {
                setSearchResults({ songs: [], albums: [], playlists: [] });
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const performSearch = async (query) => {
        setIsLoading(true);
        try {
            const userId = localStorage.getItem('userId');

            // Parallel search requests
            const [songsRes, albumsRes, playlistsRes] = await Promise.all([
                axios.get(`${url}/api/song/search?query=${encodeURIComponent(query)}`),
                axios.get(`${url}/api/album/search?query=${encodeURIComponent(query)}`),
                axios.get(`${url}/api/playlist/search?query=${encodeURIComponent(query)}${userId ? `&userId=${userId}` : ''}`)
            ]);

            setSearchResults({
                songs: songsRes.data.songs || [],
                albums: albumsRes.data.albums || [],
                playlists: playlistsRes.data.playlists || []
            });
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSongClick = (songId) => {
        playWithId(songId);
        onClose();
    };

    const handleAlbumClick = (albumId) => {
        navigate(`/album/${albumId}`);
        onClose();
    };

    const handlePlaylistClick = (playlistId) => {
        navigate(`/playlist/${playlistId}`);
        onClose();
    };

    const hasResults = searchResults.songs.length > 0 ||
        searchResults.albums.length > 0 ||
        searchResults.playlists.length > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-start justify-center pt-20">
            <div className="bg-[#121212] w-full max-w-3xl rounded-lg shadow-2xl max-h-[80vh] overflow-hidden">
                {/* Search Header */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-4">
                        <img className="w-6" src={assets.search_icon} alt="Search" />
                        <input
                            type="text"
                            placeholder="Bạn muốn nghe gì?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                            className="flex-1 bg-transparent text-white text-lg outline-none placeholder-gray-400"
                        />
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white text-2xl font-light"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Search Results */}
                <div className="overflow-y-auto max-h-[calc(80vh-100px)] p-6">
                    {isLoading && (
                        <div className="text-center text-gray-400 py-8">
                            Đang tìm kiếm...
                        </div>
                    )}

                    {!isLoading && searchQuery && !hasResults && (
                        <div className="text-center text-gray-400 py-8">
                            Không tìm thấy kết quả cho "{searchQuery}"
                        </div>
                    )}

                    {!searchQuery && (
                        <div className="text-center text-gray-400 py-8">
                            Nhập để tìm kiếm bài hát, album hoặc danh sách phát
                        </div>
                    )}

                    {/* Songs Section */}
                    {searchResults.songs.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-white text-xl font-bold mb-4">Bài hát</h2>
                            <div className="space-y-2">
                                {searchResults.songs.map((song) => (
                                    <div
                                        key={song._id}
                                        onClick={() => handleSongClick(song._id)}
                                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#282828] cursor-pointer transition-colors group"
                                    >
                                        <img
                                            src={song.image || assets.music_icon}
                                            alt={song.name}
                                            className="w-12 h-12 rounded object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate">{song.name}</p>
                                            <p className="text-gray-400 text-sm truncate">{song.desc}</p>
                                        </div>
                                        <span className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                            {song.duration}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Albums Section */}
                    {searchResults.albums.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-white text-xl font-bold mb-4">Album</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {searchResults.albums.map((album) => (
                                    <div
                                        key={album._id}
                                        onClick={() => handleAlbumClick(album._id)}
                                        className="p-4 rounded-lg hover:bg-[#282828] cursor-pointer transition-colors"
                                    >
                                        <img
                                            src={album.image}
                                            alt={album.name}
                                            className="w-full aspect-square rounded object-cover mb-3"
                                        />
                                        <p className="text-white font-medium truncate">{album.name}</p>
                                        <p className="text-gray-400 text-sm truncate">{album.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Playlists Section */}
                    {searchResults.playlists.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-white text-xl font-bold mb-4">Danh sách phát</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {searchResults.playlists.map((playlist) => (
                                    <div
                                        key={playlist._id}
                                        onClick={() => handlePlaylistClick(playlist._id)}
                                        className="p-4 rounded-lg hover:bg-[#282828] cursor-pointer transition-colors"
                                    >
                                        <img
                                            src={playlist.image || assets.stack_icon}
                                            alt={playlist.name}
                                            className="w-full aspect-square rounded object-cover mb-3 bg-[#1a1a1a]"
                                        />
                                        <p className="text-white font-medium truncate">{playlist.name}</p>
                                        <p className="text-gray-400 text-sm truncate">
                                            {playlist.description || 'Danh sách phát'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
