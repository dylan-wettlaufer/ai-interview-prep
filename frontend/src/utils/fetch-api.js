import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function getInterview(id) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}/gen-ai/interview/${id}`, {
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

    const response = await fetch(`${API_BASE_URL}/feedback-ai/response/${id}/all`, {
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


export async function getInterviewSummary() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}/data/interviews/summary`, {
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

    const summary = await response.json();

    return summary;
}

export async function getInProgressInterviews() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}/data/interviews/in-progress`, {
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

    const inProgressInterviews = await response.json();

    return inProgressInterviews;
}

export async function getCompletedInterviews() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}/data/interviews/completed`, {
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

    const completedInterviews = await response.json();

    return completedInterviews;
    }

    export async function getUserProfile() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    try {
        const response = await fetch(`${API_BASE_URL}/auth/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieHeader,
            },
        });

        if (!response.ok) {
            return null;
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
    }