"use client";

import { UsersRound, MessageCircleQuestionMark, Play, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


export default function InterviewStartScreen({ interview, onStart, onReturn }) {

    return (

            <div className="max-w-7xl min-h-screen overflow-y-auto mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                <div className="flex flex-col gap-8">
                    <div className="flex-1 text-center">
                        <h1 className="text-3xl font-bold text-blue-950 pt-4">Welcome to Your Mock Interview</h1>
                        <p className="pt-2 text-lg text-slate-600">Take a moment to prepare yourself for success</p>
                    </div>
                    <div className="flex flex-col gap-4 bg-white rounded-lg p-6 shadow-md border border-slate-200 transform hover:-translate-y-1 transition-transform duration-200">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center text-center justify-center h-14 w-14 rounded-full bg-blue-50 text-blue-950">
                                <UsersRound size={28} />
                            </div>
                            <h1 className="text-blue-950 text-center text-3xl font-bold pb-2">{interview.job_type} Interview</h1>
                            <div className="flex flex-row items-start justify-between gap-6 mb-4">
                                <Badge className="text-blue-950 bg-blue-100 border-blue-200 w-32 h-6 justify-center" variant="outline">
                                    <MessageCircleQuestionMark size={20} /> 3 Questions
                                </Badge>
                                <Badge className="text-blue-950 bg-blue-100 border-blue-200 w-32 h-6 justify-center" variant="outline">{interview.interview_type} Format</Badge>
                                <Badge className="text-blue-950 bg-blue-100 border-blue-200 w-32 h-6 justify-center" variant="outline">{interview.interview_source} Interview</Badge>
                            </div>
                        </div>

                        <Separator className="bg-slate-200"/>

                        <div className="flex flex-col justify-start items-start gap-2 text-left mt-4">
                            <h1 className="text-blue-950 text-left text-xl font-bold pb-2">How It Works:</h1>
                            <ul className="space-y-1">
                                <li className="text-slate-600">Answer one question at a time.</li>
                                <li className="text-slate-600">You can respond via text or voice.</li>
                                <li className="text-slate-600">Your responses will be saved and can be reviewed after.</li>
                                <li className="text-slate-600">You can stop the interview at any time and return when you're ready to continue.</li>
                            </ul>

                        </div>
                        <Separator className="bg-slate-200"/>

                        <div className="flex flex-col justify-start items-start gap-2 mt-2 w-full"> {/* Added w-full to ensure this section takes full available width */}
                            <h1 className="text-blue-950 text-left text-xl font-bold mb-4">Ready to Start?</h1>
                            <div className="flex flex-row gap-6 w-full"> {/* Added w-full to make the row of buttons span full width */}
                                <button onClick={onStart} className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-blue-950 hover:bg-blue-900 cursor-pointer rounded-lg transition-colors flex-1">
                                    <Play size={16} /> Start Interview
                                </button>
                                <button onClick={onReturn} className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-600 bg-transparent hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex-1 cursor-pointer">
                                    <ArrowLeft size={16} /> Return to Dashboard
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>  
        
    );
}