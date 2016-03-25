export function runBlock(GClient, GApi, GAuth, toastr, GoogleCloudStorageService) {
    'ngInject';

    let browserApiKey = '';
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
