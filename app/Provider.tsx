"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/UserDetailContext';

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [userDetail, setUserDetail] = useState<any>({});
  const { user } = useUser()

  useEffect(() => {
    user && CreateNewUser()
  }, [user])
  
  const CreateNewUser = async () => {
    const res = await axios.post('/api/users')
    setUserDetail(res?.data)
  }


  return (
    <div>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        {children}
      </UserDetailContext.Provider>
    </div>
  )
}

export default Provider; 