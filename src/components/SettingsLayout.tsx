import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { DoorOpen, SquaresFour, User } from '@phosphor-icons/react';

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

        <div className='flex w-screen h-full'>
            <div className='hidden md:flex flex-col h-full w-[300px] border-r border-stroke bg-white dark:bg-black p-4 gap-2 divide-y divide-stroke'>
                <div className='gap-2 flex flex-col'>
                    <Link href='/settings/profile'>
                        <Button variant='ghost' disabled={pathname === '/settings/profile'} className='justify-start'>Profile</Button>
                    </Link>

                    <Link href='/settings/connections'>
                        <Button variant='ghost' disabled={pathname === '/settings/connections'} className='justify-start'>Connections</Button>
                    </Link>

                    <Link href='/settings/appearance'>
                        <Button variant='ghost' disabled={pathname === '/settings/appearance'} className='justify-start'>Appearance</Button>
                    </Link>
                </div>

                <div className='gap-2 flex flex-col pt-2'>
                    <Button variant='ghost' className='justify-start' onClick={() => setBugReportModalOpen(true)}>Report Bug</Button>

                    <Button variant='ghost' className='justify-start' onClick={() => setFeedbackModalOpen(true)}>Send Feedback</Button>
                </div>

                <div className='flex flex-col gap-2 pt-2'>
                    <Button variant={'ghost'} className='justify-start' onClick={() => signOut({ callbackUrl: '/' })}>Logout</Button>
                </div>
            </div>
            {children}
        </div>
    </Layout>
}