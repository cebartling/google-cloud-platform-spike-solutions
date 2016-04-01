export function runBlock(toastr, GoogleCloudStorageService) {
    'ngInject';

    GoogleCloudStorageService.login().then(
        (user) => {
            toastr.success(`${user.name} has successfully signed in.`);
        },
        () => {
            toastr.error(`Failed to sign the current user into Google.`);
        }
    );
}
