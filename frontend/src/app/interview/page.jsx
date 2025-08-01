"use client";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import { useState } from "react";
import { ChevronLeft, Zap } from "lucide-react";

export default function InterviewPage() {

    const jobTypes = [
        "Software Engineer",
        "Data Scientist",
        "Product Manager",
        "UI/UX Designer",
        "Sales",
        "Marketing Specialist",
        "Customer Service Representative",
        "Business Analyst",
        "Cybersecurity",
        "Other"
    ]

    const interviewTypes = [
        { id: 'technical', label: 'Technical Interview', description: 'Problem-solving and coding questions.' },
        { id: 'behavioral', label: 'Behavioral Interview', description: 'Questions about your past experiences and soft skills.' },
        { id: 'case_study', label: 'Case Study Interview', description: 'Solve a business problem or scenario.' },
        { id: 'system_design', label: 'System Design Interview', description: 'Design a complex software system.' },
        { id: 'custom', label: 'Custom', description: 'Create your own mock interview from scratch.' },
    ];

    const [jobSelected, setJobSelected] = useState(null);
    const [jobTypeSelected, setJobTypeSelected] = useState(null);
    const [interviewTypeSelected, setInterviewTypeSelected] = useState(null);

    const handleJobSelect = (jobType) => {
        setJobSelected(true);
        setJobTypeSelected(jobType);
    };

    

    const handleInterviewTypeSelect = (interviewType) => {
        setInterviewTypeSelected(interviewType);
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white">
            <DashboardHeader />
            

                <div className="flex flex-col p-6 md:p-8 overflow-y-auto bg-neutral-900 h-screen w-screen gap-8">
                    <h1 className="pt-12 text-3xl font-bold text-gray-100 text-center font-sans">Select an Interview Type</h1>
                    
                    <div className='flex flex-wrap justify-center gap-4 max-w-3xl mx-auto'>
                        {jobTypes.map((jobType) => (
                            <button onClick={() => handleJobSelect(jobType)} className="border border-indigo-400 bg-indigo-200/20 hover:bg-indigo-400/20 text-white font-semibold py-2 px-4 text-sm rounded-full shadow-lg font-sans" key={jobType}>
                                {jobType}
                            </button>
                        ))}

                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-100 text-center font-sans">OR</h3>
                    <h1 className="text-2xl font-bold text-gray-100 text-center font-sans">Create a custom interview with a job description</h1>
                    <textarea placeholder="Enter job description here or describe the key responsibilities, skills, and qualifications of the job" 
                    className="w-full md:w-3/4 max-w-2xl h-60 border bg-neutral-800 border-violet-400/20 rounded-lg p-4 mt-4 mb-4 mx-auto">
                    </textarea>
                </div>
            
        </div>
    );
}