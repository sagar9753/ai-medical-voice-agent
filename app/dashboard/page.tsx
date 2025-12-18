"use client"

import DoctorsList from '@/components/DoctorsList'
import HistoryList from '@/components/HistoryList'
import NewSessionDialog from '@/components/NewSessionDialog'
import { useAuth } from '@clerk/nextjs'
import { Loader } from 'lucide-react'
import React from 'react'

const Dashboard = () => {
  
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          My Dashboard
        </h2>

        <div className="self-start sm:self-auto">
          <NewSessionDialog />
        </div>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 gap-6">

        {/* History */}
        <HistoryList />

        {/* Doctors */}
        <DoctorsList />

      </div>
    </div>
  )
}

export default Dashboard
