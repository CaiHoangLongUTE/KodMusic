import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { url } from '../../App';
import { toast } from 'react-toastify';

const ListAlbum = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlbums = async () => {
    try {
      const res = await axios.get(`${url}/api/album/list`);
      console.log('Albums response:', res.data);
      if (res.data.albums) {
        setData(res.data.albums);
      } else {
        setData([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching albums:', error);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi tải danh sách album");
      setLoading(false);
    }
  }

  const removeAlbum = async (id) => {
    try {
      await axios.delete(`${url}/api/album/remove`, { data: { id } });
      toast.success("Xóa album thành công");
      fetchAlbums();
    } catch (error) {
      toast.error("Lỗi khi xóa album");
    }
  }

  useEffect(() => {
    fetchAlbums();
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
        <h2 className='text-2xl font-bold'>Tất cả Album</h2>
        <button
          onClick={() => fetchAlbums()}
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
              <th className='p-3 text-left'>Mô tả</th>
              <th className='p-3 text-left'>Màu nền</th>
              <th className='p-3 text-left'>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data.map((album, index) => (
              <tr key={album._id || index} className='border-b hover:bg-gray-50'>
                <td className='p-3'>
                  <img
                    src={album.image}
                    alt={album.name}
                    className='w-12 h-12 object-cover rounded'
                  />
                </td>
                <td className='p-3'>{album.name}</td>
                <td className='p-3'>{album.desc}</td>
                <td className='p-3'>
                  <div className='w-20 h-2 rounded' style={{ backgroundColor: album.bgColor }}></div>
                </td>
                <td className='p-3'>
                  <button
                    onClick={() => removeAlbum(album._id)}
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
            Không tìm thấy album nào
          </div>
        )}
      </div>
    </div>
  );
}

export default ListAlbum;