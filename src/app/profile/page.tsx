import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await getServerAuthSession();

  if (session?.user) {
    redirect("/" + session.user.username);
  } else {
    redirect("/");
  }
}
