import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify';
import { url } from '../../App';

const AddSong = () => {

  const [image, setImage] = useState(false);
  const [song, setSong] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [album, setAlbum] = useState("none");
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState([]);

  const fetchAlbums = async () => {
    try {
      const res = await axios.get(`${url}/api/album/list`);
      if (res.data.albums && Array.isArray(res.data.albums)) {
        setAlbumData(res.data.albums);
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
      toast.error('Không thể tải danh sách album');
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!song || !name) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('desc', desc);
      formData.append('image', image);
      formData.append('audio', song);
      formData.append('album', album);

      const res = await axios.post(`${url}/api/song/add`, formData);

      if (res.data.message) {
        toast.success(res.data.message);
        setName("");
        setDesc("");
        setAlbum("none");
        setImage(false);
        setSong(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi thêm bài hát");
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
          <p>Tải lên bài hát</p>
          <input onChange={(e) => setSong(e.target.files[0])} type="file" id='song' accept='audio/*' hidden />
          <label htmlFor="song">
            <img src={song ? assets.upload_added : assets.upload_song} className='w-24 cursor-pointer' alt="" />
          </label>
        </div>
        <div className='flex flex-col gap-4'>
          <p>Tải lên hình ảnh</p>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' accept='image/*' hidden />
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} className='w-24 cursor-pointer' alt="" />
          </label>
        </div>
      </div>

      <div className='flex flex-col gap-2.5'>
        <p>Tên bài hát</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]' placeholder='Nhập vào đây' type="text" required />
      </div>
      <div className='flex flex-col gap-2.5'>
        <p>Mô tả bài hát</p>
        <input onChange={(e) => setDesc(e.target.value)} value={desc} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]' placeholder='Nhập vào đây' type="text" required />
      </div>
      <div className='flex flex-col gap-2.5'>
        <p>Album</p>
        <select onChange={(e) => setAlbum(e.target.value)} value={album} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]'>
          <option value="none">Không</option>
          {albumData.map((item, index) => (
            <option key={index} value={item.name}>{item.name}</option>
          ))}
        </select>
      </div>

      <button type="submit" className='text-base bg-black text-white py-2.5 px-14 cursor-pointer'>Thêm</button>
    </form>
  )
}

export default AddSong