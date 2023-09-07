import { NextPage } from 'next';
import { Layout } from '~/components/Layout';
import { Button } from '~/components/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const UserNotFoundPage: NextPage = () => {
    const { query } = useRouter();
    const username = query.username?.toString() ?? 'not found';

    return <Layout title={username}>
        <div className='w-screen h-screen -mt-20 pt-20 flex justify-center items-center flex-col font-satoshi gap-4'>
            <h1 className='text-center text-5xl font-black font-clash'>{username}</h1>
            <article className='text-center'>
                <p className='text-lg'>This could be your handle.</p>
                </article>
            <div className='relative w-[500]'>
            <div className='flex gap-2 items-center'>
            <Link href='/explore'>
                    <Button centerItems variant={'outline-ghost'}>
                        Explore
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
    </Layout>
}

export default UserNotFoundPage;