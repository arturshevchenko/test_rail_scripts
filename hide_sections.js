name: Hide_Sections
description: Hides sections in a test run
author: Artur Shevchenko
version: 1.0
includes: ^(suites|runs)/view
excludes: 

js:
$(document).ready(
	function() {
		var clicked = false;
		/* Create the button */
		var button = $('<div class="toolbar content-header-toolbar"><a class="toolbar-button toolbar-button-last toolbar-button-first content-header-button button-columns" href="javascript:void(0)">Sections</a></div>');

		/* Add it to the toolbar */
		$("#content-header .content-header-inner").prepend(button);		

		/* Bind the click event to trigger the automated tests */
		$("a", button).click(
			function(){
				if(clicked){
					$('#sidebar').show();
					clicked = false;
				} else {
					$('#sidebar').hide();
					clicked = true;
				}
			}
		);
	}
);