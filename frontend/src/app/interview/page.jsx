"use client";
import React, { useState } from 'react';
import { ChevronLeft, Zap, Mic, ChevronRight } from 'lucide-react';
import DashboardHeader from "../dashboard/components/DashboardHeader";

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
    ];

    const interviewTypes = [
        { id: 'general', label: 'General Interview', description: 'Get familliar with answering basic interview questions.' },
        { id: 'behavioral', label: 'Behavioral Interview', description: 'Questions about your past experiences and soft skills.' },
        { id: 'technical', label: 'Technical Interview', description: 'Problem-solving and coding questions.' },
        { id: 'case_study', label: 'Case Study Interview', description: 'Solve a business problem or scenario.' },
    ];

    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedInterviewType, setSelectedInterviewType] = useState(null);
    const [step, setStep] = useState(1); // 1: Job Type, 2: Interview Type

    const handleJobSelect = (jobType) => {
        setSelectedJob(jobType);
        setStep(2); // Move to the next step
    };

    const handleBack = () => {
        setStep(1); // Go back to the previous step
        setSelectedJob(null);
        setSelectedInterviewType(null);
    };

    const handleInterviewTypeSelect = (interviewType) => {
        setSelectedInterviewType(interviewType);
    };

    const handleContinue = () => {
        if (selectedJob && selectedInterviewType) {
            console.log(`User selected: Job: ${selectedJob}, Interview Type: ${selectedInterviewType}`);
            // TODO: Implement the final action, such as navigating to the interview session.
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-neutral-900 text-white font-inter">
            <DashboardHeader />
            <div className="flex-1 relative overflow-y-auto">
                {/* Step 1: Job Type Selection Screen - Fade transition logic */}
                <div 
                    className={`absolute inset-0 transition-opacity duration-900 ease-in-out ${step === 1 ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <div className="flex flex-col gap-8 justify-start items-center h-full p-6 md:p-8">
                        <h1 className="pt-12 text-3xl font-bold text-gray-100 text-center">Select a Job Type</h1>
                        <p className="text-lg text-gray-400 max-w-3xl mx-auto text-center">
                            Our AI will tailor the questions and feedback based on the selected role.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
                            {jobTypes.map((jobType) => (
                                <button 
                                    onClick={() => handleJobSelect(jobType)} 
                                    className={`
                                        cursor-pointer border border-indigo-500 bg-indigo-300/20 hover:bg-indigo-500/20 text-white font-semibold py-2 px-4 text-sm rounded-full shadow-lg
                                        ${selectedJob === jobType ? 'border-2' : ''}
                                    `}
                                    key={jobType}
                                >
                                    {jobType}
                                </button>
                            ))}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-100 text-center">OR</h3>
                        <h1 className="text-2xl font-bold text-gray-100 text-center">Create a custom interview using a job description</h1>
                        <textarea 
                            placeholder="Enter job description here or describe the key responsibilities, skills, and qualifications of the job" 
                            className="w-full md:w-3/4 max-w-xl h-80 md:h-60 border bg-neutral-800 border-violet-400/20 rounded-lg p-4 mt-4 mb-4 mx-auto resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Step 2: Interview Type Selection Screen - Fade transition logic */}
                <div 
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${step === 2 ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <div className="flex flex-col gap-8 justify-start items-center h-full p-6 md:p-8">
                        <div className="flex w-full justify-between items-center max-w-3xl">
                            <button onClick={handleBack} className="cursor-pointer flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                                <ChevronLeft size={20} />
                                Back
                            </button>
                            <h1 className="sm:mt-6 pt-12 text-3xl font-bold text-gray-100 text-center flex-grow">Select Interview Type</h1>
                            <div className="w-16"></div> {/* Spacer */}
                        </div>

                        <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto text-center">
                            Our AI will tailor the questions and feedback based on the **{selectedJob}** role.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
                            {interviewTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleInterviewTypeSelect(type.id)}
                                    className={`
                                        flex flex-col items-start text-left p-6 rounded-2xl border-2
                                        transition-all duration-200
                                        transform hover:-translate-y-1 cursor-pointer
                                        ${
                                            selectedInterviewType === type.id
                                            ? 'bg-indigo-600/20 border-indigo-500 shadow-lg'
                                            : 'bg-neutral-800 border-transparent hover:bg-neutral-700/50'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-gray-700 p-2 rounded-full text-gray-400">
                                            <Zap size={20} />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-50">{type.label}</h2>
                                    </div>
                                    <p className="text-gray-400 text-sm">{type.description}</p>
                                </button>
                            ))}
                        </div>

                        <div className="mt-10 max-w-3xl w-full">
                            <button
                                onClick={handleContinue}
                                disabled={!selectedInterviewType}
                                className={`
                                    w-full py-4 px-6 rounded-full font-bold text-lg
                                    transition-colors duration-200 mb-12
                                    ${
                                        selectedInterviewType
                                        ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-xl cursor-pointer'
                                        : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                                    }
                                `}
                            >
                                {selectedInterviewType ? 'Generate Questions and Start Interview' : 'Select an Interview Type'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
