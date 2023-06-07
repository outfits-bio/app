import { Poppins } from 'next/font/google';

import { Navbar } from './Navbar';

interface Props {
    children: React.ReactNode;
    title: string;
    showSlash?: boolean;
}

const poppins = Poppins({
    subsets: ['latin-ext'],
    weight: '400'
})

export const Layout = ({ children, title, showSlash }: Props) => {
    return (
        <div className="flex flex-col dark:bg-slate-950 dark:text-white" style={poppins.style}>
            <Navbar title={title} showSlash={showSlash} />
            <main>{children}</main>
        </div>
    )
}