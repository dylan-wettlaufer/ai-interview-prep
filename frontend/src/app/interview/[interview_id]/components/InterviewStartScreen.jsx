"use client";

import { UsersRound, MessageCircleQuestionMark, Play, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


export default function InterviewStartScreen({ interview }) {

    return (

            <div className="max-w-7xl w-screen h-screen overflow-y-auto mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                <div className="flex flex-col gap-8">
                    <div className="flex-1">
                        <h1 className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 text-transparent bg-clip-text text-center text-3xl font-bold pt-4">Welcome to Your Mock Interview</h1>
                        <p className="pt-2 text-lg text-center text-gray-400">Take a moment to prepare yourself for success</p>
                    </div>
                    <div className="flex flex-col gap-4 bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-lg p-6 shadow-lg border border-neutral-700 transform hover:-translate-y-1 transition-transform duration-200">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center text-center justify-center h-14 w-14 rounded-full bg-neutral-800">
                                <UsersRound size={28} />
                            </div>
                            <h1 className="text-gray-100 text-center text-3xl font-bold pb-2">{interview.job_type} Interview</h1>
                            <div className="flex flex-row items-start justify-between gap-6 mb-4">
                                <Badge className="text-gray-100 bg-neutral-500/20 border-neutral-500 w-32 h-6" variant="default">
                                    <MessageCircleQuestionMark size={20} /> 5 Questions
                                </Badge>
                                <Badge className="text-gray-100 bg-neutral-500/20 border-neutral-500 w-32 h-6" variant="default">{interview.interview_type} Format</Badge>
                                <Badge className="text-gray-100 bg-neutral-500/20 border-neutral-500 w-32 h-6" variant="default">{interview.interview_source} Interview</Badge>
                            </div>
                        </div>

                        <Separator className="bg-neutral-700"/>

                        <div className="flex flex-col justify-start items-start gap-2 text-left mt-4">
                            <h1 className="text-gray-100 text-left text-xl font-bold pb-2">How It Works:</h1>
                            <ul>
                                <li className="text-gray-400">Answer one question at a time.</li>
                                <li className="text-gray-400">You can respond via text or voice.</li>
                                <li className="text-gray-400">Your responses will be saved and can be reviewed after.</li>
                                <li className="text-gray-400">You can stop the interview at any time and return when you're ready to continue.</li>
                            </ul>

                        </div>
                        <Separator className="bg-neutral-700"/>

                        <div className="flex flex-col justify-start items-start gap-2 mt-2 w-full"> {/* Added w-full to ensure this section takes full available width */}
                            <h1 className="text-gray-100 text-left text-xl font-bold mb-4">Ready to Start?</h1>
                            <div className="flex flex-row gap-6 w-full"> {/* Added w-full to make the row of buttons span full width */}
                                <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 cursor-pointer rounded-lg transition-colors flex-1">
                                    <Play size={16} /> Start Interview
                                </button>
                                <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 rounded-lg transition-colors flex-1 cursor-pointer">
                                    <ArrowLeft size={16} /> Return to Dashboard
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>  
        
    );
}