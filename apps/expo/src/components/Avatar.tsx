import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { formatAvatar } from '~/utils/image-src-format.util';

interface AvatarProps {
    image?: string | null;
    id?: string;
    username?: string | null;
    size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'jumbo';
}

export function Avatar({ image, id, username, size = 'md' }: AvatarProps) {
    const dimension = getDimension(size);

    return (
        <View style={[styles.container, { width: dimension, height: dimension }]}>
            <Image
                source={{ uri: formatAvatar(image, id) }}
                style={styles.image}
                accessibilityLabel={username ?? ''}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 9999,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB', // Assuming this is the 'stroke' color
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

function getDimension(size: AvatarProps['size']): number {
    switch (size) {
        case 'xxs': return 24;
        case 'xs': return 32;
        case 'sm': return 48;
        case 'md': return 64;
        case 'lg': return 88;
        case 'jumbo': return 128; // Note: Can't do responsive sizing in React Native easily
        default: return 64;
    }
}