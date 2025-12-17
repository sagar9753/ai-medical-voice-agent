"use client"

import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@clerk/nextjs'

export type doctorAgent = {
  id: number,
  specialist: string,
  description: string,
  image: string,
  agentPrompt: string,
  voiceId?: string,
  subscriptionRequired: boolean
}
type props = {
  doctorAgent: doctorAgent
}

const DoctorAgentCard = ({ doctorAgent }: props) => {
  const { has } = useAuth()
  // @ts-ignore
  const isProUser = has &&has({ plan: 'pro' })
  
  return (
    <div className='relative'>
      {!isProUser && doctorAgent.subscriptionRequired &&
        <Badge className='absolute right-0 px-2 m-2'>Pro</Badge>
      }
      <Image src={doctorAgent.image} alt={doctorAgent.specialist}
        width={200} height={200}
        className='w-full'
      />
      <h2 className="font-bold mt-1">{doctorAgent.specialist}</h2>
      <p className="line-clamp-2 text-sm text-gray-500">{doctorAgent.description}</p>
      <Button className='w-full mt-2'>Start Consultation</Button>
    </div>
  )
}

export default DoctorAgentCard