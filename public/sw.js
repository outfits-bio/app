self.addEventListener('push', event => {
    // @ts-ignore
    if (event.data) {
        try {
            // @ts-ignore
            const data = event.data.json();
            const options = {
                body: data.body,
                icon: '/icon-192x192.png',
            };

            // @ts-ignore
            event.waitUntil(
                // @ts-ignore
                self.registration.showNotification(data.title, options)
            );
        } catch (error) {
            console.error('Error processing push event:', error);
        }
    }
});

self.addEventListener('notificationclick', event => {
    // @ts-ignore
    event.notification.close();
    // @ts-ignore
    event.waitUntil(
        // @ts-ignore
        clients.openWindow('/')
    );
});