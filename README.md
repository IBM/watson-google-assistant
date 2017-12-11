# Watson Conversation & Google Home
A code allowing you to demo Watson Conversation with Google Home.

## Components of the solution

### Watson Conversation
Watson Conversation service combines machine learning, natural language understanding, and integrated dialog tools to create conversation flows between your apps and your users.

### Google Home
Powered by the Google Assistant, with [Google Home](https://support.google.com/googlehome/answer/7029281?hl=en) you have command of your music, your home, and your curiosity. Start by saying, for example “Ok Google" or "Hey Google.” in English.

## Before you begin

* Create a Bluemix account
    * [Sign up](https://console.ng.bluemix.net/registration/?target=/catalog/%3fcategory=watson) in Bluemix, or use an existing account. 
* A Watson Conversation Instance with one workspace
* A Redis account. Redis is an open-source, blazingly fast, key/value low maintenance store. I use it to store conversation context. 
    * You can instantiate one instance as an IBM Cloud service [here](https://console.bluemix.net/catalog/services/compose-for-redis?taxonomyNavigation=apps)
* A Google Actions project (https://developers.google.com/actions/)

## Deploy Node.js app on Bluemix

Follow documentation in that [Github project](https://github.com/watson-developer-cloud/conversation-simple).

* Create an .env file for credentials and connections details
```
WCS_Username=
WCS_Password=
workspace_id=
redis_port=
redis_url=
redis_auth=  
```

## Setup Google Actions Project

1. Go to [Google Actions Console](https://console.actions.google.com)
2. Add/Import a project
3. Build your app using Actions SDK. Click **BUILD**

![options](https://developers.google.com/actions/images/aog-project-apiai-actions.png)

4. Download [gactions](https://developers.google.com/actions/tools/gactions-cli) command line tool
I have already create 3 actions for English, French (France) & French (Canada).
5. Modify these files :
  * description
  * queryPatterns
  * name & url - depends on your Bluemix deployment 
6. Launch these commands
  * gactions update --action_package action_fr3.json --action_package action_fr.json --action_package action.json --action_package action_fr2.json --project **[YOUR_PROJECT_ID]**
  * gactions test --action_package action_fr3.json --action_package action_fr.json --action_package action.json --action_package action_fr2.json --project **[YOUR_PROJECT_ID]**
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
