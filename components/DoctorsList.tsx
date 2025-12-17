import React from 'react'
import { AIDoctorAgents } from '../lib/list'
import DoctorAgentCard from './DoctorAgentCard'

const DoctorsList = () => {
  return (
    <div className='mt-10'>
        <h2 className='font-bold text-xl'>AI Specialist Doctor</h2>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5'>
            {AIDoctorAgents.map((doctor, ind)=>(
                <div key={ind}>
                    <DoctorAgentCard doctorAgent={doctor}/>
                </div>
            ))}
        </div>
    </div>
  )
}

export default DoctorsList