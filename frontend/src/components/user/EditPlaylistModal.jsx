import React, { useState, useContext } from 'react';
import axios from 'axios';
import { url } from '../../App';
import { PlayerContext } from '../../context/PlayerContext';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const EditPlaylistModal = ({ playlist, onClose }) => {
    const [name, setName] = useState(playlist.name);
    const [description, setDescription] = useState(playlist.description || '');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { fetchPlaylists } = useContext(PlayerContext);
    const { user } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Please enter a playlist name');
            return;
        }

        // Get userId from localStorage or from user context
        let userId = localStorage.getItem('userId');
        if (!userId && user && user._id) {
            userId = user._id;
            localStorage.setItem('userId', userId); // Store it for future use
        }

        if (!userId) {
            toast.error('Please login to edit playlist');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            if (image) {
                formData.append('image', image);
            }

            const res = await axios.put(`${url}/api/playlist/update/${playlist._id}`, formData);
            if (res.data.message) {
                toast.success(res.data.message);
                await fetchPlaylists(userId);
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating playlist');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
            <div className='bg-[#282828] rounded-lg p-6 w-[90%] max-w-md'>
                <h2 className='text-white text-2xl font-bold mb-4'>Edit Playlist</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='text-white block mb-2'>Playlist Name *</label>
                        <input
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='w-full p-2 rounded bg-[#3e3e3e] text-white outline-none'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='text-white block mb-2'>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className='w-full p-2 rounded bg-[#3e3e3e] text-white outline-none resize-none'
                            rows='3'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='text-white block mb-2'>Cover Image</label>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={(e) => setImage(e.target.files[0])}
                            className='w-full p-2 rounded bg-[#3e3e3e] text-white'
                        />
                        {playlist.image && !image && (
                            <p className='text-gray-400 text-sm mt-1'>Current image will be kept if no new image is selected</p>
                        )}
                    </div>
                    <div className='flex gap-3 justify-end'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='px-6 py-2 bg-transparent border border-white text-white rounded-full hover:bg-white hover:text-black transition'
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition'
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPlaylistModal;
