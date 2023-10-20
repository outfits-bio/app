import { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '~/components/Button';
import { Layout } from '~/components/Layout';

export const GoodbyePage: NextPage = () => {

    return <Layout title="Goodbye">
        <div className='w-screen h-screen -mt-20 pt-20 flex justify-center items-center flex-col font-satoshi gap-4'>
            <h1 className='text-center text-5xl font-black font-clash'>Thanks for trying out outfits.bio</h1>
            <article className='text-center'>
                <p className='text-lg'>You’ve successfully deleted your account. If you need additional support or have a question, please contact us at discord!</p>
                <br></br>
                <p className='text-lg'>Before you go, you can give your feedback on the public beta - tell us what you liked and didn’t like!</p>
            </article>
            <div className='relative w-[500]'>
            <div className='flex gap-2 items-center'>
            <Link href='/login'>
                    <Button centerItems variant={'outline-ghost'}>
                        Register
                    </Button>
                    </Link>

                    <Link href='https://discord.gg/f4KEs5TVz2'>
                        <Button centerItems>
                            Send Feedback
                        </Button>
                        </Link>
                    </div>
                </div>
            </div>
    </Layout>
}

export default GoodbyePage;