/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

'use strict';

const AssistantV1 = require('ibm-watson/assistant/v1');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const secret = 'notsecret';

const app = express();
const port = process.env.PORT || 8080;

const DEFAULT_NAME = 'rent-a-car';
const WatsonAssistantSetup = require('./lib/watson-assistant-setup');
let setupError = '';

/**
 * Handle setup errors by logging and appending to the global error text.
 * @param {String} reason - The error message for the setup error.
 */
function handleSetupError(reason) {
  setupError += ' ' + reason;
  console.error('The app failed to initialize properly. Setup and restart needed.' + setupError);
  console.error('\nAborting due to setup error!');
  process.exit(1);
}

// Connect a client to Watson Assistant
// The SDK gets credentials from the environment.
const assistant = new AssistantV1({
  version: '2019-11-01'
});
console.log('Connected to Watson Assistant');
let workspaceID; // workspaceID will be set when the workspace is created or validated.
const assistantSetup = new WatsonAssistantSetup(assistant);
const workspaceJson = JSON.parse(fs.readFileSync('data/assistant/workspaces/rent_a_car.json'));
const assistantSetupParams = { default_name: DEFAULT_NAME, workspace_json: workspaceJson };
assistantSetup.setupAssistantWorkspace(assistantSetupParams, (err, data) => {
  if (err) {
    handleSetupError(err);
  } else {
    console.log('Watson Assistant is ready!');
    workspaceID = data;
  }
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const START_OVER = 'start over';
const CANCEL = 'goodbye';
let expectUserResponse;

/**
 * Forword input text and stored context to Watson Assistant and
 * return the response.
 *
 * @param {*} request - incoming request
 * @param {*} workspaceId - Watson Assistant workspace ID
 */
function assistantMessage(request, workspaceId) {
  if (!workspaceId) {
    const msg = 'Error talking to Watson Assistant. Workspace ID is not set.';
    console.error(msg);
    return Promise.reject(msg);
  }
  return new Promise(function(resolve, reject) {
    console.log('Incoming request:');
    console.log(request);
    // Input from Google Assistant
    let input = request.inputs[0].rawInputs[0].query;
    const intent = request.inputs[0].intent;
    const conversationType = request.conversation.type;
    console.log('Conversation type:' + conversationType);
    console.log('Google intent:' + intent);
    console.log('Input text:' + input);

    let context = {}; // Clear context and conditionally set it with stashed context
    expectUserResponse = true;
    if (intent === 'actions.intent.CANCEL') {
      // expectUserResponse must be false when action.intent.CANCEL
      expectUserResponse = false;
      input = CANCEL; // Say goodbye
    } else if (conversationType === 'NEW') {
      // Input might be "Talk to <name>". Ignore that and trigger a fresh start.
      input = START_OVER;
    } else if (request.conversation && request.conversation.conversationToken) {
      // Use conversationToken to continue the conversation.
      // Decode/verify the incoming conversationToken and use it as context.
      context = jwt.verify(request.conversation.conversationToken, secret);
      console.log('Incoming context: ');
      console.log(context);
    }

    // Forward input text to Watson Assistant
    assistant.message(
      {
        input: { text: input },
        workspace_id: workspaceId,
        context: context
      },
      function(err, watsonResponse) {
        if (err) {
          console.error(err);
          reject(Error('Error talking to Watson Assistant.'));
        } else {
          console.log(watsonResponse);
          context = watsonResponse.context; // Update global context
          resolve(watsonResponse);
        }
      }
    );
  });
}

/**
 * Format the response for Google Assistant.
 *
 * @param {*} response - Response from Watson Assistant
 */
function formatResponse(response) {
  // store context in conversationToken
  const conversationToken = jwt.sign(response.context, secret);

  // Combine the output messages into one message.
  const output = response.output.text.join(' ');

  // Build the response JSON
  const richResponse = {
    items: [
      {
        simpleResponse: {
          textToSpeech: output
        }
      }
    ],
    suggestions: []
  };
  const resp = {
    conversationToken: conversationToken,
    expectUserResponse: expectUserResponse
  };

  if (expectUserResponse) {
    resp.expectedInputs = [
      {
        inputPrompt: {
          richInitialPrompt: richResponse
        },
        possibleIntents: [
          {
            intent: 'actions.intent.TEXT'
          }
        ]
      }
    ];
  } else {
    const s = output.substring(0, 59); // Has to be < 60 chars.  :(
    resp.finalResponse = { speechResponse: { textToSpeech: s } };
  }

  console.log('Response:');
  console.log(resp);
  return resp;
}

// GET: Just show something on the default app URL page
app.get('/', (req, res) => res.send('Watson for Google Assistant app is running.'));

// POST: Requests from Google Assistant
app.post('/', function(args, res) {
  return new Promise(function(resolve, reject) {
    const request = args.body;
    console.log('Google Assistant is calling');
    console.log(JSON.stringify(request, null, 2));
    assistantMessage(request, workspaceID)
      .then(resp => {
        res.setHeader('Content-Type', 'application/json');
        res.append('Google-Assistant-API-Version', 'v2');
        res.json(formatResponse(resp));
      })
      .catch(function(err) {
        console.error('Error!');
        console.dir(err);
      });
  });
});

// Start the HTTP server
app.listen(port);
console.log('HTTP server started on port ' + port);
