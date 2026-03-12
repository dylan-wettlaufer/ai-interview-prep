
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';  // client component
import { getUserProfile } from '@/utils/fetch-api';

export default async function LoginPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (token) {
        // Verify token by calling backend /auth/user
        const user = await getUserProfile();
        if (user) {
            redirect('/dashboard');
        }
    }
    
  return <LoginForm />;
}