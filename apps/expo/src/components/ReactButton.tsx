import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ReactButton({ post }) {
    const handleReact = () => {
        // Implement react functionality
    };

    return (
        <TouchableOpacity onPress={handleReact}>
            <Ionicons name="chatbubble-outline" size={24} color="white" />
        </TouchableOpacity>
    );
}