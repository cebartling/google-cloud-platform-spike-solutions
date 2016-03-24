export class GoogleCloudStorageService {
    constructor($log, $q, $window, $timeout, GApi, GAuth, GClient) {
        'ngInject';
        this.$log = $log;
        this.$q = $q;
        this.$window = $window;
        this.$timeout = $timeout;
        this.GApi = GApi;
        this.GAuth = GAuth;
        this.GClient = GClient;
        this.step = (256 * 1024);

    }

    login(browserApiKey, clientId) {
        this.GClient.setApiKey(browserApiKey);
        this.GApi.load('storage', 'v1');
        this.GAuth.setClient(clientId);
        this.GAuth.setScope('https://www.googleapis.com/auth/devstorage.read_write');
        return this.GAuth.login();
    }

    uploadFile(blob) {
        this.$log.info(`File to upload size: ${blob.size}`);
        let promise = this.startResumableUploadSession(blob, 'foobar-001', blob.name);
        promise.then(
            (response) => {
                this.$log.info(`Resumable upload URL: ${response.headers.location}`);
                this.startUpload(response.headers.location, blob);
            },
            () => {
                this.$log.error(`Unable to start the resumable upload session.`);
            }
        );
    }

    startResumableUploadSession(blob, bucketName, objectName) {
        let contentType = blob.type || 'application/octet-stream';
        let fileSize = blob.size;
        let metadata = {
            'name': objectName,
            'mimeType': contentType
        };
        let payload = JSON.stringify(metadata);
        let parameters = {
            'path': '/upload/storage/v1/b/' + bucketName + '/o',
            'method': 'POST',
            'params': {
                'uploadType': 'resumable',
                'name': encodeURI(objectName)
            },
            'headers': {
                'X-Upload-Content-Type': contentType,
                'X-Upload-Content-Length': fileSize,
                'Content-Type': 'application/json; charset=UTF-8'
            },
            'body': payload
        };
        return this.$window.gapi.client.request(parameters);
    }

    startUpload(resumableUri, blob) {
        let startIndex = 0;
        let endIndex = Math.min(this.step, blob.size);
        this.processSliceBlob(resumableUri, blob, startIndex, endIndex);
    }

    processSliceBlob(resumableUri, blob, startIndex, endIndex) {
        let sliceBlob = blob.slice(startIndex, endIndex);
        let slice = {start: startIndex, stop: endIndex, sliceBlob: sliceBlob};
        let reader = new FileReader();
        let deferred = this.$q.defer();
        reader.onload = () => {
            deferred.resolve(reader.result);
        };
        reader.onerror = (error) => {
            deferred.reject(error);
        };
        reader.onabort = (abort) => {
            deferred.reject(abort);
        };
        reader.readAsBinaryString(slice.sliceBlob);
        deferred.promise.then((binaryData) => {
            this.$log.info(`Binary data size: ${binaryData.length} bytes, start: ${startIndex}, end: ${endIndex}`);
            this.uploadSliceData(resumableUri, blob, slice, binaryData, startIndex, endIndex);
        });
    }

    uploadSliceData(resumableUri, entireBlob, slice, binaryData, startIndex, endIndex) {
        let contentRange = 'bytes ' + slice.start + '-' + slice.stop + '/' + entireBlob.size;
        this.$log.info("Content-Range: " + contentRange);
        let parameters = {
            'path': resumableUri,
            'method': 'PUT',
            'headers': {
                'X-Upload-Content-Type': slice.sliceBlob.type,
                'X-Upload-Content-Length': entireBlob.size,
                'Content-Type': slice.sliceBlob.type,
                'Content-Range': contentRange
            },
            'body': binaryData
        };
        let promise = this.$window.gapi.client.request(parameters);
        promise.then((response) => {
            this.$log.info(`SUCCESS: PUT request to GCS: ${response.toJson()}`);
            this.triggerProgressEvent(slice.stop, entireBlob.size);
            startIndex += this.step;
            if (startIndex < entireBlob.size) {
                endIndex = Math.min((startIndex + this.step), entireBlob.size);
                this.processSliceBlob(resumableUri, entireBlob, startIndex, endIndex);
            }
        }, (error) => {
            this.$log.error(`FAILURE: PUT request to GCS: ${JSON.stringify(error)}`);
        });
    }

    triggerProgressEvent(sliceStop, entireBlobSize) {
        let percentLoaded = Math.round((sliceStop / entireBlobSize) * 100);
        if (percentLoaded > 100) {
            percentLoaded = 100;
        }
        this.$log.info('Percent loaded: ' + percentLoaded + '%');
        //$rootScope.emit('', {});
    }
}

