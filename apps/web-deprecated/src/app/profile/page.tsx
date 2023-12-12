import { redirect } from 'next/navigation';
import { getServerAuthSession } from '~/server/auth';

export default async function Profile() {
    const session = await getServerAuthSession();

    if (!session?.user) {
        redirect('/login');
    } else {
        redirect(`/${session.user.username}`);
    }

    return null;
}