"use client";

import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { format } from 'date-fns';
import { History, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DailyLogPage() {
  const { attendanceLog, enrolledUsers, isReady } = useAppContext();

  const today = new Date().toDateString();

  const todaysLog = useMemo(() => {
    return attendanceLog
      .filter(record => new Date(record.checkInTime).toDateString() === today)
      .map(record => {
        const user = enrolledUsers.find(u => u.id === record.userId);
        return {
          ...record,
          imageSrc: user?.imageSrc,
        };
      })
      .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime());
  }, [attendanceLog, enrolledUsers, today]);

  if (!isReady) {
    return (
      <main className="container py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <Skeleton className="h-9 w-1/2 mb-2" />
            <Skeleton className="h-5 w-3/4" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Daily Attendance Log</h1>
          <p className="text-muted-foreground">A record of all check-ins for today, {format(new Date(), 'MMMM d, yyyy')}.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today's Check-ins</CardTitle>
            <CardDescription>{todaysLog.length} user(s) have checked in today.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Check-in Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todaysLog.length > 0 ? (
                    todaysLog.map(record => (
                      <TableRow key={record.userId}>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            {record.imageSrc ? (
                               <Image src={record.imageSrc} alt={record.name} width={40} height={40} className="rounded-full object-cover aspect-square" />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                    <Users className="h-5 w-5 text-muted-foreground"/>
                                </div>
                            )}
                            <span className="font-medium">{record.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {format(new Date(record.checkInTime), 'h:mm:ss a')}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="h-48 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <History className="h-12 w-12 mb-4" />
                            <p className="font-semibold">No check-ins recorded yet for today.</p>
                            <p className="text-sm">Use the Kiosk or Manual Check-in to mark attendance.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
