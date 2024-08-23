// @ts-ignore
self.addEventListener('push', event => {
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
});

// @ts-ignore
self.addEventListener('notificationclick', event => {
    // @ts-ignore
    event.notification.close();
    // @ts-ignore
    event.waitUntil(
        // @ts-ignore
        clients.openWindow('/')
    );
});