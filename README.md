[![Build Status](https://travis-ci.org/IBM/watson-google-assistant.svg?branch=master)](https://travis-ci.org/IBM/watson-google-assistant)

# Create an Action for Google Assistant using Watson Assistant
In this Code Pattern, we will create a Google Assistant skill which gets its responses from Watson Assistant.

TODO: [Explain briefly how things work]. [Give acknowledgements to others if necessary]
* A Redis account. Redis is an open-source, blazingly fast, key/value low maintenance store. I use it to store conversation context. 

When the reader has completed this Code Pattern, they will understand how to:

* [goal 1]
* [goal 2]
* [goal 3]
* [goal 4]

![](doc/source/images/architecture.png)

## Flow
1. Step 1.
2. Step 2.
3. Step 3.
4. Step 4.
5. Step 5.

## Included components
* [Google Home](https://support.google.com/googlehome/answer/7029281?hl=en): Powered by the Google Assistant, with [Google Home](https://support.google.com/googlehome/answer/7029281?hl=en) you have command of your music, your home, and your curiosity. Start by saying, for example “Ok Google" or "Hey Google” in English.
* [Watson Assistant](https://www.ibm.com/watson/developercloud/conversation.html): Create a chatbot with a program that conducts a conversation via auditory or textual methods.
* [Redis](https://redis.io/): An open-source, in-memory data structure store, used as a database, cache and message broker.

## Featured technologies
* [Databases](https://en.wikipedia.org/wiki/Database): Repository for storing and managing collections of data.
* [Node.js](https://nodejs.org/): An open-source JavaScript run-time environment for executing server-side JavaScript code.


# Watch the Video
[![Watson and Google together](https://user-images.githubusercontent.com/9534938/33854699-e2628078-dec2-11e7-9366-e9e698160728.png)](https://www.youtube.com/watch?v=-lIxmYxLzbA "Watson & Google together")

# Steps
Use the `Deploy to IBM Cloud` button **OR** create the services and run locally.

## Deploy to IBM Cloud
[![Deploy to IBM Cloud](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/IBM/watson-google-assistant.git)

1. Press the above `Deploy to IBM Cloud` button and then click on `Deploy`.

2. In Toolchains, click on Delivery Pipeline to watch while the app is deployed. Once deployed, the app can be viewed by clicking `View app`.

3. To see the app and services created and configured for this Code Pattern, use the IBM Cloud dashboard. The app is named `watson-google-assistant` with a unique suffix. The following services are created and easily identified by the `wga-` prefix:
    * wga-assistant
    * wga-redis

TODO: Add how to switch the workspace/service post-D2B

## Run locally
> NOTE: These steps are only needed when running locally instead of using the `Deploy to IBM Cloud` button.

1. [Clone the repo](#1-clone-the-repo)
1. [Create a Watson Assistant workspace](#2-create-a-watson-conversation-workspace)
1. [Create a Compose for Redis service](#3-create-a-compose-for-redis-service)

5. [Configure credentials](#5-configure-credentials)
2. Create a Google Actions project
5. [Run the application](#6-run-the-application)

### 1. Clone the repo

Clone the `watson-google-assistant` locally. In a terminal, run:

```
git clone https://github.com/IBM/watson-google-assistant
```

### 2. Create a Watson Assistant workspace

Sign up for [IBM Cloud](https://console.ng.bluemix.net/registration/) if you don't have an IBM Cloud account yet.

Use one or both of these options (with or without BAE) to setup an Assistant workspace.

#### Using Bot Asset Exchange (BAE)
If you are using
[BAE](https://developer.ibm.com/code/exchanges/bots),
click on a `Deploy this bot` button to automatically create
your Assistant service and import your workspace. The service will be named
`Bot Asset Exchange Workspaces` and can hold up to 5 selected workspaces.

#### Using the provided workspace.json file
Create the service by following this link and hitting `Create`:
* [**Watson Assistant**](https://console.ng.bluemix.net/catalog/services/conversation)

Import the Assistant workspace.json:
* Find the Assistant service in your IBM Cloud Dashboard.
* Click on the service and then click on `Launch Tool`.
* Go to the `Workspaces` tab.
* Click on the **import** icon (next to the Workspaces Create button).
* Click `Choose a file`, go to your cloned repo dir, and `Open` the workspace.json file in [`data/workspaces/workspace.json`](data/workspaces/workspace.json).
* Select `Everything` and click `Import`.

### 3. Create a Compose for Redis service

TODO: test TLS
> NOTE: The code currently requires you to disable TLS.

  1. Follow this link: [**Compose for Redis**](https://console.ng.bluemix.net/catalog/services/compose-for-redis)
  1. Use the `TLS Enabled` pull-down to select `False`
  1. Hit the `Create` button

<!-- ![](doc/source/images/redis_tls_false.png) -->

### 2. Create a Google Actions project

* A Google Actions project (https://developers.google.com/actions/)

### 5. Configure credentials

The credentials for IBM Cloud services (Conversation, Discovery, Tone Analyzer and
Natural Language Understanding), can be found in the `Services` menu in IBM Cloud,
by selecting the `Service Credentials` option for each service.

The other settings for Conversation and Discovery were collected during the
earlier setup steps (`DISCOVERY_COLLECTION_ID`, `DISCOVERY_ENVIRONMENT_ID` and
`WORKSPACE_ID`).

Copy the [`env.sample`](env.sample) to `.env`.

```
$ cp env.sample .env
```
Edit the `.env` file with the necessary settings.

#### `env.sample:`

TODO:
```
WCS_Username=
WCS_Password=
workspace_id=
redis_port=
redis_url=
redis_auth=  
```
```
# Replace the credentials here with your own.
# Rename this file to .env before starting the app.

# Watson conversation
CONVERSATION_USERNAME=<add_conversation_username>
CONVERSATION_PASSWORD=<add_conversation_password>
WORKSPACE_ID=<add_conversation_workspace>

# Watson Discovery
DISCOVERY_USERNAME=<add_discovery_username>
DISCOVERY_PASSWORD=<add_discovery_password>
DISCOVERY_ENVIRONMENT_ID=<add_discovery_environment>
DISCOVERY_COLLECTION_ID=<add_discovery_collection>

# Watson Natural Language Understanding
NATURAL_LANGUAGE_UNDERSTANDING_USERNAME=<add_nlu_username>
NATURAL_LANGUAGE_UNDERSTANDING_PASSWORD=<add_nlu_password>

# Watson Tone Analyzer
TONE_ANALYZER_USERNAME=<add_tone_analyzer_username>
TONE_ANALYZER_PASSWORD=<add_tone_analyzer_password>

# Run locally on a non-default port (default is 3000)
# PORT=3000

```

### 6. Run the application
1. Install [Node.js](https://nodejs.org/en/) runtime or NPM.
1. Start the app by running `npm install`, followed by `npm start`.
1. Use the chatbot at `localhost:3000`.
> Note: server host can be changed as required in server.js and `PORT` can be set in `.env`.

# Sample output

![](doc/source/images/sample_output.png)

# Links
* [Demo on Youtube](https://www.youtube.com/watch?v=TODO)
* [Watson Node.js SDK](https://github.com/watson-developer-cloud/node-sdk)

# Learn more

* **Artificial Intelligence Code Patterns**: Enjoyed this Code Pattern? Check out our other [AI Code Patterns](https://developer.ibm.com/code/technologies/artificial-intelligence/).
* **AI and Data Code Pattern Playlist**: Bookmark our [playlist](https://www.youtube.com/playlist?list=PLzUbsvIyrNfknNewObx5N7uGZ5FKH0Fde) with all of our Code Pattern videos
* **With Watson**: Want to take your Watson app to the next level? Looking to utilize Watson Brand assets? [Join the With Watson program](https://www.ibm.com/watson/with-watson/) to leverage exclusive brand, marketing, and tech resources to amplify and accelerate your Watson embedded commercial solution.

# License
[Apache 2.0](LICENSE)

























## Setup Google Actions Project

1. Go to [Google Actions Console](https://console.actions.google.com)
2. Click on `+ Add/import project`
  * Enter a project name
  * Select your country/region
  * Click on `CREATE PROJECT`
3.
  * Under `More options` click on the `Actions SDK` card
  * Click on the `Actions SDK` link to install the command line interface.


3. Build your app using Actions SDK. Click **BUILD**

![options](https://developers.google.com/actions/images/aog-project-apiai-actions.png)

4. Download [gactions](https://developers.google.com/actions/tools/gactions-cli) command line tool

```
cp to repo or path
chmod +x gactions
```

I have already create 3 actions for English, French (France) & French (Canada).

5. Modify these files :
  * description
  * queryPatterns
  * name & url - depends on your Bluemix deployment 
6. Launch these commands
  * If it prompts you to enter an authorization code, browse to the provided URL to login and authorize the CLI to use your account and copy/paste the auth code at the prompt.

```
$ gactions update --action_package action.json --action_package action_fr.json --action_package action_fr_fr.json --action_package action_fr_CA.json --project **[YOUR_PROJECT_ID]**
Gactions needs access to your Google account. Please copy & paste the URL below into a web browser and follow the instructions there. Then copy and paste the authorization code from the browser back here.
Visit this URL: 
 https://accounts.google.com/o/oauth2/auth?access_type=offline&client_id=id.apps.googleusercontent.com&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Factions.builder&state=state 
Enter authorization code: 
3/BADDaaaaAAAaA1aAa1a1AAa77-aA1aAAaaAaaaA1aaAAAaa0oOOoOOO
Your app for the Assistant for project markstur-watson-assistant was successfully updated with your actions. Visit the Actions on Google console to finish registering your app and submit it for review at https://console.actions.google.com/project/markstur-watson-assistant/overview

```
```
$ gactions test --action_package action.json --action_package action_fr.json --action_package action_fr_fr.json --action_package action_fr_CA.json --project **[YOUR_PROJECT_ID]**
Pushing the app for the Assistant for testing...
Your app for the Assistant for project markstur-watson-assistant is now ready for testing on Actions on Google enabled devices or the Actions Web Simulator at https://console.actions.google.com/project/markstur-watson-assistant/simulator/

```

7. You have to finalize the app configuration for production, click [here](https://developers.google.com/actions/sdk/submit-app)

In order to test it you have three options:
- Web Simulator
- Google Assistant mobile app 
- a Google Home

If you are in Testing Home, you have to invocate the Google Actions by using "Talk to **APP_NAME**" or "Parler avec **APP_NAME**.

### Illustration of the Web Simulator

![Web Simulator](https://user-images.githubusercontent.com/9534938/33787219-9945939c-dc6c-11e7-9fef-8ef464068a58.png)

### Illustration with Google Home device - click on the image to watch it

[![Watson & Google together](https://user-images.githubusercontent.com/9534938/33854699-e2628078-dec2-11e7-9366-e9e698160728.png)](https://www.youtube.com/watch?v=-lIxmYxLzbA "Watson & Google together")

### Illustration of the Google Assistant on Mobile (iOS)

![img_d4d247ea81fc-1](https://user-images.githubusercontent.com/9534938/33787305-eea71f7c-dc6c-11e7-8710-1636e5a91b2f.jpeg)

## License

This sample code is licensed under Apache 2.0.
Full license text is available in [LICENSE](LICENSE).

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md).
