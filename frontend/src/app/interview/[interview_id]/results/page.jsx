import InterviewResults from "@/components/InterviewResults";
import { getInterview, getFeedback } from "@/utils/fetch-api";
import { redirect } from "next/navigation";


export default async function InterviewResultsPage({ params }) {
    const { interview_id } = await params;
    const interview = await getInterview(interview_id);

    if (!interview.completed) {
        redirect(`/interview/${interview_id}`);
    } 

    const feedback = await getFeedback(interview_id);

    return (
        <InterviewResults interview={interview} feedback={feedback} />
    );
}
