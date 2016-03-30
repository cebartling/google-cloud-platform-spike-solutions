export function config($logProvider, toastrConfig, $mdThemingProvider) {
    'ngInject';
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.closeButton = true;
    toastrConfig.timeOut = 10000;
    toastrConfig.positionClass = 'toast-bottom-full-width';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
    toastrConfig.tapToDismiss = true;

    $mdThemingProvider.theme('docs-dark').primaryPalette('blue').accentPalette('red');
}
