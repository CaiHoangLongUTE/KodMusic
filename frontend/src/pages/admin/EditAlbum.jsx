import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify';
import { url } from '../../App';
import { useParams, useNavigate } from 'react-router-dom';

const EditAlbum = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [image, setImage] = useState(false);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [bgColor, setBgColor] = useState("#121212");
    const [loading, setLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState("");

    const fetchAlbumData = async () => {
        try {
            const res = await axios.get(`${url}/api/album/list`);
            if (res.data.albums) {
                const albumData = res.data.albums.find(item => item._id === id);
                if (albumData) {
                    setName(albumData.name);
                    setDesc(albumData.desc);
                    setBgColor(albumData.bgColor);
                    setCurrentImage(albumData.image);
                } else {
                    toast.error("Không tìm thấy Album");
                    navigate('/admin/list-album');
                }
            }
        } catch (error) {
            toast.error('Lỗi tải dữ liệu album');
        }
    };

    useEffect(() => {
        fetchAlbumData();
    }, [id]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('name', name);
            formData.append('desc', desc);
            formData.append('bgColor', bgColor);

            if (image) formData.append('image', image);

            const res = await axios.post(`${url}/api/album/update`, formData);

            if (res.data.message) {
                toast.success(res.data.message);
                navigate('/admin/list-album');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi cập nhật album");
        }
        setLoading(false);
    }

    return loading ? (
        <div className='grid place-items-center min-h-[80vh]'>
            <div className='w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin'></div>
        </div>
    ) : (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-8 text-gray-600'>
            <div className='flex flex-col gap-4'>
                <p>Tải lên hình ảnh (tùy chọn)</p>
                <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' accept='image/*' hidden />
                <label htmlFor="image">
                    <img src={image ? URL.createObjectURL(image) : (currentImage || assets.upload_area)} className='w-24 cursor-pointer object-cover' alt="" />
                </label>
            </div>

            <div className='flex flex-col gap-2.5'>
                <p>Tên Album</p>
                <input onChange={(e) => setName(e.target.value)} value={name} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]' placeholder='Type here' type="text" required />
            </div>
            <div className='flex flex-col gap-2.5'>
                <p>Mô tả Album</p>
                <input onChange={(e) => setDesc(e.target.value)} value={desc} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]' placeholder='Type here' type="text" required />
            </div>

            <div className='flex flex-col gap-3'>
                <p>Màu nền</p>
                <input onChange={(e) => setBgColor(e.target.value)} value={bgColor} type="color" />
            </div>

            <div className='flex gap-4'>
                <button type="submit" className='text-base bg-black text-white py-2.5 px-14 cursor-pointer'>Cập nhật</button>
                <button type="button" onClick={() => navigate('/admin/list-album')} className='text-base bg-gray-500 text-white py-2.5 px-14 cursor-pointer hover:bg-gray-600'>Quay lại</button>
            </div>
        </form>
    )
}

export default EditAlbum
