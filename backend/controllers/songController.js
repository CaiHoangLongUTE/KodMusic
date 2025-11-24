import Song from '../models/songModel.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const addSong = async (req, res) => {
    try {
        const { name, desc, album } = req.body;
        const imageFile = req.files?.image?.[0];
        const audioFile = req.files?.audio?.[0];

        if (!name || !desc) return res.status(400).json({ message: 'Name and description are required' });
        if (!audioFile) return res.status(400).json({ message: 'Audio file is required' });

        let imageUrl = '';
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image', folder: 'kodmusic/images' });
            imageUrl = imageUpload.secure_url;
            fs.unlinkSync(imageFile.path);
        }

        const audioUpload = await cloudinary.uploader.upload(audioFile.path, { resource_type: 'video', folder: 'kodmusic/songs' });
        const audioUrl = audioUpload.secure_url;
        const duration = audioUpload.duration ? `${Math.floor(audioUpload.duration / 60)}:${String(Math.floor(audioUpload.duration % 60)).padStart(2, '0')}` : '0:00';
        fs.unlinkSync(audioFile.path);

        const song = new Song({ name, desc, album: album || 'none', image: imageUrl, file: audioUrl, duration });
        await song.save();

        return res.json({ message: 'Song added successfully', song });
    } catch (error) {
        return res.status(500).json({ message: `Error adding song: ${error.message}` });
    }
};

export const listSongs = async (req, res) => {
    try {
        const songs = await Song.find({}).sort({ createdAt: -1 });
        return res.json({ message: 'Songs fetched successfully', songs });
    } catch (error) {
        return res.status(500).json({ message: `Error fetching songs: ${error.message}` });
    }
};

export const removeSong = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: 'Song ID is required' });

        const song = await Song.findById(id);
        if (!song) return res.status(404).json({ message: 'Song not found' });

        if (song.image) {
            const imagePublicId = song.image.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(`kodmusic/images/${imagePublicId}`);
        }

        if (song.file) {
            const audioPublicId = song.file.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(`kodmusic/songs/${audioPublicId}`, { resource_type: 'video' });
        }

        await Song.findByIdAndDelete(id);
        return res.json({ message: 'Song removed successfully' });
    } catch (error) {
        return res.status(500).json({ message: `Error removing song: ${error.message}` });
    }
};
