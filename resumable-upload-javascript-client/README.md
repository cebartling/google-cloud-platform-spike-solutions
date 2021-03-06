# Resumable upload to Google Cloud Storage spike solution

## Prerequisites

Node Version Manager ([nvm](https://github.com/creationix/nvm)) 
should be available on the system that you use to run this 
spike solution. Follow the directions there to get it set up.  

## Setup

1. Run the `./setup_local_development.sh` shell script to setup the 
spike solution project. The script will install JavaScript dependencies
 via npm and bower and get node-sass setup.
 

## Obtaining a browser API key and OAuth 2.0 client ID

1. Obtain the browser API key and the OAuth 2.0 Client ID from the 
Google Cloud Console for your cloud application.  See the screenshot below for more details.

![Google credentials setup](./google-cloud-console-credentials.png?raw=true "Google credentials setup")


1. Set the title for the OAuth 2 consent screen:
 
![Google consent screen setup](./google-cloud-console-consent-screen.png?raw=true "Google consent screen setup")


## Configuring the web application

1. Set the bucket name, browser API key and the OAuth 2.0 
Client ID from the previous step in the 
`resumable-upload-javascript-client/src/app/index.constants.js` file.  
Save the file.
1. Run `gulp serve` to start the integrated gulp web server and serve
 up the JavaScript client.  If all goes well, the JavaScript web app 
 should authenticate and authorize you.  A message toast will be 
 displayed stating that you have signed into Google successfully.
1. From the web application, click the *Choose File* button to bring 
up a file chooser for selecting a video file to upload. 


