import Link from 'next/link';

import { BaseModal, type BaseModalProps } from '../modals/base-modal';
import { Button } from '../ui/Button';

export const SpotifySetupModal = (props: BaseModalProps) => {
    return <BaseModal {...props}>
        <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-black font-clash'>Set Up Spotify Status</h1>

            <p className='text-sm text-secondary-text w-full sm:w-96'>We use <Link className='underline' href='https://github.com/Phineas/lanyard'>Lanyard</Link> to power our Spotify Status feature.
                To use Lanyard, you must join their Discord Server using the Discord account that&apos;s connected to outfits.bio.
            </p>

            <div className='flex w-full gap-2'>
                <div className='w-full'>
                    <Button variant={'outline'} centerItems onClick={() => props.close()}>Close</Button>
                </div>
                <Link href={'https://discord.gg/UrXF2cfJ7F'} className='w-full'>
                    <Button variant={'primary'} centerItems>Join Discord</Button>
                </Link>
            </div>
        </div>
    </BaseModal>
}