// Service Worker for Offline Support and Caching
const CACHE_NAME = 'taseron-hakedis-v1.2';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline use
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/css/main.css',
    '/assets/css/mobile.css',
    '/src/app.js',
    '/src/storage.js',
    '/src/notifications.js',
    '/src/router.js',
    '/components/header.js',
    '/components/sidebar.js',
    '/components/modal.js',
    '/pages/dashboard.js',
    '/pages/data-entry.js',
    '/pages/quality.js',
    '/pages/approval.js',
    '/data/sample-data.js',
    '/assets/icons/icon-192.png',
    '/assets/icons/icon-512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Dynamic cache patterns
const CACHE_PATTERNS = {
    images: /\.(jpg|jpeg|png|gif|webp|svg)$/i,
    fonts: /\.(woff|woff2|ttf|eot)$/i,
    api: /\/api\//,
    external: /^https:\/\/(cdnjs|fonts|unpkg)/
};

// Background sync tags
const SYNC_TAGS = {
    HAKEDIS_SYNC: 'background-sync-hakedis',
    QUALITY_SYNC: 'background-sync-quality',
    APPROVAL_SYNC: 'background-sync-approval',
    NOTIFICATION_SYNC: 'background-sync-notifications'
};

// Install event - cache static resources
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching static resources...');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('Static resources cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Cache installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all clients
            self.clients.claim()
        ]).then(() => {
            console.log('Service Worker activated successfully');
            // Notify clients about cache update
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'CACHE_UPDATED',
                        message: 'App updated and ready to use offline'
                    });
                });
            });
        })
    );
});

// Fetch event - handle network requests with caching strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!request.url.startsWith('http')) {
        return;
    }

    // Different strategies for different types of requests
    if (STATIC_CACHE_URLS.includes(url.pathname) || url.pathname === '/') {
        // Cache first strategy for static resources
        event.respondWith(cacheFirstStrategy(request));
    } else if (CACHE_PATTERNS.images.test(url.pathname)) {
        // Cache first for images
        event.respondWith(cacheFirstStrategy(request));
    } else if (CACHE_PATTERNS.fonts.test(url.pathname)) {
        // Cache first for fonts
        event.respondWith(cacheFirstStrategy(request));
    } else if (CACHE_PATTERNS.external.test(url.origin)) {
        // Stale while revalidate for external resources
        event.respondWith(staleWhileRevalidateStrategy(request));
    } else if (CACHE_PATTERNS.api.test(url.pathname)) {
        // Network first for API calls
        event.respondWith(networkFirstStrategy(request));
    } else {
        // Network first with offline fallback for other requests
        event.respondWith(networkFirstWithOfflineFallback(request));
    }
});

// Caching Strategies

