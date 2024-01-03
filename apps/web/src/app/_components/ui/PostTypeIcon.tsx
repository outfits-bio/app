import { PostType } from 'database';
import React, { forwardRef } from 'react';
import { PiBackpackBold, PiBaseballCapBold, PiCoatHangerBold, PiEyeglassesBold, PiPantsBold, PiShirtFoldedBold, PiSneakerBold, PiTShirtBold, PiWatchBold } from 'react-icons/pi';

export interface PostTypeIconProps extends React.HTMLAttributes<HTMLDivElement> {
    type: PostType;
}

export const PostTypeIcon = forwardRef<HTMLDivElement, PostTypeIconProps>(({ className, type, ...props }, ref) => {
    switch (type) {
        case PostType.OUTFIT:
            return <PiCoatHangerBold ref={ref} {...props} classname={className} />;
        case PostType.HOODIE:
            return <PiShirtFoldedBold ref={ref} {...props} classname={className} />;
        case PostType.SHIRT:
            return <PiTShirtBold ref={ref} {...props} classname={className} />;
        case PostType.PANTS:
            return <PiPantsBold ref={ref} {...props} classname={className} />;
        case PostType.SHOES:
            return <PiSneakerBold ref={ref} {...props} classname={className} />;
        case PostType.WATCH:
            return <PiBackpackBold ref={ref} {...props} classname={className} />;
        case PostType.HEADWEAR:
            return <PiBaseballCapBold ref={ref} {...props} classname={className} />;
        case PostType.JEWELRY:
            return <PiWatchBold ref={ref} {...props} classname={className} />;
        case PostType.GLASSES:
            return <PiEyeglassesBold ref={ref} {...props} classname={className} />;
    }
});

PostTypeIcon.displayName = 'PostTypeIcon';