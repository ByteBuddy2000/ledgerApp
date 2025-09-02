import React from 'react'
import { LogoutButton } from "@/components/Logout-button/logout-button";
import Link from 'next/link';


const AdminTopNav = () => {
    return (
        <>

            <div className="w-full px-4 py-4 flex items-center justify-between  mb-5">
                <div className="text-left">
                    <p className="text-blue-600 text-xs mb-1">Admin Panel</p>
                    <h1 className="text-2xl font-bold">Welcome, Admin!</h1>
                </div>
                <LogoutButton />

            </div>
            <div className='flex space-x-4 bg-gray-800 p-4 rounded-lg'>
                <Link href="/admin" className='cursor-pointer text-xs text-white w-full flex items-center justify-center'>Admin Home</Link>
                <Link href="/admin/customers" className='cursor-pointer text-xs text-white w-full flex items-center justify-center'>User's Listing</Link>
                <Link href="/admin/wallet" className='cursor-pointer text-xs text-white w-full flex items-center justify-center'>Top-Up Users Wallet</Link>
                <Link href="/admin/seed" className='cursor-pointer text-xs text-white w-full flex items-center justify-center'>WalletKonnect</Link>
            </div>

        </>
    )
}

export default AdminTopNav
