import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import { DoctorAgentDetails } from '@/app/dashboard/doctor-agent/[sessionId]/page'
import moment from 'moment'
import { formatDate } from '@/lib/formateDate'

type props = {
    record: DoctorAgentDetails
}

type MedicalReport = {
    sessionId: string;
    agent: string;
    user: string;
    timestamp: string;
    chiefComplaint: string;
    summary: string;
    symptoms: string[];
    duration: string;
    severity: string;
    medicationsMentioned: string[];
    recommendations: string[];
}

const ViewReportDialog = ({ record }: props) => {
    const report = record.report as unknown as MedicalReport;

    return (
        <Dialog>
            <DialogTrigger>
                <Button className='text-blue-400' variant={'link'} size={'sm'}>View Report</Button>
            </DialogTrigger>

            {/* Responsive dialog layout */}
            <DialogContent className="max-h-[90vh] overflow-y-auto text-left px-4 sm:px-8">
                <DialogHeader>
                    <DialogTitle className="text-center text-3xl sm:text-4xl">
                        Report
                    </DialogTitle>

                    <DialogDescription className="text-left">
                        <div className="mt-8 space-y-8">

                            {/* Session Info */}
                            <section>
                                <h2 className="text-lg font-semibold mb-3 text-blue-700">Session Info</h2>

                                {/* Responsive grid: 1 column on mobile, 2 columns on sm+ */}
                                <div className="grid gap-y-3 text-sm">
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-3'>
                                    <p><span className="font-medium">Doctor :</span> {record?.selectedDoctor?.specialist}</p>
                                    <p><span className="font-medium">User :</span> Anonymous</p>
                                    </div>

                                    <p>
                                        <span className="font-medium">Consulted On :</span> {formatDate(record?.createdOn)}
                                    </p>

                                    <p>
                                        <span className="font-medium">Agent :</span> General Physician AI
                                    </p>
                                </div>
                            </section>

                            {/* Chief Complaint */}
                            <section>
                                <h2 className="text-lg font-semibold mb-3 text-blue-700">Chief Complaint</h2>
                                <p className="text-sm">{report?.chiefComplaint}</p>
                            </section>

                            {/* Summary */}
                            <section>
                                <h2 className="text-lg font-semibold mb-3 text-blue-700">Summary</h2>
                                <p className="text-sm leading-relaxed">
                                    {report?.summary}
                                </p>
                            </section>

                            {/* Symptoms */}
                            <section>
                                <h2 className="text-lg font-semibold mb-3 text-blue-700">Symptoms</h2>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    {report?.symptoms?.map((sym, ind) => (
                                        <li key={ind}>{sym}</li>
                                    ))}
                                </ul>
                            </section>

                            {/* Duration & Severity */}
                            <section>
                                <h2 className="text-lg font-semibold mb-3 text-blue-700">Duration & Severity</h2>

                                {/* Responsive grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
                                    <p><span className="font-medium">Duration:</span> {report?.duration}</p>
                                    <p><span className="font-medium">Severity:</span> {report?.severity}</p>
                                </div>
                            </section>

                            {/* Medications */}
                            <section>
                                <h2 className="text-lg font-semibold mb-3 text-blue-700">Medication Mentioned</h2>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    {report?.medicationsMentioned?.map((med, ind) => (
                                        <li key={ind}>{med}</li>
                                    ))}
                                </ul>
                            </section>

                            {/* Recommendations */}
                            <section>
                                <h2 className="text-lg font-semibold mb-3 text-blue-700">Recommendation</h2>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    {report?.recommendations?.map((rec, ind) => (
                                        <li key={ind}>{rec}</li>
                                    ))}
                                </ul>
                            </section>

                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default ViewReportDialog
