import InterviewClient from "./InterviewClient";

export default async function InterviewPage({ params }) {

    const { interview_id } = await params;


    return (
        <InterviewClient interview_id={interview_id} />
    );
}

