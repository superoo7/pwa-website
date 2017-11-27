
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(function() {
        console.log('Service worker registered!');
      })
      .catch(function(err) {
        console.log(err);
      });
}

var enableNotificationButton = document.getElementById('notification_permission');

if ('Notification' in window) {
    enableNotificationButton.style.display = 'inline-block';
    enableNotificationButton.addEventListener("click", notificationPermission);
}

function notificationPermission() {
    Notification.requestPermission(function(result) {
        console.log('user choice', result);
        if (result !== 'granted') {
            console.log('No notification permission granted by user');
        } else {
            console.log('Permission granted');
        }
    })
}