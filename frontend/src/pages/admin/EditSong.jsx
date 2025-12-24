import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify';
import { url } from '../../App';
import { useParams, useNavigate } from 'react-router-dom';

const EditSong = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [image, setImage] = useState(false);
    const [song, setSong] = useState(false);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [album, setAlbum] = useState("none");
    const [loading, setLoading] = useState(false);
    const [albumData, setAlbumData] = useState([]);
    const [currentImage, setCurrentImage] = useState("");
    const [currentSong, setCurrentSong] = useState("");

    const fetchAlbums = async () => {
        try {
            const res = await axios.get(`${url}/api/album/list`);
            if (res.data.albums) {
                setAlbumData(res.data.albums);
            }
        } catch (error) {
            toast.error('Lỗi tải danh sách album');
        }
    };

    const fetchSongData = async () => {
        try {
            const res = await axios.get(`${url}/api/song/list`);
            if (res.data.songs) {
                const songData = res.data.songs.find(item => item._id === id);
                if (songData) {
                    setName(songData.name);
                    setDesc(songData.desc);
                    setAlbum(songData.album);
                    setCurrentImage(songData.image);
                    setCurrentSong(songData.file);
                } else {
                    toast.error("Không tìm thấy bài hát");
                    navigate('/admin/list-song');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi tải dữ liệu bài hát');
        }
    };

    useEffect(() => {
        fetchAlbums();
        fetchSongData();
    }, [id]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('name', name);
            formData.append('desc', desc);
            formData.append('album', album);

            if (image) formData.append('image', image);
            if (song) formData.append('audio', song);

            const res = await axios.post(`${url}/api/song/update`, formData);

            if (res.data.message) {
                toast.success(res.data.message);
                navigate('/admin/list-song');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi cập nhật bài hát");
        }
        setLoading(false);
    }

    return loading ? (
        <div className='grid place-items-center min-h-[80vh]'>
            <div className='w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin'></div>
        </div>
    ) : (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-8 text-gray-600'>
            <div className='flex gap-8'>
                <div className='flex flex-col gap-4'>
                    <p>Tải lên bài hát (tùy chọn)</p>
                    <input onChange={(e) => setSong(e.target.files[0])} type="file" id='song' accept='audio/*' hidden />
                    <label htmlFor="song">
                        <img src={song ? assets.upload_added : assets.upload_song} className='w-24 cursor-pointer' alt="" />
                    </label>
                    {!song && currentSong && <p className="text-xs">Tệp hiện có</p>}
                </div>
                <div className='flex flex-col gap-4'>
                    <p>Tải lên hình ảnh (tùy chọn)</p>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' accept='image/*' hidden />
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : (currentImage || assets.upload_area)} className='w-24 cursor-pointer object-cover' alt="" />
                    </label>
                </div>
            </div>

            <div className='flex flex-col gap-2.5'>
                <p>Tên bài hát</p>
                <input onChange={(e) => setName(e.target.value)} value={name} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]' placeholder='Type here' type="text" required />
            </div>
            <div className='flex flex-col gap-2.5'>
                <p>Mô tả bài hát</p>
                <input onChange={(e) => setDesc(e.target.value)} value={desc} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]' placeholder='Type here' type="text" required />
            </div>
            <div className='flex flex-col gap-2.5'>
                <p>Album</p>
                <select onChange={(e) => setAlbum(e.target.value)} value={album} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]'>
                    <option value="none">None</option>
                    {albumData.map((item, index) => (
                        <option key={index} value={item.name}>{item.name}</option>
                    ))}
                </select>
            </div>

            <div className='flex gap-4'>
                <button type="submit" className='text-base bg-black text-white py-2.5 px-14 cursor-pointer'>Cập nhật</button>
                <button type="button" onClick={() => navigate('/admin/list-song')} className='text-base bg-gray-500 text-white py-2.5 px-14 cursor-pointer hover:bg-gray-600'>Quay lại</button>
            </div>
        </form>
    )
}

export default EditSong
