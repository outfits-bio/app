import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

import { PiDotsThree } from "react-icons/pi";

import { api } from "@/trpc/react";
import { handleErrors } from "@/utils/handle-errors.util";
import { Button } from "../ui/Button";
import { AdminEditUserModal } from "../modals/admin-edit-user-modal";
import { ReportModal } from "../modals/report-modal";
import type { ReportType } from "database";
import { DeleteModal } from "../modals/delete-modal";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface ProfileMenuProps {
  username: string;
  userUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profileData: any;
  type: ReportType;
  id: string;
}

export const ProfileMenu = ({
  userUrl,
  username,
  profileData,
  type,
  id,
  ...props
}: ProfileMenuProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const ref = useRef<HTMLButtonElement>(null);

  const user = session?.user;

  const { mutate: deleteUser } = api.admin.deleteUser.useMutation({
    onSuccess: () => toast.success("User deleted successfully!"),
    onError: (e) =>
      handleErrors({
        e,
        message: "An error occurred while deleting this user.",
      }),
  });

  const handleDeleteUser = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!profileData?.id) {
      toast.error("An error occurred while deleting this user.");
      return;
    }

    ref.current?.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      navigator
        .share({
          title: "outfits.bio",
          text: "Check out this profile on outfits.bio!",
          url: userUrl,
        })
        .catch((error) => {
          console.error("Error sharing:", error);
        });
    } else {
      void navigator.clipboard.writeText(userUrl);
      toast.success("Copied profile link to clipboard!");
    }
  };

  return (
    <Popover {...props}>
      <PopoverTrigger asChild>
        <Button variant="outline" shape={"square"} iconLeft={<PiDotsThree />} />
      </PopoverTrigger>
      <PopoverContent className="w-fit mr-2 md:mr-0">
        <div className="px-6 pb-2 space-y-1 select-none font-clash font-bold h-12 flex items-center gap-2">
          {username}&apos;s profile
        </div>

        <div className="pt-2 space-y-1 border-t border-stroke">
          <div>
            <Button variant="ghost" onClick={handleShare}>
              <p>Share</p>
            </Button>
          </div>
          {user && (
            <div>
              <ReportModal type={type} id={id} />
            </div>
          )}
        </div>

        {user?.admin && (
          <div className="pt-2 space-y-1 border-t border-stroke">
            <div>
              <DeleteModal
                admin
                deleteFn={() => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                  deleteUser({ id: profileData?.id ?? "" });
                  router.push("/");
                }}
              >
                <Button variant={"ghost"} onClick={handleDeleteUser}>
                  Delete
                </Button>
              </DeleteModal>
            </div>
            <div>
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
              <AdminEditUserModal targetUser={profileData}>
                <Button variant={"ghost"}>
                  <p>Edit Profile</p>
                </Button>
              </AdminEditUserModal>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
