// Service Worker sw.js

self.addEventListener('install', function(event) {
    console.log("[Service Worker] Install service worker", event );
  });
  
self.addEventListener('activate', function(event) {
  console.log("[Service Worker] Activating service worker...", event );
  return self.clients.claim();
});
  
self.addEventListener('fetch', function(event) {
  // console.log("[Service Worker] Fetching something...", event);
  event.respondWith(fetch(event.request));
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

self.addEventListener('notificationclose', function(event) {
  console.log('Notification close: ', event)
})

self.addEventListener('push', function(event) {
    console.log("Push Notification Received", event);
    var data = {title: "New MESSAGE!!!!", content: "Come check the details!!!"};
    
    if (event.data) {
      data = JSON.parse(event.data.text());
    }

    var options = {
      body: data.content,
      icon: "/images/icons/icon-96x96.png",
      badge: "/images/icons/icon-96x96.png"
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
});