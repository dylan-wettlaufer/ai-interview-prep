"use client";
import {useState, useEffect} from "react";
import DashboardHeader from "../../dashboard/components/DashboardHeader";
import InterviewStartScreen from "./components/InterviewStartScreen";
import InterviewStartScreenSkeleton from "./components/InterviewStartScreenSkeleton";
import InterviewQuestion from "./components/InterviewQuestion"
import { useRouter } from "next/navigation";



export default function InterviewClient({ interview, feedback }) {
    const router = useRouter();

    const [allFeedback, setAllFeedback] = useState(feedback);
    const [interviewState, setInterviewState] = useState(0);
    const [isInitialStateLoaded, setIsInitialStateLoaded] = useState(false);

    // This useEffect will run only on the client-side after the component mounts
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedState = localStorage.getItem(`interview_${interview.id}_state`);
            if (savedState !== null) {
                setInterviewState(parseInt(savedState, 10));
            }
        }
        setIsInitialStateLoaded(true);
    }, [interview.id]);

    

    // set interview to start
    const handleStartInterview = () => {
        setInterviewState(1);
    };

    // increase the interview state by 1
    const handleNextQuestion = () => {
        setInterviewState(interviewState + 1);
    };

    // decrease the interview state by 1
    const handlePreviousQuestion = () => {
        setInterviewState(interviewState - 1);
    };

    // return to dashboard
    const handleReturnToDashboard = () => {
        router.push('/dashboard');
    };

    // Save interview state to local storage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(`interview_${interview.id}_state`, interviewState.toString());
        }
    }, [interviewState]);


      // adds newly added feedback to the existing feedback so that it appears in the current session
      const handleFeedbackGenerated = (questionNumber, feedbackData) => {
        setAllFeedback(prev => {
          // Initialize with empty object if prev is null
          const current = prev || { feedback_by_question: {} };
          return {
            ...current,
            feedback_by_question: {
              ...(current.feedback_by_question || {}),
              [questionNumber]: {
                feedback: feedbackData.feedback,
                response: feedbackData.response
              }
            }
          };
        });
      };

    // Helper function to get existing feedback for a specific question
    const getExistingFeedback = (questionNumber) => {
        return allFeedback?.feedback_by_question?.[questionNumber] || null;
    };

    // Helper function to render interview question
    const renderInterviewQuestion = (questionIndex) => {
        return (
            <InterviewQuestion 
                interview={interview} 
                question={interview.questions[questionIndex].question} 
                question_number={questionIndex + 1} 
                onNext={handleNextQuestion} 
                onPrevious={handlePreviousQuestion}
                existingFeedback={getExistingFeedback(questionIndex + 1)}
                onFeedbackGenerated={handleFeedbackGenerated}
            />
        );
    };

    // Use a variable to store the content to be rendered,
    // determined by a switch statement outside of the return.
    let content;

    // Wait for the initial state to be loaded before rendering
    if (!isInitialStateLoaded) {
        content = <InterviewStartScreenSkeleton />;
    } else {
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
            content = interview && allFeedback ? renderInterviewQuestion(0) : <InterviewStartScreenSkeleton />;
            break;
        case 2:
            content = interview && allFeedback ? renderInterviewQuestion(1) : <InterviewStartScreenSkeleton />;
            break;
        case 3:
            content = interview && allFeedback ? renderInterviewQuestion(2) : <InterviewStartScreenSkeleton />;
            break;
        default:
            content = <InterviewStartScreen interview={interview} />;
    }
    }

    return (
        <div className=" bg-neutral-900 text-white font-inter">
            <DashboardHeader />

            {/* render the content variable */}
            {content}

        </div>
    );
}