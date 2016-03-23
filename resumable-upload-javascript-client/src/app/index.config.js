export function config($logProvider, toastrConfig, $mdThemingProvider) {
    'ngInject';
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 4000;
    toastrConfig.positionClass = 'toast-bottom-left';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

    $mdThemingProvider.theme('docs-dark').primaryPalette('blue').accentPalette('red');
}
