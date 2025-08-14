import InterviewClient from "./InterviewClient";
import { getInterview, getFeedback } from "@/utils/fetch-api";
import { redirect } from "next/navigation";

export default async function InterviewPage({ params }) {
    const { interview_id } = await params;

    const interview = await getInterview(interview_id);

    if (interview.completed) { // interview is completed
        redirect(`/interview/${interview_id}/results`);
    }
    
    const feedback = await getFeedback(interview_id);

    return (
        <InterviewClient interview={interview} feedback={feedback} />
    );
}

