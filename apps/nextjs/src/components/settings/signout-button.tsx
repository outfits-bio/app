'use server';

import { signOut } from '@acme/auth';
import { Button } from '../ui/Button';

export default async function LogoutButton() {
    return <form>
        <Button
            formAction={async () => {
                "use server";
                await signOut({ redirect: true, redirectTo: '/' });
            }}
            variant='ghost'
            className='justify-start transition duration-300 ease-in-out'
        >
            Logout
        </Button>
    </form>
}
