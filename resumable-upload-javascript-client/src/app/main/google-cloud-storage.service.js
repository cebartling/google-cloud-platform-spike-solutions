export class GoogleCloudStorageService {
    constructor($log, $q, $window, $timeout, $rootScope, GApi, GAuth, GClient, configuration) {
        'ngInject';
        this.$log = $log;
        this.$q = $q;
        this.$window = $window;
        this.$timeout = $timeout;
        this.$rootScope = $rootScope;
        this.GApi = GApi;
        this.GAuth = GAuth;
        this.GClient = GClient;
        this.configuration = configuration();
        this.step = (256 * 1024);
        this.STATUS_RESUME_INCOMPLETE = 308;
        $log.info(`Browser API key: ${this.configuration.browserApiKey}`);
        $log.info(`OAuth 2.0 client ID: ${this.configuration.clientId}`);
        $log.info(`Bucket name: ${this.configuration.bucketName}`);
    }

    login() {
        this.GClient.setApiKey(this.configuration.browserApiKey);
        this.GApi.load('storage', 'v1');
        this.GAuth.setClient(this.configuration.clientId);
        this.GAuth.setScope('https://www.googleapis.com/auth/devstorage.read_write');
        return this.GAuth.login();
    }

    uploadFile(blob) {
        this.$log.info(`File to upload size: ${blob.size}`);
        let promise = this.startResumableUploadSession(blob, blob.name);
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

    startResumableUploadSession(blob, objectName) {
        let contentType = blob.type || 'application/octet-stream';
        let fileSize = blob.size;
        let metadata = {
            'name': objectName,
            'mimeType': contentType
        };
        let payload = JSON.stringify(metadata);
        let parameters = {
            'path': '/upload/storage/v1/b/' + this.configuration.bucketName + '/o',
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
        this.readBlobSlice(resumableUri, blob, startIndex, endIndex);
    }

    readBlobSlice(resumableUri, blob, startIndex, endIndex) {
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
            this.uploadBlobSlice(resumableUri, blob, slice, binaryData, startIndex, endIndex);
        });
    }

    uploadBlobSlice(resumableUri, entireBlob, slice, binaryData, startIndex, endIndex) {
        this.$log.info(`Uploading chunk: chunk size: ${binaryData.length} bytes, start: ${startIndex}, end: ${endIndex}`);
        let parameters = {
            'path': resumableUri,
            'method': 'PUT',
            'headers': {
                'Content-Type': slice.sliceBlob.type
            },
            'body': binaryData
        };
        let promise = this.$window.gapi.client.request(parameters);
        promise.then((response) => {
            // This should be the final PUT, thus a 200 level status code.
            this.$log.info(`SUCCESS: PUT request to GCS: ${JSON.stringify(response)}`);
            this.triggerProgressEvent(slice.stop, entireBlob.size);
        }, (response) => {
            if (response.status === this.STATUS_RESUME_INCOMPLETE) {
                this.$log.info(`SUCCESS: Chunked transfer PUT request to GCS: ${JSON.stringify(response)}`);
                let captures = /bytes=\d+\-(\d+)/.exec(response.headers.range);
                if (captures.length == 2) {
                    const lastChunkReceived = parseInt(captures[1]);
                    this.triggerProgressEvent(lastChunkReceived, entireBlob.size);
                    const nextStartIndex = lastChunkReceived + 1;
                    if (nextStartIndex < entireBlob.size) {
                        const nextEndIndex = Math.min((nextStartIndex + this.step), entireBlob.size);
                        this.readBlobSlice(resumableUri, entireBlob, nextStartIndex, nextEndIndex);
                    }
                }
            } else {
                this.$log.error(`FAILURE: Chunked transfer PUT request to GCS: ${JSON.stringify(response)}`);
                this.$rootScope.$emit('chunk:upload:failure', {reason: response.body});
            }
        });
    }

    triggerProgressEvent(sliceStop, entireBlobSize) {
        const percentLoaded = Math.min(Math.round((sliceStop / entireBlobSize) * 100), 100);
        this.$rootScope.$emit('chunk:upload:success', {
            percentLoaded: percentLoaded,
            entireBlobSize: entireBlobSize,
            lastByteUploaded: sliceStop
        });
    }
}

