import React from 'react';
import { PostType } from '@acme/db';
import { Ionicons } from '@expo/vector-icons';

interface PostTypeIconProps {
    type: PostType;
}

export function PostTypeIcon({ type }: PostTypeIconProps) {
    let iconName;

    switch (type) {
        case 'OUTFIT':
            iconName = 'shirt-outline';
            break;
        // Add more cases for other post types
        default:
            iconName = 'help-outline';
    }

    return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={24} color="black" />;
}