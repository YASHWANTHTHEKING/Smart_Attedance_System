"use client";

import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WebcamFeed, WebcamFeedRef } from '@/components/webcam-feed';
import { useAppContext } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';
import { SuccessAnimation } from '@/components/success-animation';
import { UserCheck, Frown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const webcamRef = useRef<WebcamFeedRef>(null);
  const { enrolledUsers, markAttendance, isReady } = useAppContext();
  const { toast } = useToast();
  const [recognitionResult, setRecognitionResult] = useState<{status: 'success' | 'fail', message: string} | null>(null);

  const handleAttendance = () => {
    setRecognitionResult(null);

    const imageSrc = webcamRef.current?.capture();
    if (!imageSrc) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not capture image from webcam.' });
      return;
    }
    
    if (enrolledUsers.length === 0) {
        toast({ variant: 'destructive', title: 'No Users Enrolled', description: 'Please enroll users before marking attendance.' });
        return;
    }
    
    toast({ title: 'Processing...', description: 'Recognizing face...' });

    setTimeout(() => {
        const randomUser = enrolledUsers[Math.floor(Math.random() * enrolledUsers.length)];
        const resultMessage = markAttendance(randomUser.id);
        
        if (resultMessage === null) {
            setRecognitionResult({ status: 'success', message: `Welcome, ${randomUser.name}!` });
            setTimeout(() => setRecognitionResult(null), 4000);
        } else {
            setRecognitionResult({ status: 'fail', message: resultMessage });
            setTimeout(() => setRecognitionResult(null), 4000);
        }

    }, 1500);
  };
  
  if (!isReady) {
    return (
       <main className="container py-8">
        <div className="mx-auto max-w-2xl">
           <div className="mb-6 text-center">
             <Skeleton className="h-9 w-3/4 mx-auto mb-2" />
             <Skeleton className="h-5 w-full mx-auto" />
           </div>
          <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-12 w-full" />
            </CardFooter>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="container py-8">
      <div className="mx-auto max-w-2xl">
          <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Attendance Kiosk</h1>
          <p className="text-muted-foreground">Look at the camera and click the button to mark your attendance.</p>
        </div>

        <Card>
          <CardHeader>
              <CardTitle>Live Camera Feed</CardTitle>
              <CardDescription>Your daily check-in starts here.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="relative overflow-hidden rounded-md">
                  <WebcamFeed ref={webcamRef} />
                  {recognitionResult && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-opacity duration-300">
                          {recognitionResult.status === 'success' ? (
                              <>
                                  <SuccessAnimation />
                                  <p className="mt-4 text-xl font-semibold">{recognitionResult.message}</p>
                              </>
                          ) : (
                              <>
                                  <Frown className="h-24 w-24 text-destructive" />
                                  <p className="mt-4 text-xl font-semibold text-center max-w-xs">{recognitionResult.message}</p>
                              </>
                          )}
                      </div>
                  )}
              </div>
          </CardContent>
          <CardFooter>
                <Button type="button" onClick={handleAttendance} className="w-full" size="lg" disabled={!!recognitionResult}>
                  <UserCheck className="mr-2 h-5 w-5" />
                  Mark My Attendance
              </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
