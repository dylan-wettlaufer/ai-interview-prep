import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getInterview(id) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`http://localhost:8000/gen-ai/interview/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookieHeader,
        },
    });

    if (response.status === 401) {
        redirect('/login');
    }

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const interview = await response.json();

    return interview;
}

export async function getFeedback(id) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`http://localhost:8000/feedback-ai/response/${id}/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookieHeader,
        },
    });

    if (response.status === 401) {
        redirect('/login');
    }

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const feedback = await response.json();

    return feedback;
}