import { useRouter } from 'next/router';

import { Navbar } from './Navbar';

interface Props {
    children: React.ReactNode;
    title: string;
}

export const Layout = ({ children, title }: Props) => {
    return (
        <div className="flex flex-col">
            <Navbar title={title} />
            <main>{children}</main>
        </div>
    )
}