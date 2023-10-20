import { Layout } from '~/components/Layout';

export const PrivacyPolicyPage = () => {
    return <Layout title='Brand' hideSearch={true}>
        <iframe title='Brand Guide' src='/brand.pdf' className='w-full xl:w-[1000px] h-screen -mt-20 pt-24 px-4 pb-4' />
    </Layout>
}

export default PrivacyPolicyPage;