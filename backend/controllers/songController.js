import Song from '../models/songModel.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const addSong = async (req, res) => {
    try {
        const { name, desc, album } = req.body;
        const imageFile = req.files?.image?.[0];
        const audioFile = req.files?.audio?.[0];

        if (!name || !desc) return res.status(400).json({ message: 'Tên và mô tả là bắt buộc' });
        if (!audioFile) return res.status(400).json({ message: 'Tệp âm thanh là bắt buộc' });

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

        return res.json({ message: 'Thêm bài hát thành công', song });
    } catch (error) {
        return res.status(500).json({ message: `Lỗi khi thêm bài hát: ${error.message}` });
    }
};

export const updateSong = async (req, res) => {
    try {
        const { id, name, desc, album } = req.body;
        const imageFile = req.files?.image?.[0];
        const audioFile = req.files?.audio?.[0];

        if (!id) return res.status(400).json({ message: 'ID bài hát là bắt buộc' });

        const song = await Song.findById(id);
        if (!song) return res.status(404).json({ message: 'Không tìm thấy bài hát' });

        if (name) song.name = name;
        if (desc) song.desc = desc;
        if (album) song.album = album;

        if (imageFile) {
            // Delete old image
            if (song.image) {
                const imagePublicId = song.image.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(`kodmusic/images/${imagePublicId}`);
            }
            // Upload new image
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image', folder: 'kodmusic/images' });
            song.image = imageUpload.secure_url;
            fs.unlinkSync(imageFile.path);
        }

        if (audioFile) {
            // Delete old audio
            if (song.file) {
                const audioPublicId = song.file.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(`kodmusic/songs/${audioPublicId}`, { resource_type: 'video' });
            }
            // Upload new audio
            const audioUpload = await cloudinary.uploader.upload(audioFile.path, { resource_type: 'video', folder: 'kodmusic/songs' });
            song.file = audioUpload.secure_url;
            song.duration = audioUpload.duration ? `${Math.floor(audioUpload.duration / 60)}:${String(Math.floor(audioUpload.duration % 60)).padStart(2, '0')}` : '0:00';
            fs.unlinkSync(audioFile.path);
        }

        await song.save();
        return res.json({ message: 'Cập nhật bài hát thành công', song });
    } catch (error) {
        return res.status(500).json({ message: `Lỗi cập nhật bài hát: ${error.message}` });
    }
};

export const listSongs = async (req, res) => {
    try {
        const songs = await Song.find({}).sort({ createdAt: -1 });
        return res.json({ message: 'Lấy danh sách bài hát thành công', songs });
    } catch (error) {
        return res.status(500).json({ message: `Lỗi khi lấy danh sách bài hát: ${error.message}` });
    }
};

export const removeSong = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.status(400).json({ message: 'ID bài hát là bắt buộc' });

        const song = await Song.findById(id);
        if (!song) return res.status(404).json({ message: 'Không tìm thấy bài hát' });

        if (song.image) {
            const imagePublicId = song.image.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(`kodmusic/images/${imagePublicId}`);
        }

        if (song.file) {
            const audioPublicId = song.file.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(`kodmusic/songs/${audioPublicId}`, { resource_type: 'video' });
        }

        await Song.findByIdAndDelete(id);
        return res.json({ message: 'Xóa bài hát thành công' });
    } catch (error) {
        return res.status(500).json({ message: `Lỗi khi xóa bài hát: ${error.message}` });
    }
};

export const searchSongs = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json({ songs: [] });

        const songs = await Song.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { desc: { $regex: query, $options: 'i' } }
            ]
        }).limit(20).sort({ createdAt: -1 });

        return res.json({ message: 'Tìm kiếm hoàn tất', songs });
    } catch (error) {
        return res.status(500).json({ message: `Lỗi tìm kiếm bài hát: ${error.message}` });
    }
};
