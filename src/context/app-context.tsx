"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface EnrolledUser {
  id: string;
  name: string;
  imageSrc: string;
}

export interface AttendanceRecord {
  userId: string;
  name: string;
  checkInTime: string;
}

interface AppContextType {
  enrolledUsers: EnrolledUser[];
  attendanceLog: AttendanceRecord[];
  enrollUser: (name: string, imageSrc: string) => void;
  removeUser: (userId: string) => void;
  markAttendance: (userId: string) => string | null;
  isReady: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [enrolledUsers, setEnrolledUsers] = useState<EnrolledUser[]>([]);
  const [attendanceLog, setAttendanceLog] = useState<AttendanceRecord[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('facecheck-users');
      const storedLog = localStorage.getItem('facecheck-log');
      
      const today = new Date().toDateString();
      const todaysLog = storedLog ? (JSON.parse(storedLog) as AttendanceRecord[]).filter(r => new Date(r.checkInTime).toDateString() === today) : [];

      if (storedUsers) {
        setEnrolledUsers(JSON.parse(storedUsers));
      }
      setAttendanceLog(todaysLog);
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      localStorage.setItem('facecheck-users', JSON.stringify(enrolledUsers));
    }
  }, [enrolledUsers, isReady]);
  
  useEffect(() => {
    if (isReady) {
      localStorage.setItem('facecheck-log', JSON.stringify(attendanceLog));
    }
  }, [attendanceLog, isReady]);

  const enrollUser = (name: string, imageSrc: string) => {
    const newUser: EnrolledUser = {
      id: new Date().toISOString() + name,
      name,
      imageSrc,
    };
    setEnrolledUsers(prev => [...prev, newUser]);
  };

  const removeUser = (userId: string) => {
    setEnrolledUsers(prev => prev.filter(user => user.id !== userId));
  };

  const markAttendance = (userId: string): string | null => {
    const user = enrolledUsers.find(u => u.id === userId);
    if (!user) {
      return "User not found.";
    }

    const today = new Date().toDateString();
    const alreadyCheckedIn = attendanceLog.some(
      record => record.userId === userId && new Date(record.checkInTime).toDateString() === today
    );

    if (alreadyCheckedIn) {
      return `${user.name} has already checked in today.`;
    }

    const newRecord: AttendanceRecord = {
      userId: user.id,
      name: user.name,
      checkInTime: new Date().toISOString(),
    };
    setAttendanceLog(prev => [newRecord, ...prev]);
    return null;
  };

  return (
    <AppContext.Provider value={{ enrolledUsers, attendanceLog, enrollUser, removeUser, markAttendance, isReady }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
