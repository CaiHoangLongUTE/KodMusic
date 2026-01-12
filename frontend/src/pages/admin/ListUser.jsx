import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { url } from '../../App'
import { toast } from 'react-toastify'

const ListUser = () => {

    const [data, setData] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${url}/api/auth/list`);
            if (response.data.success) {
                setData(response.data.users)
            } else {
                toast.error("Đã xảy ra lỗi")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi")
        }
    }

    const removeUser = async (id) => {
        try {
            const response = await axios.post(`${url}/api/auth/remove`, { id });
            if (response.data.success) {
                toast.success(response.data.message);
                await fetchUsers();
            } else {
                toast.error("Đã xảy ra lỗi")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi")
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <div>
            <h2 className='text-2xl font-bold mb-8'>Tất cả người dùng</h2>

            <div className='overflow-x-auto'>
                <table className='w-full min-w-[800px] border-collapse'>
                    <thead>
                        <tr className='bg-gray-100'>
                            <th className='p-3 text-left'>#</th>
                            <th className='p-3 text-left'>Tên</th>
                            <th className='p-3 text-left'>Email</th>
                            <th className='p-3 text-left'>ID</th>
                            <th className='p-3 text-left'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index} className='border-b hover:bg-gray-50'>
                                <td className='p-3'>{index + 1}</td>
                                <td className='p-3'>{item.name}</td>
                                <td className='p-3'>{item.email}</td>
                                <td className='p-3'>{item._id}</td>
                                <td className='p-3'>
                                    <button
                                        onClick={() => removeUser(item._id)}
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
                        Không tìm thấy người dùng nào
                    </div>
                )}
            </div>
        </div>
    )
}

export default ListUser