// Cache First - serve from cache, fallback to network
async function cacheFirstStrategy(request) {
    try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('Cache first strategy failed:', error);
        return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Network First - try network, fallback to cache
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('Network failed, trying cache:', request.url);
        
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline response for API calls
        return new Response(JSON.stringify({
            error: 'Offline',
            message: 'This request requires internet connection',
            offline: true
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Stale While Revalidate - serve from cache, update in background
async function staleWhileRevalidateStrategy(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    // Fetch from network in background
    const networkResponsePromise = fetch(request).then(response => {
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => {
        // Network failed, but we might have cache
        return null;
    });
    
    // Return cached version immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Wait for network if no cache
    return networkResponsePromise || new Response('Offline', { status: 503 });
}

// Network First with Offline Fallback
async function networkFirstWithOfflineFallback(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        // Try cache first
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            const offlineResponse = await cache.match(OFFLINE_URL);
            if (offlineResponse) {
                return offlineResponse;
            }
            
            // Fallback offline page
            return new Response(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Çevrimdışı - Taşeron Hakediş</title>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            text-align: center; 
                            padding: 50px; 
                            background: #f5f5f5;
                        }
                        .offline-container {
                            max-width: 400px;
                            margin: 0 auto;
                            background: white;
                            padding: 40px;
                            border-radius: 10px;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                        .offline-icon {
                            font-size: 64px;
                            color: #666;
                            margin-bottom: 20px;
                        }
                        h1 { color: #333; margin-bottom: 10px; }
                        p { color: #666; margin-bottom: 20px; }
                        .retry-btn {
                            background: #1F4E79;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                        }
                        .retry-btn:hover { background: #164066; }
                    </style>
                </head>
                <body>
                    <div class="offline-container">
                        <div class="offline-icon">📱</div>
                        <h1>Çevrimdışı</h1>
                        <p>İnternet bağlantınızı kontrol edin ve tekrar deneyin.</p>
                        <button class="retry-btn" onclick="window.location.reload()">
                            Tekrar Dene
                        </button>
                    </div>
                </body>
                </html>
            `, {
                headers: { 'Content-Type': 'text/html' }
            });
        }
        
        return new Response('Offline', { status: 503 });
    }
}

// Background Sync - handle offline data synchronization
self.addEventListener('sync', event => {
    console.log('Background sync triggered:', event.tag);
    
    switch (event.tag) {
        case SYNC_TAGS.HAKEDIS_SYNC:
            event.waitUntil(syncHakedisData());
            break;
        case SYNC_TAGS.QUALITY_SYNC:
            event.waitUntil(syncQualityData());
            break;
        case SYNC_TAGS.APPROVAL_SYNC:
            event.waitUntil(syncApprovalData());
            break;
        case SYNC_TAGS.NOTIFICATION_SYNC:
            event.waitUntil(syncNotificationData());
            break;
        default:
            console.log('Unknown sync tag:', event.tag);
    }
});

// Sync Functions
async function syncHakedisData() {
    try {
        console.log('Syncing hakedis data...');
        
        // Get offline data from IndexedDB
        const offlineData = await getOfflineData('hakedis');
        
        if (offlineData.length === 0) {
            console.log('No hakedis data to sync');
            return;
        }
        
        // Send each item to server
        for (const item of offlineData) {
            try {
                const response = await fetch('/api/hakedis', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item)
                });
                
                if (response.ok) {
                    // Remove from offline storage
                    await removeOfflineData('hakedis', item.id);
                    console.log('Hakedis synced:', item.id);
                } else {
                    console.error('Sync failed for hakedis:', item.id);
                }
            } catch (error) {
                console.error('Network error syncing hakedis:', error);
                break; // Stop syncing if network fails
            }
        }
        
        // Notify clients about sync completion
        notifyClients('HAKEDIS_SYNC_COMPLETE', { count: offlineData.length });
        
    } catch (error) {
        console.error('Hakedis sync error:', error);
    }
}

async function syncQualityData() {
    try {
        console.log('Syncing quality data...');
        
        const offlineData = await getOfflineData('quality');
        
        if (offlineData.length === 0) {
            console.log('No quality data to sync');
            return;
        }
        
        for (const item of offlineData) {
            try {
                // Handle photo uploads separately
                if (item.photos && item.photos.length > 0) {
                    await syncPhotos(item.photos);
                }
                
                const response = await fetch('/api/quality', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item)
                });
                
                if (response.ok) {
                    await removeOfflineData('quality', item.id);
                    console.log('Quality data synced:', item.id);
                }
            } catch (error) {
                console.error('Network error syncing quality:', error);
                break;
            }
        }
        
        notifyClients('QUALITY_SYNC_COMPLETE', { count: offlineData.length });
        
    } catch (error) {
        console.error('Quality sync error:', error);
    }
}

async function syncApprovalData() {
    try {
        console.log('Syncing approval data...');
        
        const offlineData = await getOfflineData('approvals');
        
        if (offlineData.length === 0) {
            console.log('No approval data to sync');
            return;
        }
        
        for (const item of offlineData) {
            try {
                const response = await fetch('/api/approvals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item)
                });
                
                if (response.ok) {
                    await removeOfflineData('approvals', item.id);
                    console.log('Approval synced:', item.id);
                }
            } catch (error) {
                console.error('Network error syncing approval:', error);
                break;
            }
        }
        
        notifyClients('APPROVAL_SYNC_COMPLETE', { count: offlineData.length });
        
    } catch (error) {
        console.error('Approval sync error:', error);
    }
}

async function syncNotificationData() {
    try {
        console.log('Syncing notification data...');
        
        const offlineData = await getOfflineData('notifications');
        
        for (const item of offlineData) {
            try {
                const response = await fetch('/api/notifications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item)
                });
                
                if (response.ok) {
                    await removeOfflineData('notifications', item.id);
                }
            } catch (error) {
                console.error('Network error syncing notification:', error);
                break;
            }
        }
        
    } catch (error) {
        console.error('Notification sync error:', error);
    }
}

async function syncPhotos(photos) {
    for (const photo of photos) {
        try {
            const formData = new FormData();
            formData.append('photo', photo.blob, photo.filename);
            formData.append('metadata', JSON.stringify(photo.metadata));
            
            const response = await fetch('/api/photos', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                console.log('Photo synced:', photo.id);
            }
        } catch (error) {
            console.error('Photo sync error:', error);
        }
    }
}

// IndexedDB helpers for offline data
async function getOfflineData(storeName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('TaseronOfflineDB', 1);
        
        request.onerror = () => reject(request.error);
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const getAllRequest = store.getAll();
            
            getAllRequest.onsuccess = () => resolve(getAllRequest.result);
            getAllRequest.onerror = () => reject(getAllRequest.error);
        };
        
        request.onupgradeneeded = () => {
            const db = request.result;
            
            // Create object stores if they don't exist
            const storeNames = ['hakedis', 'quality', 'approvals', 'notifications', 'photos'];
            storeNames.forEach(name => {
                if (!db.objectStoreNames.contains(name)) {
                    db.createObjectStore(name, { keyPath: 'id' });
                }
            });
        };
    });
}

async function removeOfflineData(storeName, id) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('TaseronOfflineDB', 1);
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const deleteRequest = store.delete(id);
            
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
        };
    });
}

// Push notification handling
self.addEventListener('push', event => {
    console.log('Push notification received');
    
    let notificationData = {
        title: 'Taşeron Hakediş',
        body: 'Yeni bildirim',
        icon: '/assets/icons/icon-192.png',
        badge: '/assets/icons/icon-96.png',
        tag: 'default'
    };
    
    if (event.data) {
        try {
            const data = event.data.json();
            notificationData = { ...notificationData, ...data };
        } catch (error) {
            console.error('Error parsing push data:', error);
        }
    }
    
    event.waitUntil(
        self.registration.showNotification(notificationData.title, {
            body: notificationData.body,
            icon: notificationData.icon,
            badge: notificationData.badge,
            tag: notificationData.tag,
            data: notificationData.data || {},
            actions: notificationData.actions || [],
            requireInteraction: notificationData.requireInteraction || false
        })
    );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked:', event.notification.tag);
    
    event.notification.close();
    
    const notificationData = event.notification.data || {};
    
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            // Check if app is already open
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    // Focus existing window and send message
                    client.postMessage({
                        type: 'NOTIFICATION_CLICK',
                        notification: notificationData
                    });
                    return client.focus();
                }
            }
            
            // Open new window if app is not open
            if (clients.openWindow) {
                const url = notificationData.url || '/';
                return clients.openWindow(url);
            }
        })
    );
});

// Notification action handling
self.addEventListener('notificationclick', event => {
    if (event.action) {
        console.log('Notification action clicked:', event.action);
        
        event.notification.close();
        
        // Handle different actions
        switch (event.action) {
            case 'approve':
                // Handle approval action
                event.waitUntil(handleApprovalAction(event.notification.data));
                break;
            case 'view':
                // Handle view action
                event.waitUntil(handleViewAction(event.notification.data));
                break;
            default:
                console.log('Unknown action:', event.action);
        }
    }
});

async function handleApprovalAction(data) {
    try {
        // Quick approval without opening app
        const response = await fetch('/api/quick-approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: data.itemId })
        });
        
        if (response.ok) {
            // Show success notification
            self.registration.showNotification('Onay Tamamlandı', {
                body: 'Öğe başarıyla onaylandı',
                icon: '/assets/icons/icon-192.png',
                tag: 'approval-success'
            });
        }
    } catch (error) {
        console.error('Quick approval failed:', error);
    }
}

async function handleViewAction(data) {
    // Open app to specific item
    const url = `/?view=${data.type}&id=${data.itemId}`;
    clients.openWindow(url);
}

// Utility function to notify all clients
function notifyClients(type, data) {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({ type, data });
        });
    });
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
    console.log('Periodic sync triggered:', event.tag);
    
    if (event.tag === 'periodic-sync') {
        event.waitUntil(performPeriodicSync());
    }
});

async function performPeriodicSync() {
    try {
        // Sync all offline data
        await Promise.all([
            syncHakedisData(),
            syncQualityData(),
            syncApprovalData(),
            syncNotificationData()
        ]);
        
        console.log('Periodic sync completed');
    } catch (error) {
        console.error('Periodic sync failed:', error);
    }
}

// Handle messages from main thread
self.addEventListener('message', event => {
    console.log('Service Worker received message:', event.data);
    
    switch (event.data.type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
        case 'CACHE_URLS':
            event.waitUntil(cacheUrls(event.data.urls));
            break;
        case 'CLEAR_CACHE':
            event.waitUntil(clearCache());
            break;
        default:
            console.log('Unknown message type:', event.data.type);
    }
});

async function cacheUrls(urls) {
    const cache = await caches.open(CACHE_NAME);
    return cache.addAll(urls);
}

async function clearCache() {
    const cacheNames = await caches.keys();
    return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
}

console.log('Service Worker loaded successfully');