if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(function () {
            console.log('Service worker registered!');
        })
        .catch(function (err) {
            console.log(err);
        });
}

var enableNotificationButton = document.getElementById('notification_permission');

if ('Notification' in window) {
    enableNotificationButton.style.display = 'inline-block';
    enableNotificationButton.addEventListener("click", notificationPermission);
}

function notificationPermission() {
    Notification.requestPermission(function (result) {
        console.log('user choice', result);
        if (result !== 'granted') {
            console.log('No notification permission granted by user');
        } else {
            console.log('Permission granted');
            enableNotificationButton.style.display = 'none';
            document.getElementById("content").innerHTML += 
                '<h5 class="blue white-text center">NOTIFICATION WAS ENABLED</h5><a href="/push_notification.html" class="btn blue">Continue here...</a>';
            sampleNotification();
        }
    })
}

function sampleNotification() {
    if ('serviceWorker' in navigator) {
        var notificationContent = {
            body: "Successfully subscribed to PWA example website!",
            icon: "/images/icons/icon-96x96.png",
            image: "/images/add_to_homescreen1.png",
            dir: "ltr",
            lang: "en-US", // BCP 47
            vibrate: "200 10 300",
            badge: "/images/icons/icon-96x96.png",
            tag: "confirm-notification", // stack notification
            renotify: true, // same notification will notify again
            actions: [
                { action: 'confirm', title: 'Okay', icon: "/images/icons/icon-96x96.png" },
                { action: 'cancel', title: 'Cancel', icon: "/images/icons/icon-96x96.png" }
            ]
        };
        navigator.serviceWorker.ready
            .then(function (sw) {
                sw.showNotification('Subscribed! (SW)', notificationContent)
            });
    } else {
        var notificationContent = {
            body: "Successfully subscribed to PWA example website!",
            icon: "/images/icons/icon-96x96.png"
        };
        new Notification('Subscribed! (x SW)', notificationContent);
    }

}