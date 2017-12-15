// Service Worker sw.js

var CACHE_STATIC_NAME = 'static-v0.2';
var CACHE_DYNAMIC_NAME = 'dynamic-v0.2';

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Install service worker', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(function(cache) {
      console.log('[Service Worker] Precaching App Shell');
      cache.addAll([
        '/',
        '/index.html',
        '/add_to_homescreen.html',
        '/push_notification_permission.html',
        '/push_notification.html',
        '/weirdform.html',
        '/css/font-awesome.min.css',
        '/css/materialize.css',
        '/css/style.css',
        '/js/jquery.min.js',
        '/js/main.js',
        '/js/materialize.js',
        '/js/nav.js',
        '/js/add_to_homescreen.js',
        '/js/push_notification_permission.js',
        '/js/push_notification.js',
        '/images/pwa/add_to_homescreen1.png',
        '/images/pwa/add_to_homescreen2.png',
        '/images/pwa/notification1.png',
        '/images/pwa/notification2.png',
        'https://fonts.googleapis.com/icon?family=Material+Icons'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating service worker...', event);
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(
        keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // console.log("[Service Worker] Fetching something...", event);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request)
          .then(function(res) {
            return caches.open(CACHE_DYNAMIC_NAME).then(function(cache) {
              cache.put(event.request.url, res.clone());
              return res;
            });
          })
          .catch(function(err) {});
      }
    })
  );
});

// PUSH NOTIFICATION
self.addEventListener('notificationclick', function(event) {
  var notification = event.notification;
  var action = event.action;

  console.log(notification);

  if (action === 'confirm') {
    console.log('Confirm was chosen');
    notification.close();
  } else {
    console.log(action);
  }
});

// NOTIFICATION CLOSE
self.addEventListener('notificationclose', function(event) {
  console.log('Notification close: ', event);
});

self.addEventListener('push', function(event) {
  console.log('Push Notification Received', event);
  var data = {
    title: 'New MESSAGE!!!!',
    content: 'Come check the details!!!'
  };

  // if (event.data) {
  //   data = JSON.parse(event.data.text());
  // }

  var options = {
    body: 'PUSH EVENT',
    icon: '/images/icons/icon-96x96.png',
    badge: '/images/icons/icon-96x96.png'
  };

  event.waitUntil(self.registration.showNotification('TITLE', options));
});
