import { PricingTable } from '@clerk/nextjs'
import React from 'react'

const Pricing = () => {
  return (
    <div className='px-10 md:px-24 lg:px-48'>
        <h2 className='font-bold text-3xl mb-10'>Join Our Plan</h2>
        <PricingTable/>
    </div>
  )
}

export default Pricing