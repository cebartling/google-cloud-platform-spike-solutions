export class MainController {
    constructor($log, GoogleCloudStorageService) {
        'ngInject';
        this.file = undefined;
        this.$log = $log;
    }

    chooseFile() {
        this.$log.info('Called chooseFile...');
        angular.element(document.querySelector('#fileUpload')).click();
    }
}

