"use client";
import { useState } from "react";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { type AddLinkInput, addLinkSchema } from "@/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleErrors } from "@/utils/handle-errors.util";
import toast from "react-hot-toast";
import { Button } from "../../../components/ui/Button";
import {
  PiDiscordLogo,
  PiGithubLogo,
  PiInstagramLogo,
  PiLinkSimple,
  PiPlus,
  PiTiktokLogo,
  PiTrash,
  PiTwitterLogo,
  PiYoutubeLogo,
} from "react-icons/pi";
import { LinkType } from "database";
import { Input } from "@/components/ui/input";

export function LinksCard() {
  const {
    register: registerLink,
    handleSubmit: handleSubmitLink,
    resetField,
  } = useForm<AddLinkInput>({
    resolver: zodResolver(addLinkSchema),
  });
  const ctx = api.useContext();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false);

  const { data: userData } = api.user.getMe.useQuery(undefined, {
    // do nothing
  });

  const { mutate: addLink, isPending: linkPending } =
    api.user.addLink.useMutation({
      onSuccess: async () => {
        resetField("url");
        await ctx.user.getMe.refetch();
        toast.success("Link added!");
      },
      onError: (e) =>
        handleErrors({
          e,
          message: "Failed to add link!",
          fn: () => setLoading(false),
        }),
    });

  const {
    mutate: removeLink,
    isPending: removeLinkPending,
    variables: removeLinkVariables,
  } = api.user.removeLink.useMutation({
    onSuccess: async () => {
      await ctx.user.getMe.refetch();
      toast.success("Link removed!");
    },
    onError: (e) =>
      handleErrors({
        e,
        message: "Failed to remove link!",
        fn: () => setLoading(false),
      }),
  });

  const handleFormSubmitLink = ({ url }: AddLinkInput) => addLink({ url });

  return (
    <div className="flex flex-col items-start rounded-lg border bg-white dark:bg-black dark:border-stroke">
      <div className="flex flex-col items-start gap-5 p-10 self-stretch">
        <div className="flex flex-col items-start gap-3 flex-1">
          <h1 className="font-clash font-bold text-3xl">Social Links</h1>
          <p>Add links of your socials or websites to your profile</p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {userData?.links.map((link) => (
            <div className="flex items-center gap-2 w-full" key={link.id}>
              <p className="gap-1 py-2 h-12 w-full cursor-default overflow-x-hidden flex px-4 items-center select-none rounded-xl border border-stroke">
                {link.type === LinkType.TWITTER && (
                  <PiTwitterLogo className="w-5 h-5" />
                )}
                {link.type === LinkType.YOUTUBE && (
                  <PiYoutubeLogo className="w-5 h-5" />
                )}
                {link.type === LinkType.TIKTOK && (
                  <PiTiktokLogo className="w-5 h-5" />
                )}
                {link.type === LinkType.DISCORD && (
                  <PiDiscordLogo className="w-5 h-5" />
                )}
                {link.type === LinkType.INSTAGRAM && (
                  <PiInstagramLogo className="w-5 h-5" />
                )}
                {link.type === LinkType.GITHUB && (
                  <PiGithubLogo className="w-5 h-5" />
                )}
                {link.type === LinkType.WEBSITE && (
                  <PiLinkSimple className="w-5 h-5" />
                )}
                <span className="underline">{link.url}</span>
              </p>
              <div>
                <Button
                  variant="outline"
                  iconLeft={<PiTrash />}
                  centerItems
                  isLoading={
                    removeLinkPending && removeLinkVariables?.id === link.id
                  }
                  onClick={() => removeLink({ id: link.id })}
                />
              </div>
            </div>
          ))}
        </div>

        <form className="" onSubmit={handleSubmitLink(handleFormSubmitLink)}>
          {userData?.links && userData?.links?.length < 6 && (
            <div className="flex gap-2">
              <Input
                id="link"
                type="text"
                placeholder="https://example.com"
                className="px-4 py-2 h-12 border rounded-xl border-stroke dark:text-white dark:bg-black"
                {...registerLink("url")}
              />
              <div>
                <Button
                  type="submit"
                  disabled={linkPending}
                  isLoading={linkPending}
                  centerItems
                  iconLeft={<PiPlus />}
                />
              </div>
            </div>
          )}
        </form>
      </div>
      <div className="flex flex-wrap items-center gap-3 p-4 px-10 self-stretch justify-between rounded-b-lg border-t dark:border-stroke bg-gray-100 dark:bg-neutral-900">
        <p>Mainstream platforms have their own icons.</p>
      </div>
    </div>
  );
}
