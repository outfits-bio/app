import { getPostTypeName } from "@acme/utils/names.util";
import type { PostType } from "@acme/db";
import { Button } from "../ui/Button";
import { PostTypeIcon } from "../ui/PostTypeIcon";


interface CategoryButtonProps {
    activePostTypes: PostType[];
    handleChangePostType: (type: PostType) => void;
    type: PostType;
}

export function CategoryButton({ activePostTypes, handleChangePostType, type }: CategoryButtonProps) {

    return <Button
        onClick={() => handleChangePostType(type)}
        variant={activePostTypes.includes(type) ? 'primary' : 'ghost'}
        iconLeft={<PostTypeIcon type={type} />}
        className="justify-start"
    >
        {getPostTypeName(type)}
    </Button>
}