import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { formatImage } from '~/utils/image-src-format.util';
import { getPostTypeName } from '~/utils/names.util';
import { Avatar } from '../Avatar';
import { LikeButton } from './post/LikeButton';
import { ReactButton } from './post/ReactButton';
import { WishlistButton } from './post/WishlistButton';

const { width, height } = Dimensions.get('window');

export function Post({ post }: { post: any }) {
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
            <View style={styles.contentContainer}>
                <View style={styles.userInfoContainer}>
                    <View style={styles.userInfo}>
                        <Avatar
                            image={post.user.image}
                            id={post.user.id}
                            username={post.user.username}
                            size="xs"
                        />
                        <Text style={styles.username}>{post.user.username}</Text>
                    </View>
                    <Text style={styles.caption}>{post.caption}</Text>
                </View>
                <View style={styles.actions}>
                    <LikeButton post={post} />
                    <ReactButton post={post} />
                    <WishlistButton post={post} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    contentContainer: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginBottom: 120
    },
    userInfoContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    userInfo: {
        flexDirection: 'row',
    },
    username: {
        color: 'white',
        marginLeft: 5,
        fontWeight: 'bold',
    },
    caption: {
        color: 'white',
        marginTop: 5,
    },
    actions: {
        justifyContent: 'flex-end',
    },
});