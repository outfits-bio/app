import webpush from 'web-push';

webpush.setGCMAPIKey('103953800507');
webpush.setVapidDetails(
    "mailto:support@outfits.bio",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '',
    process.env.VAPID_PRIVATE_KEY ?? ''
);

export const sendPushNotification = async (subscription: webpush.PushSubscription, payload: string) => {
    try {
        await webpush.sendNotification(subscription, payload);
        console.log('Push notification sent successfully');
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
};

export const sendPushNotificationToUser = async (userId: string, body: string, ctx: any) => {
    const subscriptions = await ctx.db.subscription.findMany({
        where: { userId: userId },
    });

    const payload = JSON.stringify({ title: 'outfits.bio', body });

    for (const subscription of subscriptions) {
        const pushSubscription: webpush.PushSubscription = {
            endpoint: subscription.endpoint,
            keys: subscription.keys as { p256dh: string; auth: string },
        };
        await sendPushNotification(pushSubscription, payload);
    }
};