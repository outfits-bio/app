
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from '~/components/Button';
import { Layout } from '~/components/Layout';
import { BugReportModal } from '~/components/Modals/BugReportModal';
import { FeedbackModal } from '~/components/Modals/FeedbackModal';

import type { NextPage } from "next";

const SettingsPage: NextPage = ({ }) => {
    const [bugReportModalOpen, setBugReportModalOpen] = useState(false);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

    const { pathname } = useRouter();

    return <Layout title="Settings" redirectIfNotAuth showActions showSlash>
        {bugReportModalOpen && <BugReportModal isOpen={bugReportModalOpen} setIsOpen={setBugReportModalOpen} />}
        {feedbackModalOpen && <FeedbackModal isOpen={feedbackModalOpen} setIsOpen={setFeedbackModalOpen} />}

        <div className="w-screen flex flex-col gap-2 p-4 divide-y divide-stroke">
            <div className='gap-2 flex flex-col'>
                <Link href='/settings/profile'>
                    <Button variant='ghost' disabled={pathname === '/settings/profile'} className='justify-start transform transition duration-300 ease-in-out'>Profile</Button>
                </Link>

                <Link href='/settings/connections'>
                    <Button variant='ghost' disabled={pathname === '/settings/connections'} className='justify-start transform transition duration-300 ease-in-out'>Connections</Button>
                </Link>

                <Link href='/settings/appearance'>
                    <Button variant='ghost' disabled={pathname === '/settings/appearance'} className='justify-start transform transition duration-300 ease-in-out'>Appearance</Button>
                </Link>
            </div>

            <div className='gap-2 flex flex-col pt-2'>
                <Button variant='ghost' className='justify-start transform transition duration-300 ease-in-out' onClick={() => setBugReportModalOpen(true)}>Report Bug</Button>

                <Button variant='ghost' className='justify-start transform transition duration-300 ease-in-out' onClick={() => setFeedbackModalOpen(true)}>Send Feedback</Button>
            </div>

            <div className='flex flex-col gap-2 pt-2'>
                <Button variant={'ghost'} className='justify-start transform transition duration-300 ease-in-out' onClick={() => signOut({ callbackUrl: '/' })}>Logout</Button>
            </div>
        </div>
    </Layout>;
}

export default SettingsPage;