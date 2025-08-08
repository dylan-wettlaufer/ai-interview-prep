"use client";
import {useState, useEffect} from "react";
import DashboardHeader from "../../dashboard/components/DashboardHeader";
import InterviewStartScreen from "./components/InterviewStartScreen";
import InterviewStartScreenSkeleton from "./components/InterviewStartScreenSkeleton";
import InterviewQuestion from "./components/InterviewQuestion"



export default function InterviewClient({ interview_id }) {

    const [interview, setInterview] = useState(null);

    // Use local storage to persist interview state
    const [interviewState, setInterviewState] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedState = localStorage.getItem('interviewState');
            return savedState ? parseInt(savedState, 10) : 0;
        }
        return 0;
    });

    const handleStartInterview = () => {
        setInterviewState(1);
    };

    const handleNextQuestion = () => {
        setInterviewState(interviewState + 1);
    };

    const handlePreviousQuestion = () => {
        setInterviewState(interviewState - 1);
    };

    const handleReturnToDashboard = () => {
        setInterviewState(0);
    };

    // Save interview state to local storage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('interviewState', interviewState.toString());
        }
    }, [interviewState]);

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


    // Use a variable to store the content to be rendered,
    // determined by a switch statement outside of the return.
    let content;
    switch (interviewState) {
        case 0:
            content = interview ? (
                <InterviewStartScreen
                    interview={interview}
                    onStart={handleStartInterview}
                    onReturn={handleReturnToDashboard}
                />
            ) : (
                <InterviewStartScreenSkeleton />
            );
            break;
        case 1:
            content = interview ? (
                <InterviewQuestion 
                interview={interview} 
                question={interview.questions[interviewState-1].question} 
                question_number={interviewState} 
                onNext={handleNextQuestion} 
                onPrevious={handlePreviousQuestion}/>
            ) : (
                <InterviewStartScreenSkeleton />
            );
            break;
        case 2:
            content = interview ? (
                <InterviewQuestion 
                interview={interview} 
                question={interview.questions[interviewState-1].question} 
                question_number={interviewState} 
                onNext={handleNextQuestion} 
                onPrevious={handlePreviousQuestion}/>
            ) : (
                <InterviewStartScreenSkeleton />
            );
            break;
        
        case 3:
            content = interview ? (
                <InterviewQuestion 
                interview={interview} 
                question={interview.questions[interviewState-1].question} 
                question_number={interviewState} 
                onNext={handleNextQuestion} 
                onPrevious={handlePreviousQuestion}/>
            ) : (
                <InterviewStartScreenSkeleton />
            );
            break;

        case 4:
            content = interview ? (
                <InterviewQuestion 
                interview={interview} 
                question={interview.questions[interviewState-1].question} 
                question_number={interviewState} 
                onNext={handleNextQuestion} 
                onPrevious={handlePreviousQuestion}/>
            ) : (
                <InterviewStartScreenSkeleton />
            );
            break;
        case 5:
            content = interview ? (
                <InterviewQuestion 
                interview={interview} 
                question={interview.questions[interviewState-1].question} 
                question_number={interviewState} 
                onNext={handleNextQuestion} 
                onPrevious={handlePreviousQuestion}/>
            ) : (
                <InterviewStartScreenSkeleton />
            );
            break;
        
        default:
            content = <InterviewStartScreen interview={interview} />;
    }

    return (
        <div className=" bg-neutral-900 text-white font-inter">
            <DashboardHeader />

            {/* render the content variable */}
            {content}

        </div>
    );
}