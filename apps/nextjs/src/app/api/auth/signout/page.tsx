'use server';

import { signOut } from '@acme/auth';
import React from 'react';

export default async function SignOutPage() {
    const performSignOut = async () => {
        try {
            await signOut({ redirect: true, redirectTo: '/' });
        } catch (error) {
            console.error('Error during sign out:', error);
        }
    };

    await performSignOut();

    return (
        <div className="flex flex-col items-center justify-center h-full gap-3">
            <h1 className="text-5xl text-center font-clash font-bold">Sign Out Successful</h1>
            <h2 className="text-lg">You have been successfully signed out.</h2>
        </div>
    );
}
