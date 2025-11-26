import React, { useState, useContext } from 'react';
import axios from 'axios';
import { url } from '../../App';
import { PlayerContext } from '../../context/PlayerContext';
import { toast } from 'react-toastify';

const AddSongsModal = ({ playlistId, onClose, onSongsAdded }) => {
    const { songsData } = useContext(PlayerContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [loading, setLoading] = useState(false);

    const filteredSongs = songsData.filter(song =>
        song.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSong = (songId) => {
        setSelectedSongs(prev =>
            prev.includes(songId)
                ? prev.filter(id => id !== songId)
                : [...prev, songId]
        );
    };

    const handleAddSongs = async () => {
        if (selectedSongs.length === 0) {
            toast.error('Please select at least one song');
            return;
        }

        setLoading(true);
        try {
            for (const songId of selectedSongs) {
                await axios.post(`${url}/api/playlist/add-song`, {
                    playlistId,
                    songId
                });
            }
            toast.success(`${selectedSongs.length} song(s) added to playlist`);
            onSongsAdded();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding songs');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
            <div className='bg-[#282828] rounded-lg p-6 w-[90%] max-w-2xl max-h-[80vh] flex flex-col'>
                <h2 className='text-white text-2xl font-bold mb-4'>Add Songs to Playlist</h2>

                <div className='mb-4'>
                    <input
                        type='text'
                        placeholder='Search songs...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full p-2 rounded bg-[#3e3e3e] text-white outline-none'
                    />
                </div>

                <div className='flex-1 overflow-y-auto mb-4'>
                    {filteredSongs.length === 0 ? (
                        <p className='text-gray-400 text-center py-8'>No songs found</p>
                    ) : (
                        <div className='space-y-2'>
                            {filteredSongs.map((song) => (
                                <div
                                    key={song._id}
                                    onClick={() => toggleSong(song._id)}
                                    className={`flex items-center gap-3 p-3 rounded cursor-pointer transition ${selectedSongs.includes(song._id)
                                            ? 'bg-green-500 bg-opacity-20'
                                            : 'bg-[#3e3e3e] hover:bg-[#4e4e4e]'
                                        }`}
                                >
                                    <input
                                        type='checkbox'
                                        checked={selectedSongs.includes(song._id)}
                                        onChange={() => { }}
                                        className='w-5 h-5'
                                    />
                                    <img
                                        src={song.image}
                                        alt={song.name}
                                        className='w-12 h-12 rounded object-cover'
                                    />
                                    <div className='flex-1'>
                                        <p className='text-white font-semibold'>{song.name}</p>
                                        <p className='text-gray-400 text-sm'>{song.desc}</p>
                                    </div>
                                    <span className='text-gray-400 text-sm'>{song.duration}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className='flex gap-3 justify-between items-center'>
                    <p className='text-white'>
                        {selectedSongs.length} song{selectedSongs.length !== 1 ? 's' : ''} selected
                    </p>
                    <div className='flex gap-3'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-6 py-2 bg-transparent border border-white text-white rounded-full hover:bg-white hover:text-black transition'
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddSongs}
                            className='px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition'
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Songs'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSongsModal;
