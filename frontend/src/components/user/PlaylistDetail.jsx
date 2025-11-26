import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../App';
import { PlayerContext } from '../../context/PlayerContext';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import AddSongsModal from './AddSongsModal';

const PlaylistDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { playPlaylist, setCurrentPlaylist, setTrack, audioRef, setPlayStatus } = useContext(PlayerContext);
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddSongsModal, setShowAddSongsModal] = useState(false);

    const fetchPlaylistDetails = async () => {
        try {
            const res = await axios.get(`${url}/api/playlist/${id}`);
            if (res.data.playlist) {
                setPlaylist(res.data.playlist);
            }
        } catch (error) {
            toast.error('Error fetching playlist details');
            navigate('/playlists');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylistDetails();
    }, [id]);

    const handleRemoveSong = async (songId) => {
        try {
            await axios.delete(`${url}/api/playlist/remove-song`, {
                data: { playlistId: id, songId }
            });
            toast.success('Song removed from playlist');
            fetchPlaylistDetails();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error removing song');
        }
    };

    const handlePlayPlaylist = () => {
        if (playlist && playlist.songs && playlist.songs.length > 0) {
            playPlaylist(playlist);
        } else {
            toast.error('No songs in playlist');
        }
    };

    const handlePlaySong = async (song) => {
        if (playlist && playlist.songs && playlist.songs.length > 0) {
            // Set playlist context so next/previous work
            setCurrentPlaylist(playlist);
            setTrack(song);
            setTimeout(() => {
                audioRef.current.play();
                setPlayStatus(true);
            }, 100);
        }
    };

    if (loading) {
        return (
            <div className='w-full flex items-center justify-center h-full'>
                <p className='text-white text-xl'>Loading...</p>
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className='w-full flex items-center justify-center h-full'>
                <p className='text-white text-xl'>Playlist not found</p>
            </div>
        );
    }

    return (
        <div className='w-full'>
            {/* Playlist Header */}
            <div className='flex items-end gap-6 p-8 bg-gradient-to-b from-[#3e3e3e] to-[#121212]'>
                {playlist.image ? (
                    <img
                        src={playlist.image}
                        alt={playlist.name}
                        className='w-48 h-48 rounded shadow-2xl object-cover'
                    />
                ) : (
                    <div className='w-48 h-48 rounded shadow-2xl bg-[#282828] flex items-center justify-center'>
                        <img src={assets.stack_icon} alt='' className='w-20 opacity-50' />
                    </div>
                )}
                <div className='flex-1'>
                    <p className='text-sm text-white font-semibold'>PLAYLIST</p>
                    <h1 className='text-6xl font-bold text-white mt-2 mb-4'>{playlist.name}</h1>
                    {playlist.description && (
                        <p className='text-gray-300 mb-2'>{playlist.description}</p>
                    )}
                    <p className='text-sm text-gray-400'>
                        {playlist.songs?.length || 0} song{playlist.songs?.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className='px-8 py-6 flex items-center gap-4'>
                <button
                    onClick={handlePlayPlaylist}
                    disabled={!playlist.songs || playlist.songs.length === 0}
                    className='w-14 h-14 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    <img src={assets.play_icon} alt='Play' className='w-6' />
                </button>
                <button
                    onClick={() => setShowAddSongsModal(true)}
                    className='px-6 py-2 bg-transparent border border-white text-white rounded-full hover:bg-white hover:text-black transition'
                >
                    Add Songs
                </button>
                <button
                    onClick={() => navigate('/playlists')}
                    className='px-6 py-2 bg-transparent border border-gray-400 text-gray-400 rounded-full hover:border-white hover:text-white transition'
                >
                    Back to Playlists
                </button>
            </div>

            {/* Songs List */}
            <div className='px-8 pb-8'>
                {!playlist.songs || playlist.songs.length === 0 ? (
                    <div className='text-center text-gray-400 py-12'>
                        <p className='text-xl'>No songs in this playlist</p>
                        <p className='mt-2'>Click "Add Songs" to get started!</p>
                    </div>
                ) : (
                    <div className='space-y-2'>
                        {playlist.songs.map((song, index) => (
                            <div
                                key={song._id}
                                onClick={() => handlePlaySong(song)}
                                className='grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center p-3 rounded hover:bg-[#2a2a2a] group transition cursor-pointer'
                            >
                                <span className='text-gray-400 w-8 text-center'>{index + 1}</span>
                                <div className='flex items-center gap-3'>
                                    <img
                                        src={song.image}
                                        alt={song.name}
                                        className='w-12 h-12 rounded object-cover'
                                    />
                                    <div>
                                        <p className='text-white font-semibold'>{song.name}</p>
                                        <p className='text-gray-400 text-sm'>{song.desc}</p>
                                    </div>
                                </div>
                                <span className='text-gray-400 text-sm'>{song.duration}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent playing song when clicking remove
                                        handleRemoveSong(song._id);
                                    }}
                                    className='opacity-0 group-hover:opacity-100 px-4 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition'
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showAddSongsModal && (
                <AddSongsModal
                    playlistId={id}
                    onClose={() => setShowAddSongsModal(false)}
                    onSongsAdded={fetchPlaylistDetails}
                />
            )}
        </div>
    );
};

export default PlaylistDetail;
