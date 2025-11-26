import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { isSessionValid, endSession, getRemainingMs, getRole } from '../lib/session';
import { useToast } from '../hooks/use-toast';

// Component to automatically logout user when session expires
const SessionWatcher = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const expiredRef = useRef(false);

  useEffect(() => {
    function check() {
      if (!isSessionValid() && !expiredRef.current && getRole()) {
        expiredRef.current = true;
        endSession();
        toast({
          title: 'Sesi berakhir',
          description: 'Silakan login kembali.',
          variant: 'destructive'
        });
        navigate('/login');
      }
    }
    // Initial check and schedule
    check();
    const interval = setInterval(check, 30000); // tiap 30 detik
    return () => clearInterval(interval);
  }, [navigate, toast]);

  useEffect(() => {
    // Optional: schedule precise timeout
    const remaining = getRemainingMs();
    if (remaining > 0) {
      const timeout = setTimeout(() => {
        if (isSessionValid()) return; // interval will handle
        endSession();
        navigate('/login');
      }, remaining + 1000);
      return () => clearTimeout(timeout);
    }
  }, [navigate]);

  return null;
};

export default SessionWatcher;
