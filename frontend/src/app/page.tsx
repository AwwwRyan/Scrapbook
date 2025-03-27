'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Chat from './components/Chat';

export default function HomePage() {
    const router = useRouter();

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Welcome to Scrapbook</h1>
                <Button onClick={() => router.push('/profile/edit')}>
                    Edit Profile
                </Button>
            </div>
            {/* <Chat /> */}
        </div>
    );
}
