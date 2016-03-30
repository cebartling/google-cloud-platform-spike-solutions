export function runBlock(toastr, GoogleCloudStorageService) {
    'ngInject';

    // TODO: Add browser API key from cloud console --> API Manager -- Credentials
    let browserApiKey = '';

    // TODO: Add OAuth 2.0 Client ID from cloud console --> API Manager -- Credentials
    let clientId = '';

    GoogleCloudStorageService.login(browserApiKey, clientId).then(
        (user) => {
            toastr.success(`${user.name} has successfully signed in.`);
        },
        () => {
            toastr.error(`Failed to sign the current user into Google.`);
        }
    );
}
