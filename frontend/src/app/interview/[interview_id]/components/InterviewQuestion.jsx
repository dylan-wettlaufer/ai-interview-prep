"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Mic, Type, MicOff } from "lucide-react"
import { useState, useEffect, useRef } from "react"

// Define the maximum recording time in seconds
const MAX_RECORDING_TIME = 120; // 2 minutes

export default function InterviewQuestion({ interview, question, question_number }) {
    const [isAnimating, setIsAnimating] = useState(true);
    const [interviewState, setInterviewState] = useState("question");
    const [textAnswer, setTextAnswer] = useState("")
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioURL, setAudioURL] = useState(null);

    // Using a ref to hold the MediaRecorder and audio chunks, so they don't trigger re-renders
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // useEffect to handle the animation
    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Timer for recording duration
    useEffect(() => {
        let timer;
        if (isRecording) {
            timer = setInterval(() => {
                setRecordingTime(prevTime => {
                    if (prevTime + 1 >= MAX_RECORDING_TIME) {
                        stopRecording();
                        return MAX_RECORDING_TIME;
                    }
                    return prevTime + 1;
                });
            }, 1000);
        } else if (!isRecording && recordingTime !== 0) {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isRecording, recordingTime]);

    // Format time from seconds to a human-readable format
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')} / 2:00`;
    };

    // Function to start recording, called when the user clicks the "Record Answer" button
    const startRecording = async () => {
        setAudioURL(null); // Clear any previous recording
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = event => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioURL(audioUrl);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            setInterviewState('recording');
        } catch (err) {
            console.error("The following error occurred: " + err);
            // Handle error, e.g., show a message to the user
            setInterviewState('question');
        }
    };

    // Function to stop recording, called when the user clicks the "Stop Recording" button
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setInterviewState('question');
        }
    };

    
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
                        <Button onClick={startRecording} className="flex-1 h-12 cursor-pointer">
                        <Mic className="h-5 w-5 mr-2" />
                        Record Answer
                        </Button>
                        <Button onClick={() => setInterviewState('typing')} variant="outline" className="flex-1 h-12 bg-transparent cursor-pointer">
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
                        <Textarea
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

            {/* Recording State */}
            {interviewState === 'recording' && (
                <Card>
                <CardContent className="pt-6">
                    <div className="text-center space-y-6">
                    <div className="flex items-center justify-center">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Recording in progress...</h3>
                        <div className="text-3xl font-mono text-red-600 mb-2">
                        {formatTime(recordingTime)}
                        </div>
                        <p className="text-gray-600">Speak clearly and take your time</p>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Button onClick={stopRecording} variant="destructive" size="lg" className="cursor-pointer">
                        <MicOff className="h-5 w-5 mr-2" />
                        Stop Recording
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