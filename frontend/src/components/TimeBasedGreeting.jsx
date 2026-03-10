'use client';

import { useState, useEffect } from 'react';

export default function TimeBasedGreeting() {
  const [greeting, setGreeting] = useState('');
  const [subGreeting, setSubGreeting] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      
      let newGreeting = '';
      let newSubGreeting = '';
      
      if (hour >= 5 && hour < 12) {
        // Morning: 5:00 AM - 11:59 AM
        newGreeting = 'Good morning, Dylan!';
        newSubGreeting = 'Start your day with some interview preparation and track your progress.';
      } else if (hour >= 12 && hour < 17) {
        // Afternoon: 12:00 PM - 4:59 PM
        newGreeting = 'Good afternoon, Dylan!';
        newSubGreeting = 'Continue your interview preparation and review your performance.';
      } else if (hour >= 17 && hour < 21) {
        // Evening: 5:00 PM - 8:59 PM
        newGreeting = 'Good evening, Dylan!';
        newSubGreeting = 'Perfect time to practice your interview skills and track your progress.';
      } else {
        // Night: 9:00 PM - 4:59 AM
        newGreeting = 'Good night, Dylan!';
        newSubGreeting = 'Late night practice session? Track your interview preparation progress.';
      }
      
      setGreeting(newGreeting);
      setSubGreeting(newSubGreeting);
    };

    // Update greeting immediately
    updateGreeting();
    
    // Update greeting every minute to handle time changes
    const interval = setInterval(updateGreeting, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-blue-950 mb-2">
        {greeting}
      </h1>
      <p className="text-slate-600">
        {subGreeting}
      </p>
    </div>
  );
}
