import { useSession } from 'next-auth/react';
import { Poppins } from 'next/font/google';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Navbar } from './Navbar';

interface Props {
    children: React.ReactNode;
    title: string;
    showSlash?: boolean;
    redirectIfNotAuth?: boolean;
}

const poppins = Poppins({
    subsets: ['latin-ext'],
    weight: '400'
})

export const Layout = ({ children, title, showSlash, redirectIfNotAuth }: Props) => {
    const { push } = useRouter();

    const session = useSession();

    useEffect(() => {
        if (redirectIfNotAuth && session.status === 'unauthenticated') {
            push('/login');
        }
    }, [session, redirectIfNotAuth]);

    if (redirectIfNotAuth && session.status !== 'authenticated') {
        return null;
    }

    return (
        <div className="flex flex-col dark:bg-slate-950 dark:text-white" style={poppins.style}>
            <Navbar title={title} session={session} showSlash={showSlash} />
            <main>{children}</main>
        </div>
    )
}