export class MainController {
    constructor($scope, $rootScope, $log, $document, $timeout, GoogleCloudStorageService, toastr) {
        'ngInject';
        this.signedIn = false;
        this.file = undefined;
        this.$log = $log;
        this.$document = $document;
        this.$scope = $scope;
        this.toastr = toastr;
        this.$timeout = $timeout;
        this.GoogleCloudStorageService = GoogleCloudStorageService;
        $rootScope.$on('chunk:upload:success', (event, context) => {
            this.$timeout(() => {
                this.toastr.success(`Upload is ${context.percentLoaded}% complete.`);
            }, 100);
        });
        $rootScope.$on('chunk:upload:failure', (event, context) => {
            this.$timeout(() => {
                this.toastr.error(`Failed to upload blob chunk. ${context.reason}`);
            }, 100);
        });
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

