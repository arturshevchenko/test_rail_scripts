name: Hide chart
description: Hides unused chart
author: Artur Shevchenko
version: 1.0
includes: ^dashboard
excludes: 

js:
$(document).ready(
  function() {
    $('#actionContainer').remove();
  }
);