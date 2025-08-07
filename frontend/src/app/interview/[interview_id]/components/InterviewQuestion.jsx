"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Mic, Type } from "lucide-react"
import { useState, useEffect } from "react"

export default function InterviewQuestion({ interview, question, question_number }) {
    const [isAnimating, setIsAnimating] = useState(true);
    const [interviewState, setInterviewState] = useState("question");
    const [textAnswer, setTextAnswer] = useState("")

    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    
    return (
        <div className="container h-screen w-screen mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Card className={`mb-8 bg-neutral-800 border border-neutral-600 transition-all duration-500 ease-out ${
                    isAnimating 
                    ? 'opacity-0 transform translate-y-8 scale-95' 
                    : 'opacity-100 transform translate-y-0 scale-100'
                    }`}>
                    <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className={`text-lg transition-all text-gray-100 duration-700 delay-200 ${
                        isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
                        }`}>
                        Question {question_number}
                        </CardTitle>
                        <Badge variant="outline" className={`bg-neutral-700 flex items-center space-x-1 transition-all duration-700 delay-300 text-gray-100 ${
                        isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
                        }`}>
                        <Clock className="h-4 w-4" />
                        <span>2:00</span>
                        </Badge>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <p className={`text-xl text-gray-100 leading-relaxed transition-all duration-700 delay-400 ${
                        isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                    }`}>
                        {question}
                    </p>
                    </CardContent>
                </Card>

                {interviewState === 'question' && (
                <Card className={`transition-all duration-500 delay-500 ease-out ${
                isAnimating 
                    ? 'opacity-0 transform translate-y-8' 
                    : 'opacity-100 transform translate-y-0'
                }`}>
                <CardContent className="pt-6">
                    <div className="text-center space-y-6">
                    <div className={`transition-all duration-700 delay-600 ${
                        isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                    }`}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose how you'd like to answer</h3>
                        <p className="text-gray-600">You can record your voice response or type your answer</p>
                    </div>
                    
                    <div className={`flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto transition-all duration-700 delay-700 ${
                        isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                    }`}>
                        <Button onClick={() => setInterviewState('recording')} className="flex-1 h-12 transform transition-all duration-200 hover:scale-105">
                        <Mic className="h-5 w-5 mr-2" />
                        Record Answer
                        </Button>
                        <Button onClick={() => setInterviewState('typing')} variant="outline" className="flex-1 h-12 bg-transparent transform transition-all duration-200 hover:scale-105">
                        <Type className="h-4 w-4 mr-2" />
                        Type Answer
                        </Button>
                    </div>
                    </div>
                </CardContent>
                </Card>
            )}

            {/* Typing State */}
            {interviewState === 'typing' && (
                <Card>
                <CardContent className="pt-4">
                    <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Type your answer</h3>
                        <p className="text-gray-600 mb-4">Write a detailed response to the question above</p>
                        <textarea
                        placeholder="Start typing your answer here..."
                        value={textAnswer}
                        onChange={(e) => setTextAnswer(e.target.value)}
                        className="min-h-[200px] text-base"
                        />
                    </div>
                    
                    <div className="flex gap-4">
                        <Button 
                        onClick={() => setInterviewState('question')} 
                        variant="outline"
                        className="bg-transparent"
                        >
                        Back
                        </Button>
                        <Button 
                        disabled={!textAnswer.trim()}
                        className="flex-1"
                        >
                        Submit Answer
                        </Button>
                    </div>
                    </div>
                </CardContent>
                </Card>
            )}

            </div>
            
        </div>
    );
}