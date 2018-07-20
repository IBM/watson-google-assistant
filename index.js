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

const AssistantV1 = require('watson-developer-cloud/assistant/v1');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const secret = 'notsecret';

const app = express();
const port = process.env.PORT || 8080;

require('dotenv').config();

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
  // We could allow our chatbot to run. It would just report the above error.
  // Or we can add the following 2 lines to abort on a setup error allowing Bluemix to restart it.
  console.error('\nAborting due to setup error!');
  process.exit(1);
}

// Connect a client to Watson Assistant
// The SDK gets credentials from the environment.
const assistant = new AssistantV1({ version: '2018-02-16' });
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

let context;
let Wresponse;
let expectUserResponse;
const START_OVER = 'start over';

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
    console.log('REQUEST:');
    console.log(request);
    // Input from Google Assistant
    let input = request.inputs[0] ? request.inputs[0].rawInputs[0].query : START_OVER;

    if (request.conversation && request.conversation.type === 'NEW') {
      // If NEW conversation, reset context and trigger start over intent
      input = START_OVER;
      context = {};
    } else if (request.conversation && request.conversation.conversationToken) {
      // Use conversationToken to track Watson Assistant context
      context = jwt.verify(request.conversation.conversationToken, secret);
      console.log('CONTEXT');
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
          reject('Error talking to Watson Assistant.');
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
 * Prepare/resolve the response for Google Assistant.
 *
 * @param {*} response - Response from Watson Assistant
 * @param {*} resolve - Promise resolve to complete
 */
function sendResponse(response, resolve) {
  // store context in conversationToken
  const conversationToken = jwt.sign(context, secret);

  // Combine the output messages into one message.
  const output = response.output.text.join(' ');
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

  console.log(resp);
  Wresponse = resp;
  // Resolve the main promise now that we have our response
  resolve(resp);
}

app.post('/', function(args, res) {
  return new Promise(function(resolve, reject) {
    const request = args.body;
    console.log('Google Home is calling');
    console.log(JSON.stringify(request, null, 2));
    // Expect response must be false for action.intent.CANCEL
    expectUserResponse = !(request.inputs[0] && request.inputs[0].intent === 'actions.intent.CANCEL');
    assistantMessage(request, workspaceID)
      .then(actionResponse => sendResponse(actionResponse, resolve))
      .then(data => {
        res.setHeader('Content-Type', 'application/json');
        res.append('Google-Assistant-API-Version', 'v2');
        res.json(Wresponse);
      })
      .catch(function(err) {
        console.error('Erreur !');
        console.dir(err);
      });
  });
});

// start the http server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
