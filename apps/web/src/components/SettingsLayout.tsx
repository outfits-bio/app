import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

import { Button } from './Button';
import { Layout } from './Layout';
import { BugReportModal } from './Modals/BugReportModal';
import { FeedbackModal } from './Modals/FeedbackModal';

interface SettingsLayoutProps {
    children: React.ReactNode
}

export const SettingsLayout = ({ children }: SettingsLayoutProps) => {
    const [bugReportModalOpen, setBugReportModalOpen] = useState(false);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

    const { pathname } = useRouter();

    return <Layout title="Settings" redirectIfNotAuth showActions showSlash>
        {bugReportModalOpen && <BugReportModal isOpen={bugReportModalOpen} setIsOpen={setBugReportModalOpen} />}
        {feedbackModalOpen && <FeedbackModal isOpen={feedbackModalOpen} setIsOpen={setFeedbackModalOpen} />}

        <div className='flex w-screen h-full transition-colors duration-100'>
            <div className='hidden md:flex flex-col h-full w-[300px] border-r border-stroke bg-white dark:bg-black p-4 gap-2 divide-y divide-stroke'>
                <div className='gap-2 flex flex-col'>
                    <Link href='/settings/profile'>
                        <Button variant='ghost' disabled={pathname === '/settings/profile'} className='justify-start transition duration-300 ease-in-out'>Profile</Button>
                    </Link>

                    <Link href='/settings/connections'>
                        <Button variant='ghost' disabled={pathname === '/settings/connections'} className='justify-start transition duration-300 ease-in-out'>Connections</Button>
                    </Link>

                    <Link href='/settings/appearance'>
                        <Button variant='ghost' disabled={pathname === '/settings/appearance'} className='justify-start transition duration-300 ease-in-out'>Appearance</Button>
                    </Link>
                </div>

                <div className='gap-2 flex flex-col pt-2'>
                    <Button variant='ghost' className='justify-start transition duration-300 ease-in-out' onClick={() => setBugReportModalOpen(true)}>Report Bug</Button>

                    <Button variant='ghost' className='justify-start transition duration-300 ease-in-out' onClick={() => setFeedbackModalOpen(true)}>Send Feedback</Button>
                </div>

                <div className='flex flex-col gap-2 pt-2'>
                    <Button variant={'ghost'} className='justify-start transition duration-300 ease-in-out' onClick={() => signOut({ callbackUrl: '/' })}>Logout</Button>
                </div>
            </div>
            {children}
        </div>
    </Layout>
}