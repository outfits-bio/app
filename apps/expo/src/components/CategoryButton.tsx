import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { PostType } from '@acme/db';
import { getPostTypeName } from "~/utils/names.util";
import { PostTypeIcon } from "./PostTypeIcon";

interface CategoryButtonProps {
    activePostTypes: PostType[];
    handleChangePostType: (type: PostType) => void;
    type: PostType;
}

export function CategoryButton({ activePostTypes, handleChangePostType, type }: CategoryButtonProps) {
    const isActive = activePostTypes.includes(type);

    return (
        <TouchableOpacity
            onPress={() => handleChangePostType(type)}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                marginRight: 10,
                backgroundColor: isActive ? '#007AFF' : '#E5E5EA',
                borderRadius: 20,
            }}
        >
            <PostTypeIcon type={type} />
            <Text style={{ marginLeft: 5, color: isActive ? 'white' : 'black' }}>
                {getPostTypeName(type)}
            </Text>
        </TouchableOpacity>
    );
}