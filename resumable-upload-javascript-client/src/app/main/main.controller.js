export class MainController {
    constructor($scope, $log, $document, GoogleCloudStorageService, toastr) {
        'ngInject';
        this.signedIn = false;
        this.file = undefined;
        this.$log = $log;
        this.$document = $document;
        this.$scope = $scope;
        this.toastr = toastr;
        this.GoogleCloudStorageService = GoogleCloudStorageService;
        this.$scope.onChangeFileInput = (target) => {
            if (angular.isDefined(target.files[0])) {
                this.GoogleCloudStorageService.uploadFile(target.files[0]);
            }
        };
    }

    chooseFile() {
        // FIXME: Move to $document here.
        angular.element(document.querySelector('#fileUpload')).click();
    }
}

