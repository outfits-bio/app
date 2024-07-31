import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function NotFoundPage() {
    return <div className="flex flex-col h-full w-full justify-center items-center gap-3">
        <h1 className="font-clash font-bold text-6xl">Page Not Found</h1>
        <Link href="javascript:window.history.back();">
            <Button variant="primary" className="w-fit">Go Back</Button>
        </Link>
    </div>;
}