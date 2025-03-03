import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Welcome() {
    return (
        <div className="relative flex justify-center items-center text-center h-screen bg-gradient-to-br from-[#E6FFF1] to-[#FFFFFF]">
            
            {/* Blurry Decorative Element */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#00C767] opacity-20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#03624C] opacity-20 rounded-full blur-3xl"></div>

            <div className='md:border border-[#00C767] rounded-4xl p-5 md:shadow-2xl bg-white z-10'>
                <Image
                    src="/images/welcome_image.svg"
                    width={300}
                    height={400}
                    alt="Welcome"
                    className="" />
                <div className="lg:space-y-8 space-y-16">
                    <div className="space-y-2">
                        <h1 className='text-2xl font-semibold'>Discover Your <br /> Dream House here</h1>
                        <p className='text-sm font-light'>Explore all the existing Homes in your area</p>
                    </div>
                    <div className='space-x-5 text-sm'>
                        <Link href='/auth/login'>
                            <button className='py-3 px-10 border border-[#03624C] shadow-2xl bg-[#03624C] text-white rounded-md'>Login</button>
                        </Link>
                        <Link href='/auth/role'>
                            <button className='py-3 px-10 shadow-2xl bg-[#DAFCE4] border rounded-md border-[#00C767]'>Register</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
