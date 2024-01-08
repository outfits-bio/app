import Link from 'next/link';
import { ProfileNotFoundUsername } from '../_components/profile/not-found';
import { Button } from '../_components/ui/Button';

export const UserNotFoundPage = () => {
    return <div className='w-screen h-screen -mt-20 pt-20 flex justify-center items-center flex-col font-satoshi gap-4'>
        <ProfileNotFoundUsername />
        <article className='text-center'>
            <p className='text-lg'>This could be your handle.</p>
        </article>
        <div className='relative w-[500]'>
            <div className='flex gap-2 items-center'>
                <Link href='/discover'>
                    <Button centerItems variant={'outline-ghost'}>
                        Discover
                    </Button>
                </Link>

                <Link href='/login'>
                    <Button centerItems>
                        Claim Handle
                    </Button>
                </Link>
            </div>
        </div>
    </div>
}

export default UserNotFoundPage;