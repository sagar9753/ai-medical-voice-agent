import { createContext } from "react";

export type UserDetail = {
    name:string,
    email: string,
    credits: number
}
export type UserDetailContextType = {
    userDetail: UserDetail | null;
    setUserDetail: React.Dispatch<React.SetStateAction<UserDetail | null>>;
  };

export const UserDetailContext = createContext<UserDetailContextType | null>(null);