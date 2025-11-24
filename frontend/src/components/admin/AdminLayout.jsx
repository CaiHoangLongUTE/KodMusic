import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'

const AdminLayout = () => {
    return (
        <div className='flex items-start min-h-screen'>
            <AdminSidebar />
            <div className='flex-1 h-screen overflow-y-scroll bg-[#F3FFF7]'>
                <AdminNavbar />
                <div className='pt-8 pl-5 sm:pt-12 sm:pl-12'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AdminLayout
