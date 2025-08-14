import InterviewResults from "@/components/InterviewResults";

export default async function InterviewResultsPage({ params }) {
    const { interview_id } = await params;
    return (
        <InterviewResults interview_id={interview_id} />
    );
}
