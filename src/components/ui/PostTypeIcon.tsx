import { PostType } from "database";
import {
  PiBackpackBold,
  PiBaseballCapBold,
  PiCoatHangerBold,
  PiEyeglassesBold,
  PiPantsBold,
  PiShirtFoldedBold,
  PiSneakerBold,
  PiTShirtBold,
  PiWatchBold,
} from "react-icons/pi";

export interface PostTypeIconProps
  extends React.HTMLAttributes<HTMLDivElement> {
  type: PostType;
}

export const PostTypeIcon = ({ className, type }: PostTypeIconProps) => {
  switch (type) {
    case PostType.OUTFIT:
      return <PiCoatHangerBold className={className} />;
    case PostType.HOODIE:
      return <PiShirtFoldedBold className={className} />;
    case PostType.SHIRT:
      return <PiTShirtBold className={className} />;
    case PostType.PANTS:
      return <PiPantsBold className={className} />;
    case PostType.SHOES:
      return <PiSneakerBold className={className} />;
    case PostType.WATCH:
      return <PiBackpackBold className={className} />;
    case PostType.HEADWEAR:
      return <PiBaseballCapBold className={className} />;
    case PostType.JEWELRY:
      return <PiWatchBold className={className} />;
    case PostType.GLASSES:
      return <PiEyeglassesBold className={className} />;
  }
};

PostTypeIcon.displayName = "PostTypeIcon";
