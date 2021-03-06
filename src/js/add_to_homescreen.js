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

window.onload = function() {
  prompt();
};

var deferredPrompt;

function prompt() {
  var btnSave = document.getElementById('btnSave');

  window.addEventListener('beforeinstallprompt', function(e) {
    console.log('beforeinstallprompt Event fired');
    e.preventDefault();

    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    document.getElementById('test').innerHTML +=
      '<br><strong>ADD TO HOMESCREEN SUPPORTED</strong>';
    return false;
  });

  btnSave.addEventListener('click', function() {
    if (deferredPrompt !== undefined) {
      console.log('deferredPrompt', deferredPrompt);
      // The user has had a positive interaction with our app and Chrome
      // has tried to prompt previously, so let's show the prompt.
      deferredPrompt.prompt();

      // Follow what the user has done with the prompt.
      deferredPrompt.userChoice.then(function(choiceResult) {
        console.log(choiceResult.outcome);

        if (choiceResult.outcome == 'dismissed') {
          console.log('User cancelled home screen install');
        } else {
          console.log('User added to home screen');
        }

        // We no longer need the prompt.  Clear it up.

        deferredPrompt = null;
        remove(btnSave);
      });
    }
  });

  function remove(elem) {
    return elem.parentNode.removeChild(elem);
  }
}
