import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { url } from '../../App';
import { toast } from 'react-toastify';

const ListSong = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSongs = async () => {
    try {
      const res = await axios.get(`${url}/api/song/list`);
      console.log('Songs response:', res.data);
      setData(res.data.songs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching songs:', error);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi tải danh sách bài hát");
      setLoading(false);
    }
  }

  const removeSong = async (id) => {
    try {
      await axios.delete(`${url}/api/song/remove`, { data: { id } });
      toast.success("Xóa bài hát thành công");
      fetchSongs();
    } catch (error) {
      toast.error("Lỗi khi xóa bài hát");
    }
  }

  useEffect(() => {
    fetchSongs();
  }, []);

  if (loading) {
    return (
      <div className='grid place-items-center min-h-[80vh]'>
        <div className='w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-2xl font-bold'>Tất cả bài hát</h2>
        <button
          onClick={() => fetchSongs()}
          className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
        >
          Làm mới
        </button>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full min-w-[800px] border-collapse'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='p-3 text-left'>Hình ảnh</th>
              <th className='p-3 text-left'>Tên</th>
              <th className='p-3 text-left'>Album</th>
              <th className='p-3 text-left'>Thời lượng</th>
              <th className='p-3 text-left'>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data.map((song, index) => (
              <tr key={song._id || index} className='border-b hover:bg-gray-50'>
                <td className='p-3'>
                  <img
                    src={song.image}
                    alt={song.name}
                    className='w-12 h-12 object-cover rounded'
                  />
                </td>
                <td className='p-3'>{song.name}</td>
                <td className='p-3'>{song.album}</td>
                <td className='p-3'>{song.duration}</td>
                <td className='p-3'>
                  <button
                    onClick={() => removeSong(song._id)}
                    className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className='text-center py-8 text-gray-500'>
            Không tìm thấy bài hát nào
          </div>
        )}
      </div>
    </div>
  );
}

export default ListSong;