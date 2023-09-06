import { signIn } from 'next-auth/react';
import Link from 'next/link';

import { Button } from '../Button';
import { BaseModal, BaseModalProps } from './BaseModal';

export const SpotifyConnectDiscordModal = (props: BaseModalProps) => {
    return <BaseModal {...props}>
        <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-black font-clash'>Set Up Spotify Status</h1>

            <p className='text-sm text-secondary-text w-full sm:w-96'>We use <Link className='underline' href='https://github.com/Phineas/lanyard'>Lanyard</Link> to power our Spotify Status feature.
                To use Lanyard, you must first connect your Discord account to outfits.bio.
            </p>

            <div className='flex w-full gap-2'>
                <div className='w-full'>
                    <Button variant={'outline'} centerItems onClick={() => props.setIsOpen(false)}>Close</Button>
                </div>
                <Button onClick={() => signIn('discord')} centerItems>
                    Connect Discord
                </Button>
            </div>
        </div>
    </BaseModal>
}