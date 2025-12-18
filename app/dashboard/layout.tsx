import DashNavbar from '@/components/DashNavbar';
import React from 'react'

export default function DashLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) { 
    return (
        <div>
            {/* <DashNavbar /> */}
            <div className="px-5 py-5 sm:py-10 sm:px-6 md:px-20 lg:px-40">
            {children}
            </div>
        </div>
    )
}
