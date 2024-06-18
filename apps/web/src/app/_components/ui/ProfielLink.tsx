import { forwardRef } from 'react';
import { LinkType } from "database";
import {
    PiDiscordLogo, PiGithubLogo, PiInstagramLogo, PiLinkSimple, PiPlus, PiSubtract, PiTiktokLogo, PiTrash,
    PiTwitterLogo, PiYoutubeLogo
} from 'react-icons/pi';

export interface ProfileLinkProps {
    id: string | null;
    type: LinkType | null;
    url: string | null;
    userId: string | null;
}

export const ProfileLink = forwardRef<HTMLDivElement, ProfileLinkProps>(({ type, url }, ref) => {
    return (
        <div ref={ref} className="flex justify-between items-center self-stretch border rounded-lg">
            <p className='gap-1 py-2 h-12 w-full cursor-default overflow-x-hidden flex px-4 items-center select-none rounded-xl border border-stroke'>
                {type === LinkType.TWITTER && <PiTwitterLogo className='w-5 h-5' />}
                {type === LinkType.YOUTUBE && <PiYoutubeLogo className='w-5 h-5' />}
                {type === LinkType.TIKTOK && <PiTiktokLogo className='w-5 h-5' />}
                {type === LinkType.DISCORD && <PiDiscordLogo className='w-5 h-5' />}
                {type === LinkType.INSTAGRAM && <PiInstagramLogo className='w-5 h-5' />}
                {type === LinkType.GITHUB && <PiGithubLogo className='w-5 h-5' />}
                {type === LinkType.WEBSITE && <PiLinkSimple className='w-5 h-5' />}
                <span className='underline'>{url}</span>
            </p>
            <div className="flex p-3 items-center gap-10 self-stretch bg-gray-100">https://</div>
            <input className="flex items-center gap-4 p-3 py-4 flex-1 self-stretch" placeholder="example.com" />
        </div>
    )
})