export function runBlock(GClient, GApi, GAuth, toastr, GoogleCloudStorageService) {
    'ngInject';

    let browserApiKey = 'AIzaSyCxuWYC_0uOw99PhW5Uunz9KiWdbjUGnYs';
    let clientId = '215385949726-n8r0dmckf2pi0h2o95vcrkq2s2te20th.apps.googleusercontent.com';

    GoogleCloudStorageService.login(browserApiKey, clientId).then(
        (user) => {
            toastr.success(`${user.name} has successfully signed in.`);
        },
        () => {
            toastr.error(`Failed to sign the current user into Google.`);
        }
    );
}
