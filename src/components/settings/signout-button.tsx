'use client';

import { signOut } from 'next-auth/react';
import { Button } from '../ui/Button';

async function handleSignout() {
    await signOut({ redirect: true });
}

export default function LogoutButton() {
    return <Button
        onClick={handleSignout}
        variant='ghost'
        className='justify-start transition duration-300 ease-in-out'
    >
        Logout
    </Button>
}
