"use client";

import React, { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { VideoOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export interface WebcamFeedRef {
  capture: () => string | null;
  startStream: () => void;
  stopStream: () => void;
}

interface WebcamFeedProps {}

export const WebcamFeed = forwardRef<WebcamFeedRef, WebcamFeedProps>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const { toast } = useToast();

  const startStream = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsStreaming(true);
        }
      } else {
         toast({ variant: 'destructive', title: 'Error', description: 'Your browser does not support camera access.' });
      }
    } catch (err) {
      console.error(err);
      let message = 'Could not access the camera. Please check permissions.';
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') message = 'Camera access was denied. Please enable it in your browser settings.';
        else if (err.name === 'NotFoundError') message = 'No camera found on this device.';
      }
      toast({ variant: 'destructive', title: 'Camera Error', description: message });
      setIsStreaming(false);
    }
  }, [toast]);
  
  const stopStream = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    capture: () => {
      if (videoRef.current && canvasRef.current && isStreaming) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
          return canvas.toDataURL('image/jpeg');
        }
      }
      return null;
    },
    startStream,
    stopStream,
  }));

  useEffect(() => {
    startStream();
    return () => {
      stopStream();
    };
  }, [startStream, stopStream]);

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-video bg-muted flex items-center justify-center">
          <video ref={videoRef} className={cn('w-full h-full object-cover', { 'hidden': !isStreaming })} muted playsInline />
          <canvas ref={canvasRef} className="hidden" />
          {!isStreaming && (
            <div className="text-center text-muted-foreground p-4">
              <VideoOff className="mx-auto h-16 w-16" />
              <p className="mt-2">Camera is starting or not available.</p>
              <p className="text-xs mt-1">Please ensure you've granted camera permissions.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

WebcamFeed.displayName = "WebcamFeed";
