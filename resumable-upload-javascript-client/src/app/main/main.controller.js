export class MainController {
    constructor($scope, $log, $document, GoogleCloudStorageService) {
        'ngInject';
        this.file = undefined;
        this.$log = $log;
        this.$document = $document;
        this.$scope = $scope;
        this.GoogleCloudStorageService = GoogleCloudStorageService;
        this.$scope.onChangeFileInput = (target) => {
            if (angular.isDefined(target.files[0])) {
                this.GoogleCloudStorageService.uploadFile(target.files[0]);
            }
        };
    }

    chooseFile() {
        this.$log.info('Called chooseFile...');
        // FIXME: Move to $document here.
        angular.element(document.querySelector('#fileUpload')).click();
    }
}

