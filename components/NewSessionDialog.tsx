"use client"

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { ArrowRight, Loader2, Lock } from 'lucide-react'
import axios from 'axios'
import DoctorAgentCard, { doctorAgent } from './DoctorAgentCard'
import SuggestDoctorCard from './SuggestDoctorCard'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { useContext } from 'react'
import { UserDetailContext } from '@/context/UserDetailContext'
import Link from 'next/link'
import { toast } from 'sonner'

const NewSessionDialog = () => {
    const [detail, setDetail] = useState<string>();
    const [loading, setLoading] = useState(false)
    const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>();
    const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();

    const router = useRouter()
    const context = useContext(UserDetailContext)
    const userDetail = context?.userDetail
    // console.log("context", context);


    const { has } = useAuth()
    // @ts-ignore
    const isProUser = has && has({ plan: 'pro' })


    // const getCredits = async()=>{
    //     const res = await axios.get('/api/users');
    //     console.log("Get credits", res);
    // }
    // getCredits();
    const onClickNext = async () => {
        setLoading(true)
        try {
            const res = await axios.post('/api/suggest-doctors', {
                detail: detail
            })
    
            // console.log("IN Dialog", res.data);
            setSuggestedDoctors(res.data)
        } catch (error:any) {
            toast.error(
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong"
              );
        }finally{
            setLoading(false)
        }
    }

    const onStartConsultation = async () => {
        // save info to db
        setLoading(true)
        try {
            const res = await axios.post('/api/session-chat', {
                detail: detail,
                selectedDoctor: selectedDoctor
            })
            // console.log("Consult ", res);
            if (res.data?.sessionId) {
                router.push('/dashboard/doctor-agent/' + res.data?.sessionId)
            }
        } catch (error:any) {
            toast.error(
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong"
              );
        }finally{
            setLoading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button>+ Consult with Doctor</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {(userDetail?.credits! > 0 || isProUser) && <div>
                            {!suggestedDoctors ? "Add Symptoms or Any Other detail" : "Select the doctor"}
                        </div>}
                    </DialogTitle>
                    <DialogDescription className='mt-3' >
                        {(userDetail?.credits! > 0 || isProUser) ?
                            <div>
                                {!suggestedDoctors ? <div>
                                    {/* <h2>Add Symptoms or Any Other detail</h2> */}
                                    <Textarea className='h-[150px] mt-1' placeholder='Add detail...'
                                        onChange={(e) => setDetail(e.target.value)}
                                    />
                                </div> : <div>
                                    {/* <h1>Select the doctor</h1> */}
                                    <div className='grid grid-cols-3 gap-5'>
                                        {/*suggested doctors  */}
                                        {suggestedDoctors.map((doctor, ind) => (
                                            <SuggestDoctorCard doctorAgent={doctor} selectedDoctor={selectedDoctor} setSelectedDoctor={setSelectedDoctor} />
                                        ))}
                                    </div>
                                </div>}
                            </div> :
                            <div className="flex flex-col items-center gap-4 text-center">
                    
                              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                <Lock className="h-6 w-6 text-muted-foreground" />
                              </div>
                    
                              <h2 className="text-lg font-semibold">
                                Free Limit Reached
                              </h2>
                    
                              <p className="text-sm text-muted-foreground">
                                You’ve exceeded your free consultation limit.
                                Upgrade your plan to continue talking with AI doctors.
                              </p>
                    
                              <Link href="/dashboard/pricing" className="w-full">
                                <Button className="w-full mt-2">
                                  View Pricing Plans
                                </Button>
                              </Link>
                    
                            </div>
                        }
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    {(userDetail?.credits! > 0 || isProUser) &&
                        <div>
                            {!suggestedDoctors ?
                                <Button disabled={!detail || loading} onClick={() => onClickNext()}>
                                    Next {loading ? <Loader2 className='animate-spin' /> : <ArrowRight />}
                                </Button> :
                                <Button disabled={!selectedDoctor || loading} onClick={() => onStartConsultation()}>
                                    Start Consultation {loading ? <Loader2 className='animate-spin' /> : <ArrowRight />}
                                </Button>
                            }
                        </div>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default NewSessionDialog