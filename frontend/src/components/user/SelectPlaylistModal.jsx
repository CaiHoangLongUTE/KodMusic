import React, { useState, useContext } from 'react';
import axios from 'axios';
import { url } from '../../App';
import { PlayerContext } from '../../context/PlayerContext';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const SelectPlaylistModal = ({ songId, songName, onClose }) => {
    const { playlistsData, fetchPlaylists } = useContext(PlayerContext);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPlaylists = playlistsData.filter(playlist =>
        playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddToPlaylist = async (playlistId) => {
        setLoading(true);
        try {
            await axios.post(`${url}/api/playlist/add-song`, {
                playlistId,
                songId
            });
            toast.success(`Added "${songName}" to playlist`);

            // Refresh playlists to update song counts
            const userId = localStorage.getItem('userId') || user?._id;
            if (userId) {
                await fetchPlaylists(userId);
            }

            onClose();
        } catch (error) {
            if (error.response?.data?.message?.includes('already exists')) {
                toast.warning('Song already in this playlist');
            } else {
                toast.error(error.response?.data?.message || 'Error adding song to playlist');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'
            onClick={onClose}
        >
            <div
                className='bg-[#282828] rounded-lg p-6 w-[90%] max-w-md max-h-[70vh] flex flex-col'
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className='text-white text-2xl font-bold mb-4'>Add to Playlist</h2>
                <p className='text-gray-400 mb-4'>Select a playlist for "{songName}"</p>

                {playlistsData.length === 0 ? (
                    <div className='text-center py-8'>
                        <p className='text-gray-400 mb-4'>You don't have any playlists yet</p>
                        <button
                            onClick={onClose}
                            className='px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition'
                        >
                            Create a Playlist First
                        </button>
                    </div>
                ) : (
                    <>
                        <div className='mb-4'>
                            <input
                                type='text'
                                placeholder='Search playlists...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full p-2 rounded bg-[#3e3e3e] text-white outline-none'
                            />
                        </div>

                        <div className='flex-1 overflow-y-auto mb-4'>
                            {filteredPlaylists.length === 0 ? (
                                <p className='text-gray-400 text-center py-4'>No playlists found</p>
                            ) : (
                                <div className='space-y-2'>
                                    {filteredPlaylists.map((playlist) => (
                                        <div
                                            key={playlist._id}
                                            onClick={() => handleAddToPlaylist(playlist._id)}
                                            className='flex items-center gap-3 p-3 rounded bg-[#3e3e3e] hover:bg-[#4e4e4e] cursor-pointer transition'
                                        >
                                            {playlist.image ? (
                                                <img
                                                    src={playlist.image}
                                                    alt={playlist.name}
                                                    className='w-12 h-12 rounded object-cover'
                                                />
                                            ) : (
                                                <div className='w-12 h-12 rounded bg-[#282828] flex items-center justify-center'>
                                                    <span className='text-2xl'>🎵</span>
                                                </div>
                                            )}
                                            <div className='flex-1'>
                                                <p className='text-white font-semibold'>{playlist.name}</p>
                                                <p className='text-gray-400 text-sm'>
                                                    {playlist.songs?.length || 0} song{playlist.songs?.length !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className='w-full px-6 py-2 bg-transparent border border-white text-white rounded-full hover:bg-white hover:text-black transition'
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SelectPlaylistModal;
