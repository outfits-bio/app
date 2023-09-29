import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

import { Menu } from '@headlessui/react';
import { DotsThree } from '@phosphor-icons/react/dist/ssr';

import { Button } from '../Button';
import { BaseMenu } from './BaseMenu';

import type { User } from 'next-auth';
import type { Dispatch, SetStateAction } from 'react';
interface PostMenuProps {
    user: User;
    setReportModalOpen: Dispatch<SetStateAction<boolean>>;
    handleDeleteUserPost: () => void;
    handleDeletePost: () => void;
    userIsProfileOwner: boolean;
}

export const PostMenu = ({ user, setReportModalOpen, handleDeleteUserPost, handleDeletePost, userIsProfileOwner, ...props }: PostMenuProps) => {
    const { asPath } = useRouter();

    const handleShare = () => {
        const origin =
            typeof window !== 'undefined' && window.location.origin
                ? window.location.origin
                : '';

        const url = `${origin}${asPath}`;

        navigator.clipboard.writeText(url);

        toast.success('Copied post link to clipboard!');
    }

    return <BaseMenu {...props} button={<DotsThree className='w-5 h-5 text-white' />} className='right-0 bottom-0 w-44 origin-top-right'>

        <div className="space-y-1">
            <Menu.Item>
                <Button variant='ghost' onClick={handleShare}>
                    <p>Share</p>
                </Button>
            </Menu.Item>
            {user && <Menu.Item>
                <Button variant={'ghost'} onClick={() => setReportModalOpen(true)}>
                    <p>Report</p>
                </Button>
            </Menu.Item>}
            {(userIsProfileOwner && !user.admin) && <Menu.Item>
                <Button variant={'ghost'} onClick={handleDeleteUserPost}>
                    <p>Delete</p>
                </Button>
            </Menu.Item>}
            {user.admin && <Menu.Item>
                <Button variant={'ghost'} onClick={handleDeletePost}>
                    <p>Delete</p>
                </Button>
            </Menu.Item>}
        </div>
    </BaseMenu>
}