name: Hide Unused
description: Hides unused menus
author: Gurock Software
version: 1.0
includes: 
excludes: 

js:
$(document).ready(
  function() {
    $('.top-social').remove();
    $('.top-panel ul').remove();
  }
);