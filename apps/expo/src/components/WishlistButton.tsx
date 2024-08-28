import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function WishlistButton({ post }) {
    const handleWishlist = () => {
        // Implement wishlist functionality
    };

    return (
        <TouchableOpacity onPress={handleWishlist}>
            <Ionicons name="bookmark-outline" size={24} color="white" />
        </TouchableOpacity>
    );
}