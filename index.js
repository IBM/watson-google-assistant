'use strict';

const AssistantV1 = require('watson-developer-cloud/assistant/v1');
const redis = require('redis');

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var bodyParser = require('body-parser');

require('dotenv').config();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Using some globals for now
let assistant;
let redisClient;
let context;
let Wresponse;

function errorResponse(reason) {
	return {
	  version: '1.0',
	  response: {
		shouldEndSession: true,
		outputSpeech: {
		  type: 'PlainText',
		  text: reason || 'An unexpected error occurred. Please try again later.'
		}
	  }
	};
  }

function initClients() {
	return new Promise(function(resolve, reject) {
	  // Connect a client to Watson Assistant
	  assistant = new AssistantV1({ version: '2018-02-16' });
	  console.log('Connected to Watson Assistant');
  
		// Connect a client to Redis 
		if (process.env.VCAP_SERVICES) {
			var env = JSON.parse(process.env.VCAP_SERVICES);
			var credentials = env["rediscloud"][0].credentials;
		}
		redisClient = redis.createClient(credentials.port, credentials.hostname, {no_ready_check: true});
	  redisClient.auth(credentials.password, function (err) {
			if (err) throw err;
	  });

	redisClient.on('connect', function() {
		console.log('Connected to Redis');
	});
	resolve("Done");
  });
  }

function assistantMessage(request, workspaceId) {
	if (!workspaceId) {
			const msg = 'Error talking to Watson Assistant. Workspace ID is not set.';
			console.error(msg);
			return Promise.reject(msg);
	}
	return new Promise(function(resolve, reject) {
	  const input = request.inputs[0] ? request.inputs[0].rawInputs[0].query : 'start skill';
		var test = {
			input: { text: input },
			workspace_id: workspaceId,
			context: context
			//context: {}
		  };
	  console.log("Input" + JSON.stringify(test,null,2));
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

function getSessionContext(sessionId) {
	console.log('sessionId: ' + sessionId); 
	return new Promise(function(resolve, reject) {
	  redisClient.get(sessionId, function(err, value) {
		if (err) {
		  console.error(err);
		  reject('Error getting context from Redis.');
		}
		// set global context
		context = value ? JSON.parse(value) : {};
		console.log('---------');
		console.log('Context Recupéré:');
		console.log(context);
		console.log('---------');
		resolve();
	  });
	});
  }
  
  function saveSessionContext(sessionId) {
		console.log('---------');
		console.log('Begin saveSessionContext ' + sessionId);
  
	// Save the context in Redis. Can do this after resolve(response).
	if (context) {
	  const newContextString = JSON.stringify(context);
	  // Saved context will expire in 600 secs.
	  redisClient.set(sessionId, newContextString, 'EX', 600);
	  console.log('Saved context in Redis');
	  console.log(sessionId);
		console.log(newContextString);
		console.log('---------');
	}
  }

function sendResponse(response, resolve) {
	
	  // Combine the output messages into one message.
	  const output = response.output.text.join(' ');
	  var resp = {
		conversationToken: null,
		expectUserResponse: true,
		expectedInputs: [
			{
				inputPrompt: {
					richInitialPrompt: {
						items: [
							{
								simpleResponse: {
									textToSpeech: output,
									displayText: output
								}
							}
						],
						suggestions: []
					}
				},
				possibleIntents: [
					{
						intent: 'actions.intent.TEXT'
					}
				]
			}
		]
	};
	
	Wresponse =  resp;
	// Resolve the main promise now that we have our response
	resolve(resp);
	}

app.post('/api/google4IBM', function(args, res) {
	return new Promise(function(resolve, reject) {
	  const request = args.body;
	  console.log("Google Home is calling");
	  console.log(JSON.stringify(request,null,2));
	  const sessionId = args.body.conversation.conversationId;
	  initClients()
	  .then(() => getSessionContext(sessionId))
	  .then(() => assistantMessage(request, process.env.WORKSPACE_ID))
	  .then(actionResponse => sendResponse(actionResponse, resolve))
	  .then(data => {
		res.setHeader('Content-Type', 'application/json');
		res.append("Google-Assistant-API-Version", "v2");
		res.json(Wresponse);
	})
	.then(() => saveSessionContext(sessionId))    
	.catch(function (err) {
		console.error('Erreur !');
		console.dir(err);
	});
	});
  });

/*
	res.setHeader('Content-Type', 'application/json')
	res.append("Google-Assistant-API-Version", "v2")
*/


// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);