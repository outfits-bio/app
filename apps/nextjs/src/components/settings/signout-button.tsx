'use client';

import { signOut } from '@acme/auth';
import { Button } from '../ui/Button';

export default function LogoutButton() {
    return (
        <Button
            variant='ghost'
            className='justify-start transition duration-300 ease-in-out'
            onClick={() => signOut({ redirect: true, redirectTo: '/' })}
        >
            Logout
        </Button>
    );
}
