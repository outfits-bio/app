import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function LikeButton({ post }) {
    const handleLike = () => {
        // Implement like functionality
    };

    return (
        <TouchableOpacity onPress={handleLike}>
            <Ionicons name="heart-outline" size={24} color="white" />
        </TouchableOpacity>
    );
}