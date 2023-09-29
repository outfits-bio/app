import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { Layout } from '~/components/Layout';

import { Copy } from '@phosphor-icons/react/dist/ssr';

export const ErrorPage: NextPage = () => {
    const { query } = useRouter();
    const { error } = query;

    const handleShare = () => {
        navigator.clipboard.writeText(error?.toString() ?? '');

        toast.success('Copied to clipboard!');
    }

    return <Layout title="Error">
        <div className='flex flex-col items-center justify-center w-full h-full font-satoshi gap-4'>
            <h1 className='text-5xl font-black font-clash'>Uh oh!</h1>
            <article className='text-center'>
                <p className='text-lg'>There was an error authenticating you.</p>
                <p className='text-lg'>Here&apos;s the error code we received:</p>
                <p className='text-lg text-red-500 hover:underline cursor-pointer flex gap-1 items-center justify-center group pr-5 hover:pr-0 pl-4' onClick={handleShare}>{error}
                    <Copy className='hidden group-hover:flex w-4 h-4' />
                </p>
            </article>
        </div>
    </Layout>
}

export default ErrorPage;