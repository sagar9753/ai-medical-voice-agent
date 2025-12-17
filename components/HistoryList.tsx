"use client"

import { DoctorAgentDetails } from '@/app/dashboard/doctor-agent/[sessionId]/page'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import HistoryTable from './HistoryTable'
import { Spinner } from './ui/spinner'
import { toast } from 'sonner'

const HistoryList = () => {
    const [historyList, setHistoryList] = useState<DoctorAgentDetails[]>([])
    const [loading, setLoading] = useState<boolean>();

    useEffect(() => {
        getHistoryList();
    }, [])

    const getHistoryList = async () => {
        setLoading(true);
        try {
          const res = await axios.get('/api/session-chat', {
            params: { sessionId: 'all' }
          });
      
          setHistoryList(res.data);
        } catch (error: any) {
        //   console.error("Failed to fetch history list", error);
      
          toast.error(error?.response?.data?.message || "Failed to load history");
        } finally{
            setLoading(false)
        }
    }
    return (
        <div className='rounded-2xl p-4 sm:p-6 shadow-sm shadow-gray-400'>
            {loading ?
                <div className="flex justify-center py-6">
                    <Spinner className="size-6 text-primary" />
                </div> :
                <div>
                    {historyList?.length == 0 ?
                        <div className='flex flex-col items-center justify-center mt-5 p-7 border border-dashed'>
                            <Image src={'/doctor.png'} alt='doctor'
                                width={200} height={200}
                            />
                            <h2 className='font-bold text-xl'>No Recent Consultation</h2>
                            <p>It looks like you haven't consulted any doctor yet.</p>
                        </div>
                        :
                        <div>
                            <HistoryTable historyList={historyList} />
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default HistoryList