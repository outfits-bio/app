"use client"
import { useState } from "react";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import {
    AddLinkInput, addLinkSchema
} from '@/schemas/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleErrors } from '@/utils/handle-errors.util';
import { ProfileLink } from "../../ui/ProfielLink";
import toast from "react-hot-toast";
import { Button } from "../../ui/Button"

export function LinksCard() {
    const { register: registerLink, handleSubmit: handleSubmitLink, resetField } = useForm<AddLinkInput>({
        resolver: zodResolver(addLinkSchema),
    });
    const ctx = api.useContext();

    const [loading, setLoading] = useState<boolean>(false);

    const { data: userData } = api.user.getMe.useQuery(undefined, {
        onSuccess: (data) => {
            // do nothing 
        }
    });

    const { mutate: addLink, isLoading: linkLoading } = api.user.addLink.useMutation({
        onSuccess: () => {
            resetField("url");
            ctx.user.getMe.refetch();
            toast.success("Link added!");
        },
        onError: (e) => handleErrors({ e, message: "Failed to add link!", fn: () => setLoading(false) })
    });

    const { mutate: removeLink, isLoading: removeLinkLoading, variables: removeLinkVariables } = api.user.removeLink.useMutation({
        onSuccess: () => {
            ctx.user.getMe.refetch();
            toast.success("Link removed!");
        },
        onError: (e) => handleErrors({ e, message: "Failed to remove link!", fn: () => setLoading(false) })
    });

    const handleFormSubmitLink = ({ url }: AddLinkInput) => addLink({ url });

    return (
        <div className="flex flex-col items-start rounded-lg border bg-white">
            <form className="self-stretch" onSubmit={handleSubmitLink(handleFormSubmitLink)}>
                <div className="flex flex-col items-start flex gap-5 p-10 self-stretch">
                    <div className="flex flex-col items-start gap-3 flex-1">
                        <h1 className="font-clash font-bold text-3xl">Social Links.</h1>
                        <p>Add links of your socials or websites to your profile</p>
                    </div>
                    {userData?.links.length && userData?.links.length <= 3 ?
                        <>
                            <ProfileLink {...userData?.links[0]!} />
                            <ProfileLink {...userData?.links[1]!} />
                            <ProfileLink {...userData?.links[2]!} />
                        </> : <>
                            {userData?.links.map((link) => (<ProfileLink key={link.id} {...link} />))}
                        </>
                    }
                </div>
                <div className="flex flex-wrap items-center gap-3 p-4 px-10 self-stretch justify-between border-t bg-gray-100">
                    <p>Maximum of 3 links. Mainstream platforms have their own icons.</p>
                    <div className="flex items-center gap-3">
                        <Button>Save</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}