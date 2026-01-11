"use client"

import DoctorsList from '@/components/DoctorsList'
import HistoryList from '@/components/HistoryList'
import NewSessionDialog from '@/components/NewSessionDialog'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useAuth } from '@clerk/nextjs'
import { Loader } from 'lucide-react'
import React, { useContext } from 'react'
import { toast } from 'sonner'

const Dashboard = () => {
  const { has, isLoaded } = useAuth()
  // @ts-ignore
  const isProUser = isLoaded && has({ plan: 'pro' })
  const context = useContext(UserDetailContext)
  const userDetail = context?.userDetail

  if (!isLoaded || !userDetail) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader className="animate-spin" />
      </div>
    );
  }  

  return (
    <div className="space-y-8">
      <div className='text-center bg-amber-200'>
        {!isProUser &&
          <>
            {userDetail && userDetail?.credits > 0 ? 'You have only 1 free consultation, to get more subscribe to our plan' : 'You’ve used your free consultation. Subscribe to continue.'}
          </>
        }
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          My Dashboard
        </h2>
        <div className="w-fit rounded-xl border bg-white px-4 py-3 shadow-sm flex items-center justify-between gap-3">
          <span className="text-sm text-gray-600 font-bold">
            Remaining Consultations
          </span>

          <span className="text-lg font-semibold text-green-600">
            {userDetail?.credits}
          </span>
        </div>


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
