"use client";
import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import {
  type EditProfileInput,
  editProfileSchema,
} from "@/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleErrors } from "@/utils/handle-errors.util";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";

export function TaglineCard() {
  const { data: session } = useSession();
  const { data: taglineData } = api.user.getProfile.useQuery(
    { username: session?.user?.username ?? "" },
    {
      enabled: !!session?.user?.username,
    },
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false);
  const { update } = useSession();

  const { mutate } = api.user.editProfile.useMutation({
    onSuccess: async () => {
      await update();
      toast.success("Tagline updated!");
    },
    onError: (e) =>
      handleErrors({
        e,
        message: "Failed to edit profile!",
        fn: () => setLoading(false),
      }),
  });

  const handleFormSubmit = ({ tagline }: EditProfileInput) => {
    setLoading(true);

    // If the user didn't change their tagline, do nothing
    if (tagline?.length)
      mutate({
        tagline,
      });
    else {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-start rounded-lg border border-stroke bg-white dark:bg-black">
      <form className="self-stretch" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="flex flex-col items-start gap-5 p-10 self-stretch">
          <div className="flex flex-col items-start gap-3 flex-1">
            <h1 className="font-clash font-bold text-3xl">Tagline</h1>
            <p>
              Your tagline is essentially a small biograph about you, what you
              like or what you do.
            </p>
          </div>
          <div className="flex justify-between items-center self-stretch border dark:border-stroke rounded-lg">
            <Input
              {...register("tagline", { maxLength: 200 })}
              className="flex items-center gap-4 p-3 py-4 flex-1 border-none rounded-lg self-stretch h-fit"
              placeholder="I enjoy linking my outfits."
              defaultValue={taglineData?.tagline ?? ""}
            />
            {errors.tagline && (
              <p className="text-red-500 text-sm">{errors.tagline.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 p-4 px-10 self-stretch rounded-b-lg justify-between border-t dark:border-stroke bg-gray-100 dark:bg-neutral-900">
          <p>You can only have up to 200 characters.</p>
          <div className="flex items-center gap-3">
            <Button type="submit">Save</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
