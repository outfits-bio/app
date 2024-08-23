import { NextApiRequest, NextApiResponse } from 'next';
import webpush from 'web-push';

webpush.setVapidDetails(
    'mailto:your-email@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '',
    process.env.VAPID_PRIVATE_KEY ?? ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { subscription, payload } = req.body;

        try {
            await webpush.sendNotification(subscription as webpush.PushSubscription, payload);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error sending push notification:', error);
            res.status(500).json({ error: 'Failed to send push notification' });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}