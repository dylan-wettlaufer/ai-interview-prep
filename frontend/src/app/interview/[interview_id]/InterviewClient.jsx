"use client";
import DashboardHeader from "../../dashboard/components/DashboardHeader";
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
                console.error('Response status:', response.status);
                console.error('Response headers:', response.headers);
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setInterview(data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };
    
    if (interview_id) {  // Only fetch if interview_id exists
        fetchInterview();
    }
}, [interview_id]);  // Add interview_id to dependencies

    return (
        <div className="flex flex-col min-h-screen bg-neutral-900 text-white font-inter">
            <DashboardHeader />
            <div className="flex-1 relative overflow-y-auto">
                <h1 className="text-center text-2xl font-bold text-gray-100 pt-12">Welcome to Your Mock Interview</h1>
                <p className="text-center text-gray-400">Job Type: {interview?.job_type}</p>
            </div>  
        </div>
    );
}