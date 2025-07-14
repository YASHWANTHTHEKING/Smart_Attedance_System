"use client";

import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WebcamFeed, WebcamFeedRef } from '@/components/webcam-feed';
import Image from 'next/image';
import { UserPlus, Camera, Trash2 } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function EnrollPage() {
  const webcamRef = useRef<WebcamFeedRef>(null);
  const [name, setName] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { enrollUser, isReady } = useAppContext();
  const { toast } = useToast();

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.capture();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      toast({ title: 'Success', description: 'Image captured successfully.' });
    } else {
      toast({ variant: 'destructive', title: 'Capture Failed', description: 'Could not capture image. Is the camera on?' });
    }
  };
  
  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a name.' });
      return;
    }
    if (!capturedImage) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please capture an image.' });
      return;
    }

    enrollUser(name.trim(), capturedImage);
    toast({ title: 'Enrolled!', description: `${name.trim()} has been successfully enrolled.` });
    setName('');
    setCapturedImage(null);
  };
  
  if (!isReady) {
    return (
       <main className="container py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <Skeleton className="h-9 w-1/2 mb-2"/>
            <Skeleton className="h-5 w-3/4"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-[450px] w-full" />
            <Skeleton className="h-[450px] w-full" />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Enroll New User</h1>
          <p className="text-muted-foreground">Capture a facial image and assign a name for enrollment.</p>
        </div>
        
        <form onSubmit={handleEnroll}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                  <CardHeader>
                      <CardTitle>1. Live Feed</CardTitle>
                      <CardDescription>Position face in the center and capture.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <WebcamFeed ref={webcamRef} />
                  </CardContent>
                  <CardFooter>
                        <Button type="button" onClick={handleCapture} className="w-full">
                          <Camera className="mr-2 h-4 w-4" />
                          Capture Image
                      </Button>
                  </CardFooter>
              </Card>

              <Card>
                  <CardHeader>
                      <CardTitle>2. Enroll User</CardTitle>
                      <CardDescription>Review the capture and provide a name.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden relative" data-ai-hint="person face">
                          {capturedImage ? (
                              <>
                                  <Image src={capturedImage} alt="Captured image" layout="fill" objectFit="cover" />
                                  <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 z-10" onClick={() => setCapturedImage(null)}>
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete Image</span>
                                  </Button>
                              </>
                          ) : (
                              <p className="text-sm text-muted-foreground">Image will appear here</p>
                          )}
                      </div>
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" type="text" placeholder="e.g. Jane Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                      </div>
                  </CardContent>
                  <CardFooter>
                      <Button type="submit" className="w-full" disabled={!capturedImage || !name.trim()}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Enroll User
                      </Button>
                  </CardFooter>
              </Card>
          </div>
        </form>
      </div>
    </main>
  );
}
