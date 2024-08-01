import { Menu } from '@headlessui/react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

import { PiDotsThree } from 'react-icons/pi';

import { api } from '@/trpc/react';
import { handleErrors } from "@/utils/handle-errors.util";
import { BaseMenu } from './base-menu';
import { Button } from '../ui/Button';
import { AdminEditUserModal } from '../modals/admin-edit-user-modal';
import { ReportModal } from '../modals/report-modal';
import type { ReportType } from 'database';
import { DeleteModal } from '../modals/delete-modal';
import { useRouter } from "next/navigation";
import { useRef } from 'react';


interface ProfileMenuProps {
    username: string;
    userUrl: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profileData: any;
    type: ReportType;
    id: string;
}

export const ProfileMenu = ({ userUrl, username, profileData, type, id, ...props }: ProfileMenuProps) => {
    const { data: session } = useSession();
    const router = useRouter();
    const ref = useRef<HTMLButtonElement>(null);

    const user = session?.user;

    const { mutate: deleteUser } = api.admin.deleteUser.useMutation({
        onSuccess: () => toast.success('User deleted successfully!'),
        onError: (e) => handleErrors({ e, message: 'An error occurred while deleting this user.' })
    });

    const handleDeleteUser = () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (!profileData?.id) {
            toast.error('An error occurred while deleting this user.');
            return;
        }

        ref.current?.click();
    }

    const handleShare = async () => {
        await navigator.clipboard.writeText(userUrl);

        toast.success('Copied profile link to clipboard!');
    }

    return <BaseMenu {...props} button={<Button variant='outline' shape={'square'} iconLeft={<PiDotsThree />} />} className='right-2 md:right-auto md:left-2 md:bottom-0 top-0 md:top-auto'>

        <div className="px-6 pb-2 space-y-1 select-none font-clash font-bold h-12 flex items-center gap-2">
            {username}&apos;s profile
        </div>

        <div className="py-2 space-y-1">
            <Menu.Item>
                <Button variant='ghost' onClick={handleShare}>
                    <p>Share</p>
                </Button>
            </Menu.Item>
            {user && <Menu.Item>
                <ReportModal type={type} id={id} />
            </Menu.Item>}

        </div>

        {user?.admin && <div className="pt-2 space-y-1">
            <Menu.Item>
                <DeleteModal admin deleteFn={() => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    deleteUser({ id: profileData?.id ?? '' });
                    router.push('/');
                }}>
                    <Button variant={'ghost'} onClick={handleDeleteUser}>
                        Delete
                    </Button>
                </DeleteModal>
            </Menu.Item>
            <Menu.Item>
                {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
                <AdminEditUserModal targetUser={profileData}>
                    <Button variant={'ghost'}>
                        <p>Edit Profile</p>
                    </Button>
                </AdminEditUserModal>
            </Menu.Item>
        </div>}
    </BaseMenu>
}