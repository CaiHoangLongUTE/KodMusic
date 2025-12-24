import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'Tất cả các trường là bắt buộc' });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email đã được đăng ký' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        return res.json({ message: 'Đăng ký thành công' });
    } catch (error) {
        return res.status(500).json({ message: `Đăng ký thất bại: ${error.message}` });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Thông tin đăng nhập không hợp lệ' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Thông tin đăng nhập không hợp lệ' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        return res.json({ message: 'Đăng nhập thành công', token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        return res.status(500).json({ message: `Đăng nhập thất bại: ${error.message}` });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        return res.json({ message: 'Profile fetched', user });
    } catch (error) {
        return res.status(500).json({ message: `Failed to fetch profile: ${error.message}` });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const removeUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "User removed" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
