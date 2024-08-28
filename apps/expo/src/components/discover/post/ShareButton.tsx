import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ShareButton({ post }: { post: any }) {
    const handleShare = () => {
        // Implement react functionality
    };

    return (
        <TouchableOpacity onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="white" />
        </TouchableOpacity>
    );
}