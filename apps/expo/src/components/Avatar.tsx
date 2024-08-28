import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

interface AvatarProps {
    image: string;
    id: string;
    username: string;
    size: 'small' | 'medium' | 'large';
}

export function Avatar({ image, id, username, size }: AvatarProps) {
    const dimension = size === 'small' ? 30 : size === 'medium' ? 40 : 50;

    return (
        <View style={[styles.container, { width: dimension, height: dimension }]}>
            <Image
                source={{ uri: image }}
                style={styles.image}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 9999,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});