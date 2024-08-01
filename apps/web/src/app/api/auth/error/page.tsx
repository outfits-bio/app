"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";

const errors = {
    Signin: "Try signing with a different account.",
    OAuthSignin: "Try signing with a different account.",
    OAuthCallback: "Try signing with a different account.",
    OAuthCreateAccount: "Try signing with a different account.",
    EmailCreateAccount: "Try signing with a different account.",
    Callback: "Try signing with a different account.",
    OAuthAccountNotLinked:
        "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "Check your email address.",
    CredentialsSignin:
        "Sign in failed. Check the details you provided are correct.",
    default: "Unable to sign in.",
}

const Error = () => {

    const searchParams = new URLSearchParams(window.location.search)
    const error = searchParams.get('error')

    const errorMessage = error && (errors[error as keyof typeof errors] ?? errors.default)

    return (
        <div className="flex flex-col items-center justify-center h-full gap-3">
            <h1 className="text-5xl font-clash font-bold">Oops! Something went wrong</h1>
            <h2 className="text-lg">{errorMessage}</h2>
            <Link href="/login"><Button>Login</Button></Link>
        </div>
    )
}

export default Error