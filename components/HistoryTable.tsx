import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DoctorAgentDetails } from '@/app/dashboard/doctor-agent/[sessionId]/page'
import moment from 'moment'
import ViewReportDialog from './ViewReportDialog'
import { formatDate } from '@/lib/formateDate'

type Props = {
  historyList: DoctorAgentDetails[]
}

const HistoryTable = ({ historyList }: Props) => {
  if (!historyList?.length) {
    return (
      <p className="text-center text-sm text-muted-foreground py-6">
        No consultation history available
      </p>
    )
  }

  return (
    <div className="relative w-full overflow-x-auto">
        <h3 className="text-center mb-4 text-lg font-semibold">
            Consultation History
          </h3>
      <Table>
        <TableCaption className="mt-4">
          Previous Consultation Reports
        </TableCaption>

        <TableHeader>
          <TableRow className='bg-muted'>
            <TableHead className="min-w-[160px]">AI Specialist</TableHead>
            <TableHead className="min-w-[240px]">Description</TableHead>
            <TableHead className="min-w-[120px]">Date</TableHead>
            <TableHead className="min-w-[100px] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {historyList.map((record, ind) => (
            <TableRow key={ind} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                {record?.selectedDoctor?.specialist}
              </TableCell>

              <TableCell>
                <p className="max-w-[300px] truncate text-sm text-muted-foreground">
                  {record?.detail}
                </p>
              </TableCell>

              <TableCell className="text-sm">
                {formatDate(record.createdOn)}
              </TableCell>

              <TableCell className="text-right">
                <ViewReportDialog record={record} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default HistoryTable
