import Playlist from '../models/playlistModel.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Create a new playlist
export const createPlaylist = async (req, res) => {
    try {
        const { name, description, userId } = req.body;
        const imageFile = req.files?.image?.[0];

        if (!name || !userId) {
            return res.status(400).json({ message: 'Name and userId are required' });
        }

        let imageUrl = '';
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: 'image',
                folder: 'kodmusic/playlists'
            });
            imageUrl = imageUpload.secure_url;
            fs.unlinkSync(imageFile.path);
        }

        const playlist = new Playlist({
            name,
            description: description || '',
            userId,
            songs: [],
            image: imageUrl
        });

        await playlist.save();
        return res.json({ message: 'Playlist created successfully', playlist });
    } catch (error) {
        return res.status(500).json({ message: `Error creating playlist: ${error.message}` });
    }
};

// Get all playlists for a user
export const getUserPlaylists = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const playlists = await Playlist.find({ userId }).sort({ createdAt: -1 });
        return res.json({ message: 'Playlists fetched successfully', playlists });
    } catch (error) {
        return res.status(500).json({ message: `Error fetching playlists: ${error.message}` });
    }
};

// Get playlist by ID with populated songs
export const getPlaylistById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Playlist ID is required' });
        }

        const playlist = await Playlist.findById(id).populate('songs');

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        return res.json({ message: 'Playlist fetched successfully', playlist });
    } catch (error) {
        return res.status(500).json({ message: `Error fetching playlist: ${error.message}` });
    }
};

// Update playlist
export const updatePlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const imageFile = req.files?.image?.[0];

        if (!id) {
            return res.status(400).json({ message: 'Playlist ID is required' });
        }

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Update fields
        if (name) playlist.name = name;
        if (description !== undefined) playlist.description = description;

        // Update image if provided
        if (imageFile) {
            // Delete old image from cloudinary if exists
            if (playlist.image) {
                const imagePublicId = playlist.image.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(`kodmusic/playlists/${imagePublicId}`);
            }

            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: 'image',
                folder: 'kodmusic/playlists'
            });
            playlist.image = imageUpload.secure_url;
            fs.unlinkSync(imageFile.path);
        }

        await playlist.save();
        return res.json({ message: 'Playlist updated successfully', playlist });
    } catch (error) {
        return res.status(500).json({ message: `Error updating playlist: ${error.message}` });
    }
};

// Delete playlist
export const deletePlaylist = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Playlist ID is required' });
        }

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Delete image from cloudinary if exists
        if (playlist.image) {
            const imagePublicId = playlist.image.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(`kodmusic/playlists/${imagePublicId}`);
        }

        await Playlist.findByIdAndDelete(id);
        return res.json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: `Error deleting playlist: ${error.message}` });
    }
};

// Add song to playlist
export const addSongToPlaylist = async (req, res) => {
    try {
        const { playlistId, songId } = req.body;

        if (!playlistId || !songId) {
            return res.status(400).json({ message: 'Playlist ID and Song ID are required' });
        }

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Check if song already exists in playlist
        if (playlist.songs.includes(songId)) {
            return res.status(400).json({ message: 'Song already exists in playlist' });
        }

        playlist.songs.push(songId);
        await playlist.save();

        return res.json({ message: 'Song added to playlist successfully', playlist });
    } catch (error) {
        return res.status(500).json({ message: `Error adding song to playlist: ${error.message}` });
    }
};

// Remove song from playlist
export const removeSongFromPlaylist = async (req, res) => {
    try {
        const { playlistId, songId } = req.body;

        if (!playlistId || !songId) {
            return res.status(400).json({ message: 'Playlist ID and Song ID are required' });
        }

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
        await playlist.save();

        return res.json({ message: 'Song removed from playlist successfully', playlist });
    } catch (error) {
        return res.status(500).json({ message: `Error removing song from playlist: ${error.message}` });
    }
};
