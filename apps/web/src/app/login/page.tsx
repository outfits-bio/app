import { redirect } from 'next/navigation';
import { Login } from '~/components/Login';
import { getServerAuthSession } from '~/server/auth';

export default async function LoginPage() {
  const session = await getServerAuthSession();

  if (session?.user) {
    redirect(`/${session.user.username}`);
  } else {
    return <Login />;
  }

  return null;
};