import Album from '../models/albumModel.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const addAlbum = async (req, res) => {
    try {
        const { name, desc, bgColor } = req.body;
        const imageFile = req.files?.image?.[0];

        if (!name || !desc || !bgColor) return res.status(400).json({ message: 'Tên, mô tả và màu nền là bắt buộc' });
        if (!imageFile) return res.status(400).json({ message: 'Tệp hình ảnh là bắt buộc' });

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image', folder: 'kodmusic/albums' });
        const imageUrl = imageUpload.secure_url;
        fs.unlinkSync(imageFile.path);

        const album = new Album({ name, desc, bgColor, image: imageUrl });
        await album.save();

        return res.json({ message: 'Thêm Album thành công', album });
    } catch (error) {
        return res.status(500).json({ message: `Lỗi khi thêm Album: ${error.message}` });
    }
};

export const updateAlbum = async (req, res) => {
    try {
        const { id, name, desc, bgColor } = req.body;
        const imageFile = req.files?.image?.[0];

        if (!id) return res.status(400).json({ message: 'Album ID is required' });

        const album = await Album.findById(id);
        if (!album) return res.status(404).json({ message: 'Album not found' });

        if (name) album.name = name;
        if (desc) album.desc = desc;
        if (bgColor) album.bgColor = bgColor;

        if (imageFile) {
            // Delete old image
            if (album.image) {
                const publicId = album.image.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(`kodmusic/albums/${publicId}`);
            }
            // Upload new image
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image', folder: 'kodmusic/albums' });
            album.image = imageUpload.secure_url;
            fs.unlinkSync(imageFile.path);
        }

        await album.save();
        return res.json({ message: 'Cập nhật Album thành công', album });
    } catch (error) {
        return res.status(500).json({ message: `Lỗi cập nhật Album: ${error.message}` });
    }
};

export const listAlbums = async (req, res) => {
    try {
        const albums = await Album.find({}).sort({ createdAt: -1 });
        return res.json({ message: 'Lấy danh sách Album thành công', albums });
    } catch (error) {
        return res.status(500).json({ message: `Lỗi khi lấy danh sách Album: ${error.message}` });
    }
};

export const getAlbum = async (req, res) => {
    console.log(req.params);
    try {
        // const album = await Album.find({id:})
    } catch (error) {

    }
}

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
        return res.json({ message: 'Đã xóa Album thành công' });
    } catch (error) {
        return res.status(500).json({ message: `Lỗi khi xóa Album: ${error.message}` });
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
