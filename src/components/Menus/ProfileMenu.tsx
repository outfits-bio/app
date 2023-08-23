import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-hot-toast';

import { Menu } from '@headlessui/react';
import { DotsThree } from '@phosphor-icons/react';

import { Button } from '../Button';
import { BaseMenu } from './BaseMenu';

import type { User } from 'next-auth';

interface ProfileMenuProps {
    user: User;
    username: string;
    userUrl: string;
    setReportModalOpen: Dispatch<SetStateAction<boolean>>;
    setAdminEditUserModalOpen: Dispatch<SetStateAction<boolean>>;
    handleDeleteUser: () => void;
}

export const ProfileMenu = ({ user, userUrl, username, setReportModalOpen, setAdminEditUserModalOpen, handleDeleteUser, ...props }: ProfileMenuProps) => {
    const handleShare = () => {
        navigator.clipboard.writeText(userUrl);

        toast.success('Copied profile link to clipboard!');
    }

    return <BaseMenu {...props} button={<Button variant='outline' shape={'square'} iconLeft={<DotsThree />} />} className='right-2 md:right-auto md:left-2 md:bottom-0 top-0 md:top-auto'>

        <div className="px-6 pb-2 space-y-1 select-none font-urbanist font-bold h-12 flex items-center gap-2">
            {username}&apos;s profile
        </div>

        <div className="py-2 space-y-1">
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

        </div>

        {user.admin && <div className="pt-2 space-y-1">
            <Menu.Item>
                <Button variant={'ghost'} onClick={handleDeleteUser}>
                    <p>Delete</p>
                </Button>
            </Menu.Item>
            <Menu.Item>
                <Button variant={'ghost'} onClick={() => setAdminEditUserModalOpen(true)}>
                    <p>Edit Profile</p>
                </Button>
            </Menu.Item>
        </div>}
    </BaseMenu>
}