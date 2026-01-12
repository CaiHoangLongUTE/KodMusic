import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerContext } from '../../context/PlayerContext';
import { assets } from '../../assets/assets';
import EditPlaylistModal from './EditPlaylistModal';
import CreatePlaylistModal from './CreatePlaylistModal';
import axios from 'axios';
import { url } from '../../App';
import { toast } from 'react-toastify';

const PlaylistList = () => {
    const navigate = useNavigate();
    const { playlistsData, fetchPlaylists } = useContext(PlayerContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetchPlaylists(userId);
        }
    }, []);

    const filteredPlaylists = playlistsData.filter(playlist =>
        playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (playlist) => {
        setSelectedPlaylist(playlist);
        setShowEditModal(true);
    };

    const handleDelete = async (playlistId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa danh sách phát này không?')) {
            return;
        }

        try {
            const res = await axios.delete(`${url}/api/playlist/delete/${playlistId}`);
            if (res.data.message) {
                toast.success(res.data.message);
                const userId = localStorage.getItem('userId');
                if (userId) {
                    fetchPlaylists(userId);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi xóa danh sách phát');
        }
    };

    return (
        <div className='w-full px-6 pt-4'>
            <div className='flex items-center justify-between mb-6'>
                <h1 className='text-white text-3xl font-bold'>Danh sách phát của bạn</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className='px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition'
                >
                    Tạo danh sách phát mới
                </button>
            </div>

            <div className='mb-6'>
                <input
                    type='text'
                    placeholder='Tìm kiếm danh sách phát...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full max-w-md p-3 rounded-full bg-[#242424] text-white outline-none'
                />
            </div>

            {filteredPlaylists.length === 0 ? (
                <div className='text-center text-gray-400 mt-10'>
                    <p className='text-xl'>Không tìm thấy danh sách phát nào</p>
                    <p className='mt-2'>Tạo danh sách phát đầu tiên của bạn để bắt đầu!</p>
                </div>
            ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                    {filteredPlaylists.map((playlist) => (
                        <div
                            key={playlist._id}
                            className='bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group'
                        >
                            <div onClick={() => navigate(`/playlist/${playlist._id}`)}>
                                <div className='relative mb-4'>
                                    {playlist.image ? (
                                        <img
                                            src={playlist.image}
                                            alt={playlist.name}
                                            className='w-full aspect-square object-cover rounded'
                                        />
                                    ) : (
                                        <div className='w-full aspect-square bg-[#282828] rounded flex items-center justify-center'>
                                            <img src={assets.stack_icon} alt='' className='w-12 opacity-50' />
                                        </div>
                                    )}
                                </div>
                                <h3 className='text-white font-semibold truncate'>{playlist.name}</h3>
                                <p className='text-gray-400 text-sm mt-1'>
                                    {playlist.songs?.length || 0} bài hát
                                </p>
                            </div>
                            <div className='flex gap-2 mt-3'>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(playlist);
                                    }}
                                    className='flex-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition'
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(playlist._id);
                                    }}
                                    className='flex-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition'
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showEditModal && selectedPlaylist && (
                <EditPlaylistModal
                    playlist={selectedPlaylist}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedPlaylist(null);
                    }}
                />
            )}

            {showCreateModal && (
                <CreatePlaylistModal onClose={() => setShowCreateModal(false)} />
            )}
        </div>
    );
};

export default PlaylistList;
