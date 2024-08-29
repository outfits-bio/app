/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import webpush from "web-push";
import debounce from "lodash.debounce";

webpush.setGCMAPIKey("103953800507");
webpush.setVapidDetails(
    "mailto:support@outfits.bio",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "",
    process.env.VAPID_PRIVATE_KEY ?? "",
);

export const sendPushNotification = async (
    subscription: webpush.PushSubscription,
    payload: string,
) => {
    try {
        await webpush.sendNotification(subscription, payload);
        console.log("Push notification sent successfully");
    } catch (error) {
        console.error("Error sending push notification:", error);
    }
};

const notificationCooldowns = new Map<string, number>();
const lastNotificationKeys = new Map<string, string>();
const COOLDOWN_PERIOD = 60000;
const debouncedSendNotification = debounce(
    async (userId: string, body: string, ctx: any) => {
        try {
            const subscriptions = await ctx.prisma.subscription.findMany({
                where: { userId },
            });

            const payload = JSON.stringify({ title: "outfits.bio", body });

            for (const subscription of subscriptions) {
                const pushSubscription: webpush.PushSubscription = {
                    endpoint: subscription.endpoint,
                    keys: subscription.keys as { p256dh: string; auth: string },
                };
                await sendPushNotification(pushSubscription, payload);
            }
        } catch (error) {
            console.error("Error sending push notifications:", error);
        }
    },
    1000,
);

export const sendPushNotificationToUser = async (
    userId: string,
    body: string,
    ctx: any,
) => {
    const cooldownKey = `${userId}:${body}`;
    const lastNotificationTime = notificationCooldowns.get(cooldownKey) ?? 0;
    const currentTime = Date.now();

    if (currentTime - lastNotificationTime < COOLDOWN_PERIOD) {
        console.log("Notification on cooldown, skipping");
        return;
    }

    const lastKey = lastNotificationKeys.get(userId);
    if (lastKey === cooldownKey) {
        console.log("Same notification as last one, skipping");
        return;
    }

    notificationCooldowns.set(cooldownKey, currentTime);
    lastNotificationKeys.set(userId, cooldownKey);
    await debouncedSendNotification(userId, body, ctx);
};
