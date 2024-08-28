import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { formatImage } from '~/utils/image-src-format.util';
import { getPostTypeName } from '~/utils/names.util';
import { Avatar } from './Avatar';
import { LikeButton } from './LikeButton';
import { ReactButton } from './ReactButton';
import { WishlistButton } from './WishlistButton';

export function Post({ post }) {
    const [likeAnimation, setLikeAnimation] = useState(false);

    const handleDoubleTap = () => {
        setLikeAnimation(true);
        // Implement like functionality here
    };

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: formatImage(post.image, post.user.id) }}
                style={styles.image}
            />
            <View style={styles.overlay}>
                <View style={styles.userInfo}>
                    <Avatar
                        image={post.user.image}
                        id={post.user.id}
                        username={post.user.username}
                        size="small"
                    />
                    <Text style={styles.username}>{post.user.username}</Text>
                </View>
                <Text style={styles.caption}>{post.caption}</Text>
                <Text style={styles.postType}>{getPostTypeName(post.type)}</Text>
            </View>
            <View style={styles.actions}>
                <LikeButton post={post} />
                <ReactButton post={post} />
                <WishlistButton post={post} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        aspectRatio: 53 / 87,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    username: {
        color: 'white',
        marginLeft: 5,
        fontWeight: 'bold',
    },
    caption: {
        color: 'white',
        marginBottom: 5,
    },
    postType: {
        color: 'white',
        fontStyle: 'italic',
    },
    actions: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        flexDirection: 'column',
    },
});