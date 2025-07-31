
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import LoginForm from './LoginForm';  // client component

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export default async function LoginPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (token) {
        try {
            jwt.verify(token, SECRET_KEY);
            redirect('/dashboard');
        } catch {
            // invalid token, continue to login page
        }
    }
    
  return <LoginForm />;
}