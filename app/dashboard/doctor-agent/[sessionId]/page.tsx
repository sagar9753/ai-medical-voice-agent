"use client"
import { doctorAgent } from '@/components/DoctorAgentCard';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Circle, Loader, Lock, PhoneCallIcon, PhoneOffIcon } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Vapi from '@vapi-ai/web';
import { toast } from 'sonner';
import { UserDetailContext } from '@/context/UserDetailContext';
import { UserDetail } from '@/context/UserDetailContext';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';


export type DoctorAgentDetails = {
  id: number,
  detail: string,
  sessionId: string,
  report: JSON,
  selectedDoctor: doctorAgent,
  createdOn: string,
}

type messages = {
  role: string,
  text: string
}

const page = () => {
  const { sessionId } = useParams();
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [doctorAgentDetails, setDoctorAgentDetails] = useState<DoctorAgentDetails>();
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currentRole, setCurrentRole] = useState<string | null>();
  const [liveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<messages[]>([]);
  const router = useRouter()

  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  // @ts-ignore
  const { userDetail, setUserDetail } = useContext(UserDetailContext)

  const { has, isLoaded } = useAuth()
  // @ts-ignore
  const isProUser = isLoaded && has({ plan: 'pro' })


  useEffect(() => {
    sessionId && ((userDetail?.credits! > 0 || isProUser)) && getDoctorAgentDetails()
  }, [sessionId, isProUser, userDetail])

  const startTimer = () => {
    if (timerRef.current)
      return;
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000)
  }
  const endTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null;
    }
  }

  const getCorrectTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60

    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const getDoctorAgentDetails = async () => {
    try {
      const res = await axios.get('/api/session-chat?sessionId=' + sessionId)
      // console.log("Get doctor detal", res);
      setDoctorAgentDetails(res.data)
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong while gettin session detail"
      );
    }
  }
  const startCall = () => {
    setConnecting(true)
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi)

    const VapiAgentConfig = {
      name: 'AI Medical Voice Agent',
      firstMessage: "Hello Thank you for connecting, can you tell me your name",
      transcriber: {
        provider: 'assembly-ai',
        language: 'en'
      },
      voice: {
        provider: 'vapi',
        voiceId: doctorAgentDetails?.selectedDoctor?.voiceId
      },
      model: {
        provider: 'google',
        model: 'gemini-2.0-flash',
        messages: [
          {
            role: 'system',
            content: doctorAgentDetails?.selectedDoctor?.agentPrompt
          }
        ]
      }
    }

    // Start voice conversation
    // @ts-ignore
    vapi.start(VapiAgentConfig);

    // Listen for events
    vapi.on('call-start', () => {
      console.log('Call started')
      setCallStarted(true)
      startTimer();
    });
    vapi.on('call-end', () => {
      console.log('Call ended')
      toast.info("call ended")
      setCallStarted(false)
      setConnecting(false)
      endTimer()
    });
    vapi.on('message', (message) => {
      if (message.type === 'transcript') {
        const { role, transcriptType, transcript } = message
        // console.log(`${message.role}: ${message.transcript}`);
        if (transcriptType == 'partial') {
          setLiveTranscript(transcript)
          setCurrentRole(role)
        }
        else if (transcriptType == 'final') {
          // final transcript
          setMessages((prev: any) => [...prev, { role: role, text: transcript }])
          setLiveTranscript("")
          setCurrentRole(null)
        }
      }
    });
    vapi.on('error', (error: any) => {
      // console.error('Vapi error:', error);
      toast.error(error)

      // setCallStarted(false);
      // setConnecting(false);
    });

    vapiInstance.on('speech-start', () => {
      console.log('Assistant started speaking');
      setCurrentRole('assistant');
    });
    vapiInstance.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setCurrentRole('user');
    });

    setConnecting(false);
  }

  const endCall = async () => {
    if (!vapiInstance) {
      toast.warning("No active call found")
    }
    setDisconnecting(true)
    // report

    try {
      const res = await generateReport();


      // stop the call
      vapiInstance.stop();

      // Optionally removve listeners (good for memory management)
      // vapiInstance.off('call-start')
      // vapiInstance.off('call-end')
      // vapiInstance.off('message')
      // vapiInstance.off('speech-start')
      // vapiInstance.off('speech-end')

      // reset call state
      setCallStarted(false)
      setVapiInstance(null)

      toast.success("Your Report is generated")
      router.replace('/dashboard')
    } catch (error: any) {
      // console.error("End call error:", error);

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to end call properly"
      );
    } finally {
      setDisconnecting(false);
    }
  };

  const generateReport = async () => {
    try {
      const res = await axios.post('/api/generate-report', {
        messages: messages,
        doctorAgentDetails: doctorAgentDetails,
        sessionId: sessionId,
        time: getCorrectTime(seconds)
      })

      if (res.status == 200) {
        setUserDetail((prev: UserDetail) =>
          prev
            ? { ...prev, credits: prev.credits - 1 }
            : prev
        );
      }

      // console.log("Generated Report", res)
      return res.data
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong while generating report"
      );
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!(userDetail?.credits! > 0 || isProUser)) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border bg-background p-6 sm:p-8 shadow-sm">
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
      </div>
    )
  }

  return (
    <div className="rounded-2xl border bg-background p-4 sm:p-6 space-y-3 sm:space-y-6 ">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-md border px-3 py-1 text-sm">
          <Circle
            className={`h-3 w-3 ${callStarted
              ? 'text-green-500 fill-green-500'
              : 'text-red-500 fill-red-500'
              }`}
          />
          <span className="text-muted-foreground">
            {callStarted ? 'Connected' : 'Not Connected'}
          </span>
        </div>

        <span className="text-sm font-medium text-muted-foreground">
          {getCorrectTime(seconds)}
        </span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">

        {/* LEFT — Doctor Info */}
        <div className='flex items-center justify-center'>
          {doctorAgentDetails && (
            <div className="flex flex-col items-center text-center p-4">
              <Image
                src={doctorAgentDetails.selectedDoctor.image}
                alt={doctorAgentDetails.selectedDoctor.specialist}
                width={100}
                height={100}
                className="rounded-full object-cover border"
              />

              <h2 className="mt-1 sm:mt-3 text-lg font-semibold">
                {doctorAgentDetails.selectedDoctor.specialist}
              </h2>

              <p className="text-sm text-muted-foreground">
                AI Medical Voice Agent
              </p>
            </div>
          )}
        </div>

        {/* RIGHT — Transcript */}
        <div className="rounded-xl border bg-muted/40 p-4 h-[230px] md:h-[320px] overflow-y-auto space-y-2">
          {messages.slice(-4).map((msg, ind) => (
            <p
              key={ind}
              className={`text-sm ${msg.role === 'assistant'
                ? 'text-blue-600'
                : 'text-muted-foreground'
                }`}
            >
              <span className="font-medium capitalize">{msg.role}:</span>{' '}
              {msg.text}
            </p>
          ))}

          {liveTranscript && (
            <p className="text-sm font-medium text-foreground">
              <span className="capitalize">{currentRole}:</span>{' '}
              {liveTranscript}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center pt-4">
        {!callStarted ? (
          <Button
            size="lg"
            disabled={connecting}
            onClick={startCall}
            className="gap-2"
          >
            {connecting ? <Loader className="animate-spin" /> : <PhoneCallIcon />}
            Start Call
          </Button>
        ) : (
          <Button
            size="lg"
            disabled={disconnecting}
            variant="destructive"
            onClick={endCall}
            className="gap-2"
          >
            {disconnecting ? <Loader className="animate-spin" /> : <PhoneOffIcon />}
            Disconnect
          </Button>
        )}
      </div>
    </div>
  )


}

export default page