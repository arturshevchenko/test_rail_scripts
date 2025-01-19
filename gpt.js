name: AI Test Cases
description: Generates Test Cases
author: Artur Shevchenko
version: 1.0
includes: ^suites/view
excludes: 

js:
$(document).ready(function () {

  const gpt_token = "token";

  /* Create the button HTML */
  var buttonHTML =`
    <div id="gpt-button" class="toolbar content-header-toolbar">
      <a class="toolbar-button toolbar-button-last toolbar-button-first content-header-button button-start" href="javascript:void(0)">
        Open AI Generator
      </a>
    </div>`;

  /* Add it to the toolbar using innerHTML */
  $("#content-header .content-header-inner").prepend(buttonHTML);

  /* Create the dialog HTML (initially hidden) */
  var dialogHTML =`
    <div id="gpt-dialog">
      <h3>Generate Test Scenarios</h3>
      <input id="gpt-input" type="text" class="form-control form-fields" name="gpt-input" autocomplete="off" maxlength="200">
      <div contenteditable="true" class="form-control form-control-full field-editor" id="gpt-input_area" placeholder="" element-index="2" autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"></div>
      <br>
      <br>
      <button id="generate-button">Generate</button>
      <button id="close-dialog" style="margin-left: 10px;">Close</button>
      <button id="refresh-button" style="margin-left: 10px;">Refresh</button>
      <div id="gpt-results"></div>
      <div id="loader" class="spinner" style="display: none;"></div>
    </div>`;

  $("body").append(dialogHTML);

  $(document).on("click", "#gpt-button", function () {
    $("#gpt-dialog").show();
  });

  $(document).on("click", "#close-dialog", function () {
    $("#gpt-dialog").hide();
  });

  $(document).on("click", "#refresh-button", function () {
    // Clear the input field
    $("#gpt-input_area").text("");
    // Clear the results
    $("#gpt-results").html(""); 
    $("#gpt-results").hide();
  });

  $(document).on("click", "#generate-button", async function () {
    $("#loader").show();
    $("#gpt-results").hide();
    var inputText = $("#gpt-input_area").text();
    /* Send request to GPT API */
    const url = "https://api.openai.com/v1/chat/completions";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${gpt_token}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "test_cases",
            schema: {
              type: "object",
              properties: {
                testCases: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["testCases"],
              additionalProperties: false,
            },
          },
        },
        messages: [
          {
            role: "system",
            content: `You are a test engineer focused on test design. 
            You know all about test design techniques, especially Boundary Value Conditions and Equivalence Partitions. 
            Generate a list of test case titles in the format of a checklist. 
            Each title should represent a high-level test scenario for the feature described below. 
            Focus on covering different aspects such as functionality, validation, error handling, and performance. 
            Generate as much as you can. 
            Example: 'Admin can add new regular user'; 'Admin can add user with long name'; 'Admin cannot add user without a name'; 'Verify that the user can successfully sign up with valid credentials'`,
          },
          {
            role: "user",
            content: inputText,
          },
        ],
      }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      const json_response = JSON.parse(data.choices[0].message.content);
      const testScenarios = json_response.testCases;

      /* Display the test scenarios as a list with checkboxes */
      var resultsHTML = "<ul>";
      testScenarios.forEach(function (scenario) {
        resultsHTML += `
          <li>
            <div class="icon-copyblank" id="copy_test"></div>
            <input type="checkbox" style="display:none;"> 
            ${scenario}
          </li>
        `;
      });
      resultsHTML += "</ul>";

      $("#gpt-results").html(resultsHTML); // Show the results in the dialog
      var submitButton = `<button id='submit-button' style="display:none;">Add test scenarios</button>`;
      $("#gpt-results").append(submitButton);
    } catch (error) {
      console.error(error);
    }
    finally {
      $("#loader").hide();
      $("#gpt-results").show();
    }
  });

  $(document).on("click", "#copy_test", function () {
    $(this).removeClass('icon-copyblank').addClass('icon-button-accept');
    var parentText = $(this).parent().text().trim();
    navigator.clipboard.writeText(parentText).then(function() {
    }).catch(function(error) {
        console.error('Error copying text to clipboard:', error);
    });
  });

});


css:
/* Spinner styles */
.spinner {
  border: 4px solid #f3f3f3; 
  border-top: 4px solid #3498db; 
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  padding: 20px; 
  margin: 20px auto; 
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Dialog styles */
#gpt-dialog {
  display: none;
  position: fixed;
  top: 100px;
  right: 0px;
  background: white;
  padding: 20px;
  border: 5px solid #ccc;
  z-index: 1000;
  width: 450px;
}

/* Input and textarea styles */
#gpt-input {
  display: none;
}

#gpt-input_area {
  max-height: 300px;
}

#gpt-results {
  margin-top: 20px;
  max-width: 400px;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ccc;
  white-space: normal;
  display: none;
}

/* List item styles */
li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.icon-copyblank {
  display: inline-block;
  margin-right: 10px;
  cursor: pointer;
}


.icon-button-accept {
  display: inline-block;
  width: 15px;
  height: 15px;
  margin-right: 10px;
}