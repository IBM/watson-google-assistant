[![Build Status](https://api.travis-ci.org/IBM/watson-google-assistant.svg?branch=master)](https://travis-ci.org/IBM/watson-google-assistant)

# Create an Action for Google Assistant using Watson Assistant

This Code Pattern includes a Watson Assistant workspace to demonstrate an implementation of a retail agent that can ask for reservation schedules and specifics. To demonstrate how to test it with Google Assistant devices, we will setup a Google Action that calls out to our Node.js server which interacts with Watson Assistant.

When the reader has completed this Code Pattern, they will understand how to:

* Create a Google Assistant Action
* Create a Node.js Express web application
* Interact with Google Assistant and Watson Assistant
* Use the conversation token to maintain the context
* Leverage the content catalog for general, customer care, and bot control intents
* Handle digressions during a conversation

![architecture](doc/source/images/architecture.png)

## Flow

1. User talks or types to Google Assistant.
2. Google Assistant posts text to an HTTPS endpoint.
3. Node.js server calls Watson Assistant to get the response.
4. The response is returned to Google Assistant.
5. Google Assistant replies to the user.

## Included components

* [Google Home](https://support.google.com/googlehome): Powered by the Google Assistant, with [Google Home](https://support.google.com/googlehome) you have command of your music, your home, and your curiosity. Start by saying, for example “Ok Google" or "Hey Google” in English.
* [Watson Assistant](https://www.ibm.com/cloud/watson-assistant/): Create a chatbot with a program that conducts a conversation via auditory or textual methods.

## Featured technologies

* [Node.js](https://nodejs.org/): An open-source JavaScript run-time environment for executing server-side JavaScript code.

# Watch the Video

[![video](https://img.youtube.com/vi/no0R0bSkHXc/0.jpg)](https://youtu.be/no0R0bSkHXc)

# Steps

1. [Deploy to IBM Cloud](#deploy-to-ibm-cloud)

1. [Setup Google Actions](#setup-google-actions)

1. [Talk to it!](#talk-to-it)

## Deploy to IBM Cloud

[![Deploy to IBM Cloud](https://cloud.ibm.com/devops/setup/deploy/button.png)](https://cloud.ibm.com/devops/setup/deploy?repository=https://github.com/IBM/watson-google-assistant.git)

1. Press the above `Deploy to IBM Cloud` button, click `Create+` to create an *IBM Cloud API Key* and then click on `Deploy`.

2. In Toolchains, click on Delivery Pipeline to watch while the app is deployed.

3. To see the app and service created and configured for this Code Pattern, use the IBM Cloud dashboard. The app is named `watson-google-assistant` with a unique suffix. The following service is created and easily identified by the `wga-` prefix:
    * wga-assistant

## Setup Google Actions

1. Go to [Actions on Google Developer Console](https://console.actions.google.com)

1. Create your project
   * Click on `+ Add/import project`
   * Enter a project name
   * Choose the default language for your Actions
   * Select your country or region
   * Click on `CREATE PROJECT`
   * Click on `SKIP` to choose a category later

1. Obtain your project ID
   * Next to the `Overview` menu item, click on the gear icon and then `Project settings`.
   * Save the `Project ID` to use later.

1. Set the invocation name

   * Use the left sidebar menu to select `SETUP` > `Invocation`.
   * Enter a display name. Users will say or type this name to explicitly invoke your action.
   * Hit `SAVE`.

1. Clone the repo

   Clone the `watson-google-assistant` repo locally. In a terminal, run:

   ```bash
   git clone https://github.com/IBM/watson-google-assistant
   ```

1. Install the `gactions` CLI
   * Download the `gactions` CLI from [here](https://developers.google.com/actions/tools/gactions-cli).
   * `chmod` the `gactions` file to make it executable.
   * Copy the `gactions` file into your local repo's `actions` directory.
     ```bash
     # For example, depending on your download and repo directories...

     chmod +x ~/Downloads/gactions
     cp ~/Downloads/gactions ~/watson-google-assistant/actions/
     ```

1. Edit the `actions/action.json` file in your local repo.
   * Edit the `url` using your deployed IBM Cloud app URL. Typically, you would just modify the timestamp digits and region.
     > Note: URL needs `https://` prefix e.g. https://watson-google-assistant-20180707012345678.us-east.mybluemix.net/

1. Create the action using the CLI
   > Note: If/when it prompts you to enter an authorization code, browse to the provided URL to login and authorize the CLI to use your account and copy/paste the auth code at the prompt.

   * Run the `gactions` command to update your action and prepare it for testing. Use the project ID you saved earlier.

     ```bash
     cd ~/watson-google-assistant/actions/
     ./gactions update --action_package action.json --project <YOUR_PROJECT_ID>
     ./gactions test --action_package action.json --project <YOUR_PROJECT_ID>
     ```

## Talk to it!

1. Test it in the simulator

   * Go back to your Actions on Google Developer Console
   * Use the left sidebar menu to select `TEST` > `Simulator` and start testing
   * Type in the `Input` box or click on the microphone icon to use voice input
   * Say "Talk to my test app" or "Talk to \<your app name\>" to initiate the conversation

1. Try it with your phone, your Google Home, or other device

   * Log into the device with the same account you used to create your test app
   * Say "Hey Google, talk to \<your app name\>"
   * Alternatively, test the implicit invocation with "Hey Google, get me some wheels" or "Hey Google, rent a car"

1. Chat and fill in the "slots" using natural language

1. Try some "digressions" such as:

   * Positive or negative feedback
   * Ask to talk to the manager
   * Are you a human?
   * Do you know any jokes?
   * Store hours
   * Store locations

1. If you want to submit the app for approval, follow Google's process documented [here](https://developers.google.com/actions/sdk/submit)

# Sample output

## Testing with the simulator

![Web Simulator](doc/source/images/simulator.png)

# Links

* [Demo on Youtube](https://youtu.be/no0R0bSkHXc)
* [Demo ordering pizza in French](https://youtu.be/-lIxmYxLzbA)
* [Illustration of the Google Assistant on Mobile (iOS)](https://user-images.githubusercontent.com/9534938/33787305-eea71f7c-dc6c-11e7-8710-1636e5a91b2f.jpeg)
* [Create an Alexa skill with Watson Assistant](https://developer.ibm.com/patterns/create-an-alexa-skill-with-serverless-and-a-conversation/)
* [Watson Node.js SDK](https://github.com/watson-developer-cloud/node-sdk)

# Learn more

* **Artificial Intelligence Code Patterns**: Enjoyed this Code Pattern? Check out our other [AI Code Patterns](https://developer.ibm.com/technologies/artificial-intelligence/).
* **AI and Data Code Pattern Playlist**: Bookmark our [playlist](https://www.youtube.com/playlist?list=PLzUbsvIyrNfknNewObx5N7uGZ5FKH0Fde) with all of our Code Pattern videos
* **With Watson**: Want to take your Watson app to the next level? Looking to utilize Watson Brand assets? [Join the With Watson program](https://www.ibm.com/watson/with-watson/) to leverage exclusive brand, marketing, and tech resources to amplify and accelerate your Watson embedded commercial solution.

# License

This code pattern is licensed under the Apache License, Version 2. Separate third-party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1](https://developercertificate.org/) and the [Apache License, Version 2](https://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache License FAQ](https://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)
