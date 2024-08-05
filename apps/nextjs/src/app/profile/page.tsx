import { auth } from "@acme/auth";
import { redirect } from "next/navigation";

export default async function Profile() {
    const session = await auth();

    if (session?.user) {
        redirect('/' + session.user.username);
    } else {
        redirect('/');
    }
}