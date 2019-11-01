# Run on IBM Cloud with Cloud Foundry

This document shows how to deploy the server using Cloud Foundry on IBM Cloud.

[![Deploy to IBM Cloud](https://cloud.ibm.com/devops/setup/deploy/button_x2.png)](https://cloud.ibm.com/devops/setup/deploy?repository=https://github.com/IBM/watson-google-assistant.git)

1. Click the above `Deploy to IBM Cloud` button and then click on the `Delivery Pipeline` tool integration.

   ![deploy](images/cf_deploy.png)

2. Create an API key by pressing the `Create+` button located next to the `IBM Cloud API key` field and then `Create` in the pop-up.

3. Select your `Region`, `Organization` and `Space`.

4. Click `Create` at the top of the panel to start the deployment process.

5. From the Toolchains view, click on the `Delivery Pipeline` to watch while the app is deployed. Here you'll be able to see logs about the deployment.

   ![toolchain-pipeline](images/toolchain_pipeline.png)

6. To see the app and service created and configured for this code pattern, use the [IBM Cloud](https://cloud.ibm.com) dashboard. The app is named `watson-google-assistant` with a unique suffix. A Watson Assistant service is created and connected to the app. The `rent-a-car` skill is automatically imported.

[![return](https://raw.githubusercontent.com/IBM/pattern-utils/master/deploy-buttons/return.png)](https://github.com/IBM/watson-google-assistant#setup-google-actions)