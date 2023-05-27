import { Prompt } from 'next/font/google';

import { Navbar } from './Navbar';

interface Props {
    children: React.ReactNode;
    title: string;
}

const prompt = Prompt({
    subsets: ['latin-ext'],
    weight: '400'
})

export const Layout = ({ children, title }: Props) => {
    return (
        <div className="flex flex-col" style={prompt.style}>
            <Navbar title={title} />
            <main>{children}</main>
        </div>
    )
}