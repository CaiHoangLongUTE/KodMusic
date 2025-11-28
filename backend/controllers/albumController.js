import Album from '../models/albumModel.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const addAlbum = async (req, res) => {
    try {
        const { name, desc, bgColor } = req.body;
        const imageFile = req.files?.image?.[0];

        if (!name || !desc || !bgColor) return res.status(400).json({ message: 'Name, description, and background color are required' });
        if (!imageFile) return res.status(400).json({ message: 'Image file is required' });

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image', folder: 'kodmusic/albums' });
        const imageUrl = imageUpload.secure_url;
        fs.unlinkSync(imageFile.path);

        const album = new Album({ name, desc, bgColor, image: imageUrl });
        await album.save();

        return res.json({ message: 'Album added successfully', album });
    } catch (error) {
        return res.status(500).json({ message: `Error adding album: ${error.message}` });
    }
};

export const listAlbums = async (req, res) => {
    try {
        const albums = await Album.find({}).sort({ createdAt: -1 });
        return res.json({ message: 'Albums fetched successfully', albums });
    } catch (error) {
        return res.status(500).json({ message: `Error fetching albums: ${error.message}` });
    }
};

export const removeAlbum = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: 'Album ID is required' });

        const album = await Album.findById(id);
        if (!album) return res.status(404).json({ message: 'Album not found' });

        if (album.image) {
            const publicId = album.image.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(`kodmusic/albums/${publicId}`);
        }

        await Album.findByIdAndDelete(id);
        return res.json({ message: 'Album removed successfully' });
    } catch (error) {
        return res.status(500).json({ message: `Error removing album: ${error.message}` });
    }
};

export const searchAlbums = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json({ albums: [] });

        const albums = await Album.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { desc: { $regex: query, $options: 'i' } }
            ]
        }).limit(20).sort({ createdAt: -1 });

        return res.json({ message: 'Search completed', albums });
    } catch (error) {
        return res.status(500).json({ message: `Error searching albums: ${error.message}` });
    }
};
