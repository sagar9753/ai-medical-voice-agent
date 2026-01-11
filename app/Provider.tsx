"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Loader } from "lucide-react";

function Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const {has} = useAuth()

  const [userDetail, setUserDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isProUser = isLoaded && has && has({ plan: 'pro' })

  useEffect(() => {
    if (!isLoaded) return;

    fetchOrCreateUser();
  }, [isLoaded, user?.id,isProUser]);

  const fetchOrCreateUser = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/users");
      setUserDetail(res.data);
    } catch (error) {
      console.error("Failed to fetch user detail", error);
    } finally {
      setLoading(false);
    }
  };

  // ⏳ Wait for Clerk + backend user
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
}

export default Provider;
