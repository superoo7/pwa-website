// HELP FUNCTION
function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
  
    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray; 
  }
// HELP FUNCTION

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
        }
    // } else {
    //     var notificationContent = {
    //         body: "Successfully subscribed to PWA example website!",
    //         icon: "/images/icons/icon-96x96.png"
    //     };
    //     new Notification('Subscribed! (x SW)', notificationContent);
    // }
}

function configPushSub() {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    var reg;
    navigator.serviceWorker.ready
    .then(function(swreg) {
      reg = swreg;
      console.log(swreg.pushManager.getSubscription());
      return swreg.pushManager.getSubscription();
    })
    .then(function(sub) {
      if (sub === null) {
        console.log("new sub");
        // Create a new subscription
        var vapidPublicKey = 'BGcLdyeCD0TYPcnhWYpyenUECMuS802Ic7m-_Ktm8YvrCJdmqqnpVJK4T_GZAgTVZP7K4ACjY_kIbTkqCrT4RQE';
        var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
        var result = reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidPublicKey
        });
        console.log(JSON.stringify(result));
        return result;
      } else {
        console.log("WE HAVE SUB");
        // We have a subscription
      }
    })
    .then(function(newSub) {
      return fetch('https://superoo7-pwa.firebaseio.com/subscriptions.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newSub)
      })
    })
    .then(function(res) {
      if (res.ok) {
        sampleNotification();
      }
    })
    .catch(function(err) {
      console.log(err);
    });



    // navigator.serviceWorker.ready
    //     .then(function(swreg) {
    //         reg = sw;
    //         return swreg.pushManager.getSubscription();
    //     })
    //     .then(function(sub) {
    //         if (sub === null) {
    //             // Create a new subscription
    //             var VAPID_PUBLIC_KEY = "BGcLdyeCD0TYPcnhWYpyenUECMuS802Ic7m-_Ktm8YvrCJdmqqnpVJK4T_GZAgTVZP7K4ACjY_kIbTkqCrT4RQE";
    //             var converted_vapid = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    //             return reg.pushManager.subscribe({
    //                 userVisibleOnly: true,
    //                 applicationServerKey: converted_vapid
    //             });
    //         } else {
    //             // If subscription exist
    //         }
    //     })
    //     .then(function(newSub) {
    //         return fetch('https://superoo7-pwa.firebaseio.com/subscriptions.json', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Accept': 'application/json'
    //             },
    //             body: JSON.stringify(newSub)
    //         })

    //     })
    //     .then(function(res) {
    //         if (res.ok) {
    //             sampleNotification();
    //         }
    //     })
    //     .catch(function(err) {
    //         console.log(err);
    //     }); 
}



function notificationPermission() {
    Notification.requestPermission(function (result) {
        console.log('user choice', result);
        if (result !== 'granted') {
            console.log('No notification permission granted by user');
        } else {
            console.log('Permission granted');
            enableNotificationButton.style.display = 'none';
            document.getElementById("content").innerHTML += '<h5 class="blue white-text center">NOTIFICATION WAS ENABLED</h5>'
            configPushSub();
            // sampleNotification();
        }
    })
}