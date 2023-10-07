
import { Menu } from '@headlessui/react';
import type { User } from 'next-auth';
import type { Dispatch, SetStateAction } from 'react';
import { PiDotsThree } from 'react-icons/pi';

import { BaseMenu } from './BaseMenu';
import { Button } from '../Button';

interface PostMenuProps {
    user: User;
    setReportModalOpen: Dispatch<SetStateAction<boolean>>;
    handleDeleteUserPost: () => void;
    handleDeletePost: () => void;
    userIsProfileOwner: boolean;
    button?: JSX.Element;
}

export const PostMenu = ({ user, setReportModalOpen, handleDeleteUserPost, handleDeletePost, userIsProfileOwner, button, ...props }: PostMenuProps) => {

    return <BaseMenu {...props} button={button ?? <PiDotsThree className='w-5 h-5 text-white' />} className='right-0 bottom-0 w-44 origin-top-right'>

        <div className="space-y-1">
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