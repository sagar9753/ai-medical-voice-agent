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
            <div className="px-10 md:px-20 lg:px-40 py-10">
            {children}
            </div>
        </div>
    )
}
