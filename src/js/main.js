$(document).ready(function() {
  // REQUIRED FOR BUTTON COLLAPSE
  $(".button-collapse").sideNav();
});

var toggleStatus = false;
$('#menu').click(function() {
  if (toggleStatus === true) {
    $('.tap-target').tapTarget('close');
    toggleStatus = false;
  } else {
    $('.tap-target').tapTarget('open');
    toggleStatus = true;    
  }
});
