"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Mic, Type, MicOff, ArrowLeft, ArrowRight, Loader2, RotateCcw, CheckCircle } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import InterviewFeedback from "./InterviewFeedback"
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";


// Define the maximum recording time in seconds
const MAX_RECORDING_TIME = 120; // 2 minutes



export default function InterviewQuestion({ interview, question, question_number, onNext, onPrevious, existingFeedback, onFeedbackGenerated }) {
    const router = useRouter();

    const [interviewState, setInterviewState] = useState("");
    const [textAnswer, setTextAnswer] = useState("")
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioURL, setAudioURL] = useState(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(existingFeedback ? true : false);
    const [feedback, setFeedback] = useState(null);
    const [existingResponse, setExistingResponse] = useState("");
    const [isCompleting, setIsCompleting] = useState(false);
    const [error, setError] = useState(null);


    // New state for speech-to-text
    const [speechTranscript, setSpeechTranscript] = useState("");
    const [finalTranscript, setFinalTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);

    // Using a ref to hold the MediaRecorder and audio chunks, so they don't trigger re-renders
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recognitionRef = useRef(null);
    const accumulatedFinalRef = useRef("");
    const latestTranscriptRef = useRef("");

    // Update state when existingFeedback prop changes (when navigating between questions)
    useEffect(() => {
        if (existingFeedback) {
            setFeedback(existingFeedback.feedback);
            setExistingResponse(existingFeedback.response || "");
            setIsAnswerSubmitted(true);
            setInterviewState("completed");
        } else {
            setInterviewState("question");
            setExistingResponse("");
        }
    }, [existingFeedback]);

    // Update state when existingFeedback prop changes (when navigating between questions)
    useEffect(() => {
        if (existingFeedback) {
            setFeedback(existingFeedback.feedback);
            setExistingResponse(existingFeedback.response || "");
            setIsAnswerSubmitted(true);
            setInterviewState("completed");
        } else {
            setFeedback(null);
            setIsAnswerSubmitted(false);
            setInterviewState("question");
            setExistingResponse("");
        }
        
        // Reset input states when navigating
        setTextAnswer("");
        setFinalTranscript("");
        setSpeechTranscript("");
        setRecordingTime(0);
        setIsRecording(false);
        setIsListening(false);
        setError(null);
        accumulatedFinalRef.current = "";
        latestTranscriptRef.current = "";
    }, [existingFeedback, question_number]);

    // Initialize speech recognition
    useEffect(() => {
      if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          recognitionRef.current = new SpeechRecognition();
          
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = 'en-US';

          recognitionRef.current.onresult = (event) => {
            let interimTranscript = '';
            let newFinalPart = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    newFinalPart += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            if (newFinalPart) {
                accumulatedFinalRef.current += newFinalPart;
                setFinalTranscript(accumulatedFinalRef.current);
            }
            
            const fullText = accumulatedFinalRef.current + interimTranscript;
            latestTranscriptRef.current = fullText;
            setSpeechTranscript(fullText);
        };

          recognitionRef.current.onend = () => {
              setIsListening(false);
          };

          recognitionRef.current.onerror = (event) => {
              console.error('Speech recognition error:', event.error);
              setIsListening(false);
          };
      }

      return () => {
          if (recognitionRef.current) {
              recognitionRef.current.stop();
          }
      };
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


    const submitAnswer = async () => {
        setInterviewState('generating');

        const responseText = latestTranscriptRef.current ? latestTranscriptRef.current : textAnswer;

        const feedbackRequest = {
            interview_id: interview.id,
            question_number: question_number,
            job_title: interview.job_title,
            question: question,
            response: responseText
        };

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        try {
            const response = await fetch(`${API_BASE_URL}/feedback-ai/response`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(feedbackRequest),
            });

            if (!response.ok) {
                throw new Error('Failed to generate feedback');
            }

            const data = await response.json();

            // Update local state
            setFeedback(data.feedback);
            setExistingResponse(data.response);
            
            // Notify parent component about the new feedback
            if (onFeedbackGenerated && question_number) {
                onFeedbackGenerated(question_number.toString(), {
                    feedback: data.feedback,
                    response: data.response
                });
            }
            
            setInterviewState('completed');
        } catch (error) {
            console.error('Error submitting answer:', error);
            // Handle error state appropriately
            setInterviewState('error');
        }
    };

    // Format time from seconds to a human-readable format
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')} / 2:00`;
    };

    // Function to start recording, called when the user clicks the "Record Answer" button
    const startRecording = async () => {
        setAudioURL(null); // Clear any previous recording
        setSpeechTranscript("");
        setFinalTranscript("");
        accumulatedFinalRef.current = "";
        latestTranscriptRef.current = "";

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

            // Start speech recognition
            if (recognitionRef.current) {
              recognitionRef.current.start();
              setIsListening(true);
          }

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
        }

        // Stop speech recognition
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop();
          setIsListening(false);
      }

      setInterviewState('review');
    };

    const handleRetake = () => {
        setInterviewState('recording');
        setRecordingTime(0);
        setSpeechTranscript("");
        setFinalTranscript("");
        accumulatedFinalRef.current = "";
        latestTranscriptRef.current = "";
        setAudioURL(null);
    };

    const handleConfirmSubmit = () => {
        setIsAnswerSubmitted(true);
        submitAnswer();
    };

    const onComplete = async () => {
      setError(null);
      setIsCompleting(true); 

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${API_BASE_URL}/gen-ai/interview/${interview.id}/complete`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
         
        });

        if (!response.ok) {
          throw new Error(`Failed to mark interview as completed: ${response.status}`);
        }

        // remove state from local storage
        localStorage.removeItem(`interview_${interview.id}_state`);
        router.push(`/interview/${interview.id}/results`);

      } catch (error) {
        setIsCompleting(false);
        setError('Failed to complete interview. Please try again.');
      }
    };



     // Animation variants
    const fadeUp = {
        hidden: { opacity: 0, y: 20, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.98 },
    };
    
    return (
        <div className="container min-h-screen mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`question-${question_number}`}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <Card className="mb-8 bg-white border border-slate-200 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-blue-950">
                        Question {question_number}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 border-blue-200 flex items-center space-x-1 text-blue-950"
                      >
                        <Clock className="h-4 w-4 text-blue-950" />
                        <span>2:00</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl text-blue-950 leading-relaxed">
                      {question}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
    
            {/* States */}
            <AnimatePresence mode="wait">
              {interviewState === "question" && (
                <motion.div
                  key="question-options"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Card>
                    <CardContent className="pt-6 text-center space-y-6">
                      <h3 className="text-lg font-semibold text-blue-950 mb-2">
                        Choose how you'd like to answer
                      </h3>
                      <p className="text-slate-600">
                        You can record your voice response or type your answer
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <Button onClick={() => setInterviewState("recording")} className="flex-1 h-12 bg-blue-950 hover:bg-blue-900 text-white">
                          <Mic className="h-5 w-5 mr-2" />
                          Record Answer
                        </Button>
                        <Button
                          onClick={() => setInterviewState("typing")}
                          variant="outline"
                          className="flex-1 h-12 bg-transparent border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-blue-950"
                        >
                          <Type className="h-4 w-4 mr-2" />
                          Type Answer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
    
              {interviewState === "typing" && (
                <motion.div
                  key="typing"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                >
                  <Card>
                    <CardContent className="pt-4 space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-950 mb-2">
                          Type your answer
                        </h3>
                        <p className="text-slate-600 mb-4">
                          Write a detailed response to the question above
                        </p>
                        <Textarea
                          placeholder="Start typing your answer here..."
                          value={textAnswer}
                          onChange={(e) => setTextAnswer(e.target.value)}
                          className="min-h-[200px] text-base border-slate-200 focus:ring-blue-950"
                        />
                      </div>
                      <div className="flex gap-4">
                        <Button
                          onClick={() => setInterviewState("question")}
                          variant="outline"
                          className="bg-transparent border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-blue-950"
                        >
                          Back
                        </Button>
                        <Button
                          disabled={!textAnswer.trim()}
                          className="flex-1 bg-blue-950 hover:bg-blue-900 text-white"
                          onClick={() => {
                            setIsAnswerSubmitted(true);
                            submitAnswer();
                          }}
                        >
                          Submit Answer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
    
              {interviewState === "recording" && (
                <motion.div
                  key="recording"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                >
                  <Card>
                    <CardContent className="pt-6 text-center space-y-6">
                      <div className="flex items-center justify-center">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-blue-950">
                        Recording in progress...
                      </h3>
                      <div className="text-3xl font-mono text-red-600">
                        {formatTime(recordingTime)}
                      </div>

                      {/* Real-time transcript display */}
                      {isListening && (
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 max-h-40 overflow-y-auto">
                          <p className="text-sm text-slate-500 mb-2">Live transcript:</p>
                          {speechTranscript && (
                            <p className="text-blue-950">{speechTranscript}</p>
                          )}
                        </div>
                      )}
                      
                      <p className="text-slate-600">
                        Speak clearly and take your time
                      </p>
                      
                      <div className="flex justify-center gap-4">
                  
                        {!isRecording && (
                            <Button
                            onClick={() => setInterviewState("question")}
                            variant="outline"
                            className="bg-transparent border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-blue-950"
                            size="lg"
                          >
                            Back
                          </Button>
                        )}

                        {isRecording ? (
                        <Button
                          onClick={stopRecording}
                          variant="destructive"
                          size="lg"
                        >
                          <MicOff className="h-5 w-5 mr-2" />
                          Stop Recording
                        </Button>
                        ) : (
                        <Button
                          onClick={startRecording}
                          className="bg-blue-950 hover:bg-blue-900 text-white"
                          size="lg"
                        >
                          <Mic className="h-5 w-5 mr-2" />
                          Start Recording
                        </Button>
                        )}

                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {interviewState === "review" && (
                <motion.div
                  key="review"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                >
                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold text-blue-950">
                          Review your answer
                        </h3>
                        <p className="text-slate-600">
                          Check your transcript before submitting for analysis
                        </p>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <p className="text-sm text-slate-500 mb-3 font-medium uppercase tracking-wider">Transcript:</p>
                        <p className="text-blue-950 leading-relaxed text-lg italic">
                          "{latestTranscriptRef.current || "No transcript generated."}"
                        </p>
                      </div>

                      {audioURL && (
                        <div className="flex justify-center pt-2">
                          <audio src={audioURL} controls className="w-full max-w-md" />
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                          onClick={handleRetake}
                          variant="outline"
                          className="flex-1 h-12 border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-blue-950"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Retake Recording
                        </Button>
                        <Button
                          onClick={handleConfirmSubmit}
                          className="flex-1 h-12 bg-blue-950 hover:bg-blue-900 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirm & Submit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {interviewState === "generating" && (
                <motion.div
                  key="generating"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                >
                  <Card>
                    <CardContent className="pt-8 pb-8 text-center space-y-6">
                      <div className="flex items-center justify-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-blue-950 animate-spin" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <motion.h3 
                          className="text-xl font-semibold text-blue-950"
                          initial={{ opacity: 0.6 }}
                          animate={{ opacity: 1 }}
                          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                        >
                          Analyzing your response...
                        </motion.h3>
                        <p className="text-slate-600">
                          Our AI is generating personalized feedback for you
                        </p>
                      </div>

                      {/* Progress dots animation */}
                      <div className="flex justify-center space-x-2">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-blue-950 rounded-full"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>

                      <p className="text-sm text-slate-500">
                        This may take a few moments
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
    
              {interviewState === "completed" && (
                <motion.div
                  key="completed"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                >
                  <InterviewFeedback
                    response={existingResponse || finalTranscript || textAnswer}
                    feedback={feedback}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error Message Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 max-w-4xl mx-auto"
            >
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="flex-shrink-0 text-red-400 hover:text-red-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
    
          {/* Navigation */}
          <AnimatePresence>
            <motion.div
              key="navigation"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-8 flex justify-between items-center max-w-4xl mx-auto"
            >
              <Button
                onClick={onPrevious}
                variant="outline"
                className="bg-transparent disabled:cursor-not-allowed cursor-pointer border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-blue-950"
                disabled={interviewState === "recording" || interviewState === "typing" || isCompleting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {question_number > 1 ? "Previous Question" : "Return to Start"}
              </Button>

              
              
              <Button
                className={`bg-blue-950 hover:bg-blue-900 text-white ${
                  isAnswerSubmitted ? "cursor-pointer" : "cursor-not-allowed"
                }`}
                onClick={question_number < interview.questions.length ? onNext : onComplete}
                disabled={!isAnswerSubmitted || isCompleting}
              >
                {question_number < interview.questions.length
                  ? "Next Question"
                  : "Complete Interview"}
                {isCompleting ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4 ml-2" />
                )}
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>
      );
}