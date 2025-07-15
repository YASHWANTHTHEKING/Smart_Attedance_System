"use client";

import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Users, UserCheck, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function ManualCheckinPage() {
  const { enrolledUsers, attendanceLog, markAttendance, clearAttendanceLog, isReady } = useAppContext();
  const { toast } = useToast();

  const today = new Date().toDateString();
  const checkedInUserIds = useMemo(() => 
    new Set(
      attendanceLog
        .filter(record => new Date(record.checkInTime).toDateString() === today)
        .map(record => record.userId)
    ), [attendanceLog, today]);

  const handleManualCheckIn = (userId: string) => {
    const resultMessage = markAttendance(userId);
    if (resultMessage === null) {
      const user = enrolledUsers.find(u => u.id === userId);
      toast({
        title: 'Success',
        description: `${user?.name || 'User'} has been checked in.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Already Checked In',
        description: resultMessage,
      });
    }
  };

  const handleClearLog = () => {
    clearAttendanceLog();
    toast({
        title: 'Attendance Log Cleared',
        description: 'The attendance log for today has been cleared.',
    });
  };

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
               <Skeleton className="h-64 w-full" />
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
          <h1 className="text-3xl font-bold tracking-tight">Manual Check-in</h1>
          <p className="text-muted-foreground">Manually mark attendance for enrolled users.</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Enrolled Users List</CardTitle>
                <CardDescription>Click the button next to a user's name to check them in for today.</CardDescription>
              </div>
               <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={attendanceLog.length === 0}>
                    <Trash2 className="mr-2 h-4 w-4" /> Clear Today's Log
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently clear today's attendance log.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearLog} className="bg-destructive hover:bg-destructive/90">
                      Yes, clear log
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrolledUsers.length > 0 ? (
                    enrolledUsers.map(user => {
                      const isCheckedIn = checkedInUserIds.has(user.id);
                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <Image src={user.imageSrc} alt={user.name} width={40} height={40} className="rounded-full object-cover aspect-square" />
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {isCheckedIn ? (
                              <Badge variant="secondary">Checked In</Badge>
                            ) : (
                              <Badge variant="outline">Not Checked In</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => handleManualCheckIn(user.id)}
                              disabled={isCheckedIn}
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Check In
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        <Users className="mx-auto h-8 w-8 text-muted-foreground mb-2"/>
                        No users are enrolled in the system yet.
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
