# google-cloud-platform-spike-solutions
Various spike solutions with GCP tools and platform

More information to come.


## Resumable upload to Google Cloud Storage spike solution

### Setup

1. Obtain the browser API key and the OAuth 2.0 Client ID from the Google Cloud Console for your cloud application.  See the screenshot below for more details.
![Google credentials setup](./resumable-upload-javascript-client/google-cloud-console-credentials.png?raw=true "Google credentials setup")

1. Set the title for the OAuth 2 consent screen:
 
![Google consent screen setup](./resumable-upload-javascript-client/google-cloud-console-consent-screen.png?raw=true "Google consent screen setup")


1. Set the browser API key  and the OAuth 2.0 Client ID from the previous step in the `resumable-upload-javascript-client/src/app/index.run.js` file.  Save the file.

1. Run gulp serve to start the gulp web server and serve up the JavaScript client.  If all goes well, the JavaScript web app should authenticate and authorize you and you will see a toast stating that fact.

