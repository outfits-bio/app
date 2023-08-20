import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { Fragment, useState } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '~/utils/api.util';
import { handleErrors } from '~/utils/handle-errors.util';

import { Menu, Transition } from '@headlessui/react';
import { DotsThree, Flag, Prohibit, ShareFat } from '@phosphor-icons/react';

import { Button } from './Button';
import { DeleteModal } from './DeleteModal';
import { ReportModal } from './ReportModal';

interface ProfileDropdownProps {
    userUrl: string;
    userId?: string;
}

export const ProfileDropdown = ({ userUrl, userId }: ProfileDropdownProps) => {
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

    const { push } = useRouter();
    const { data } = useSession();

    const { mutate } = api.admin.deleteUser.useMutation({
        onSuccess: () => toast.success('User deleted successfully!'),
        onError: (e) => handleErrors({ e, message: 'An error occurred while deleting this user.' })
    });

    const handleDeleteUser = () => {
        if (!userId) {
            toast.error('An error occurred while deleting this user.');
            return;
        }

        setConfirmDeleteModalOpen(true);
    }

    const handleShare = () => {
        navigator.clipboard.writeText(userUrl);

        toast.success('Copied profile link to clipboard!');
    }

    return <Menu as="div" className="relative inline-block text-left">
        {reportModalOpen && <ReportModal isOpen={reportModalOpen} setIsOpen={setReportModalOpen} type='USER' id={userId} />}
        {confirmDeleteModalOpen && <DeleteModal isOpen={confirmDeleteModalOpen} setIsOpen={setConfirmDeleteModalOpen} admin deleteFn={() => {
            mutate({ id: userId ?? '' });
            push('/explore');
        }} />}
        <Menu.Button as={React.Fragment}>
            <Button variant='outline' iconLeft={<DotsThree />} centerItems />
        </Menu.Button>
        <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <Menu.Items className="absolute z-50 right-2 md:right-auto md:left-2 md:bottom-0 top-0 md:top-auto rounded-md w-56 origin-top-right border border-black dark:border-white bg-white dark:bg-black">
                <div className="px-1 py-1 space-y-1">
                    <Menu.Item>
                        <Button variant='ghost' iconRight={<ShareFat />} onClick={handleShare}>
                            <p>Share</p>
                        </Button>
                    </Menu.Item>
                    {data?.user && <Menu.Item>
                        <Button variant={'ghost'} iconRight={<Flag />} onClick={() => setReportModalOpen(true)}>
                            <p>Report</p>
                        </Button>
                    </Menu.Item>}
                    {data?.user.admin && <Menu.Item>
                        <Button variant={'ghost'} iconRight={<Prohibit />} onClick={handleDeleteUser}>
                            <p>Delete</p>
                        </Button>
                    </Menu.Item>}
                </div>
            </Menu.Items>
        </Transition>
    </Menu>
}