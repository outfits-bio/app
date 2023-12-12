import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '~/components/Button';
import { Layout } from '~/components/Layout';

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
    </Layout>
}

export default UserNotFoundPage;