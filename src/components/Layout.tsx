import { Prompt } from 'next/font/google';

import { Navbar } from './Navbar';

interface Props {
    children: React.ReactNode;
    title: string;
    showSlash?: boolean;
}

const prompt = Prompt({
    subsets: ['latin-ext'],
    weight: '400'
})

export const Layout = ({ children, title, showSlash }: Props) => {
    return (
        <div className="flex flex-col dark:bg-slate-950 dark:text-white" style={prompt.style}>
            <Navbar title={title} showSlash={showSlash} />
            <main>{children}</main>
        </div>
    )
}