"use client";
import DashboardHeader from "../../dashboard/components/DashboardHeader";
import InterviewStartScreen from "./components/InterviewStartScreen";
import InterviewStartScreenSkeleton from "./components/InterviewStartScreenSkeleton";
import {useState, useEffect} from "react";


export default function InterviewClient({ interview_id }) {

    const [interview, setInterview] = useState(null);

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const response = await fetch(`http://localhost:8000/gen-ai/interview/${interview_id}`, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',  
                },
                credentials: 'include',
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(data);
            setInterview(data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };
    
    if (interview_id) {  // Only fetch if interview_id exists
        fetchInterview();
    }
}, [interview_id]);


    return (
        <div className=" bg-neutral-900 text-white font-inter">
            <DashboardHeader />

            {interview ? (
                <InterviewStartScreen interview={interview} />
            ) : (
                <InterviewStartScreenSkeleton />
            )}
        </div>
    );
}