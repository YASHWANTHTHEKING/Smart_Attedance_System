"use client";

import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function LogPage() {
  const { attendanceLog, isReady } = useAppContext();

  const today = new Date().toDateString();
  const todaysLog = attendanceLog.filter(record => new Date(record.checkInTime).toDateString() === today);

  if (!isReady) {
    return (
       <main className="container py-8">
         <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <Skeleton className="h-9 w-1/2 mb-2"/>
            <Skeleton className="h-5 w-3/4"/>
           </div>
           <Card>
             <CardHeader>
               <Skeleton className="h-6 w-1/3 mb-2" />
               <Skeleton className="h-4 w-1/2" />
             </CardHeader>
             <CardContent>
              <Skeleton className="h-48 w-full" />
             </CardContent>
           </Card>
         </div>
       </main>
    )
  }

  return (
    <main className="container py-8">
       <div className="mx-auto max-w-4xl">
         <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Daily Attendance Log</h1>
            <p className="text-muted-foreground">Showing all check-ins for today, {format(new Date(), 'MMMM d, yyyy')}.</p>
          </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Today's Check-ins</CardTitle>
                <CardDescription>A total of {todaysLog.length} users have checked in today.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[60vh] border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">Status</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right">Check-in Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {todaysLog.length > 0 ? (
                                todaysLog.map(record => (
                                    <TableRow key={record.userId}>
                                        <TableCell><Badge variant="secondary">Checked In</Badge></TableCell>
                                        <TableCell className="font-medium">{record.name}</TableCell>
                                        <TableCell className="text-right">{format(new Date(record.checkInTime), 'h:mm:ss a')}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        <Users className="mx-auto h-8 w-8 text-muted-foreground mb-2"/>
                                        No check-ins recorded yet for today.
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
