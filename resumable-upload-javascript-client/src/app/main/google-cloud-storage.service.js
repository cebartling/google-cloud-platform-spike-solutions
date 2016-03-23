export class GoogleCloudStorageService {
    constructor($log, $q, $window, $timeout, GApi, GAuth, configuration) {
        'ngInject';
        this.$log = $log;
        this.$q = $q;
        this.$window = $window;
        this.$timeout = $timeout;
        this.GApi = GApi;
        this.GAuth = GAuth;
        this.configuration = configuration;
        this.step = (256 * 1024);
        this.googleApiScopesString = [
            'https://www.googleapis.com/auth/devstorage.read_write'
        ].join(' ');

    }

    uploadFile(blob) {
        this.$log.info(`File to upload size: ${blob.size}`);
        this.GApi.load('storage', 'v1');
        this.GAuth.setScope(this.googleApiScopesString);
        this.$window.gapi.client.setApiKey(this.configuration.browserApiKey);
//         $timeout(function () {
//             gapi.auth.authorize(
//                 {
//                     client_id: this.configuration.clientId,
//                     scope: this.googleApiScopesString,
//                     immediate: false
//                 },
//                 function (authResult) {
//                     if (authResult && !authResult.error) {
//                         delete authResult['g-oauth-window'];
//                         //startResumableUploadSession(blob, bucketName, objectName)
//                         //    .then(function (resumableUri) {
//                         //});
//                     } else {
//                         window.alertify.maxLogItems(1).error(config.notifications.error.gapi.authorizationFailed);
//                         $log.error('FAILURE: gapi.auth.authorize: ' + JSON.stringify(authResult));
//                     }
//                 }
//             );
//         }, 100);

    }

    startResumableUploadSession(blob, bucketName, objectName) {
        let contentType = blob.type || 'application/octet-stream';
        let fileSize = blob.size;
        let metadata = {
            'name': objectName,
            'mimeType': contentType
        };
        let payload = metadata.toJson();
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

        let promise = this.$window.gapi.client.request(parameters);
        return promise.then(
            (response) => {
                return response.headers.location;
            }, () => {
                return undefined;
            });
    }

    startUpload(resumableUri, blob) {
        let startIndex = 0;
        let lastByteIndex = blob.size - 1;
        let endIndex = Math.min(this.step, lastByteIndex);
        let continueProcessing = true;
        while (continueProcessing && startIndex < blob.size) {
            let sliceBlob = blob.slice(startIndex, endIndex);
            let slice = {start: startIndex, stop: endIndex, sliceBlob: sliceBlob};
            let response = this.processSliceBlob(resumableUri, blob, slice);
            if (angular.isDefined(response)) {
                startIndex += this.step;
                endIndex = Math.min((startIndex + this.step), lastByteIndex);
            } else {
                continueProcessing = false;
            }
        }
    }

    processSliceBlob(resumableUri, entireBlob, slice) {
        let reader = new FileReader();
        let deferred = this.$q.defer();
        reader.onload = function () {
            deferred.resolve(reader.result);
        };
        reader.onerror = function (error) {
            deferred.reject(error);
        };
        reader.onabort = function (abort) {
            deferred.reject(abort);
        };
        reader.readAsBinaryString(slice.sliceBlob);
        return deferred.promise.then(function (binaryData) {
            return this.uploadSliceData(resumableUri, entireBlob, slice, binaryData);
        });
    }

    uploadSliceData(resumableUri, entireBlob, slice, binaryData) {
        let contentType = slice.sliceBlob.type || 'video/mp4';
        let contentRange = 'bytes ' + slice.start + '-' + slice.stop + '/' + entireBlob.size;
        this.$log.info("Content-Range: " + contentRange);
        let dataLength = binaryData.length;
        let parameters = {
            'path': resumableUri,
            'method': 'PUT',
            'headers': {
                'Content-Type': contentType,
                'Content-Range': contentRange
            },
            'body': dataLength.toString(16) + '\r\n' + binaryData + '\r\n0\r\n'
        };
        let promise = this.$window.gapi.client.request(parameters);
        return promise.then(function (response) {
            this.$log.info('SUCCESS: PUT request to GCS: ' + response.toJson());
            this.triggerProgressEvent(slice.stop, entireBlob.size);
            return response;
        }, function (error) {
            this.$log.error('FAILURE: PUT request to GCS: ' + error.toJson());
            return undefined;
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


//
// let googleApiScopes = [
//     'https://www.googleapis.com/auth/devstorage.read_write'
// ];
// let googleApiScopesString = googleApiScopes.join(' ');
//
// let uploadFile = function (blob, bucketName, objectName,
//                            onFulfilledHandler, onRejectedHandler) {
//     let boundary = '-------314159265358979323846';
//     let delimiter = "\r\n--" + boundary + "\r\n";
//     let close_delim = "\r\n--" + boundary + "--";
//
//     let reader = new FileReader();
//     reader.readAsBinaryString(blob);
//     reader.onload = function (e) {
//         let contentType = blob.type || 'application/octet-stream';
//         let metadata = {
//             'name': objectName,
//             'mimeType': contentType
//         };
//         let base64Data = btoa(reader.result);
//         let multipartRequestBody =
//             delimiter +
//             'Content-Type: application/json\r\n\r\n' +
//             JSON.stringify(metadata) +
//             delimiter +
//             'Content-Type: ' + contentType + '\r\n' +
//             'Content-Transfer-Encoding: base64\r\n' +
//             '\r\n' +
//             base64Data +
//             close_delim;
//
//         let parameters = {
//             'path': '/upload/storage/v1/b/' + bucketName + '/o',
//             'method': 'POST',
//             'params': {'uploadType': 'multipart'},
//             'headers': {
//                 'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
//             },
//             'body': multipartRequestBody
//         };
//
//         let request = gapi.client.request(parameters);
//         let context = {};
//         request.then(function (response) {
//             //$log.info('SUCCESS: gapi.client.request upload to GCS: ' + JSON.stringify(response));
//             onFulfilledHandler(response);
//         }, function (reason) {
//             //$log.error('FAILURE: gapi.client.request upload to GCS: ' + JSON.stringify(reason));
//             onRejectedHandler(reason);
//         }, context);
//     };
// };
//
// /**
//  * Obtains the resumable file upload URI.
//  */
// let startResumableUploadSession = function (blob, bucketName, objectName) {
//     let contentType = blob.type || 'application/octet-stream';
//     let fileSize = blob.size;
//     let metadata = {
//         'name': objectName,
//         'mimeType': contentType
//     };
//     let payload = JSON.stringify(metadata);
//     let parameters = {
//         'path': '/upload/storage/v1/b/' + bucketName + '/o',
//         'method': 'POST',
//         'params': {
//             'uploadType': 'resumable',
//             'name': encodeURI(objectName)
//         },
//         'headers': {
//             'X-Upload-Content-Type': contentType,
//             'X-Upload-Content-Length': fileSize,
//             'Content-Type': 'application/json; charset=UTF-8'
//         },
//         'body': payload
//     };
//
//     let promise = gapi.client.request(parameters);
//     return promise.then(function (response) {
//         return response.headers.location;
//     });
//     //.catch(function (error) {
//     //$log.error('Error occurred while sending initial POST request to GCS:' + JSON.stringify(error));
//     //return undefined;
//     //});
// };
//
// let step = (256 * 1024);
//
// let uploadFileWithResumableUploadSession = function (resumableUri,
//                                                      blob,
//                                                      onFulfilledHandler,
//                                                      onRejectedHandler) {
//     $log.info('Resumable upload URI: ' + resumableUri);
//     let startIndex = 0;
//     let lastByteIndex = blob.size - 1;
//     let endIndex = Math.min(step, lastByteIndex);
//     let continueProcessing = true;
//     while (continueProcessing && startIndex < blob.size) {
//         let sliceBlob = blob.slice(startIndex, endIndex);
//         let slice = {start: startIndex, stop: endIndex, sliceBlob: sliceBlob};
//         let response = processSliceBlob(resumableUri, blob, slice);
//         if (response !== undefined) {
//             startIndex += step;
//             endIndex = Math.min((startIndex + step), lastByteIndex);
//         } else {
//             continueProcessing = false;
//         }
//     }
// };
//
// let processSliceBlob = function (resumableUri, entireBlob, slice) {
//     let reader = new FileReader();
//     let deferred = $q.defer();
//     reader.onload = function (onLoadEvent) {
//         deferred.resolve(reader.result);
//     };
//     reader.onerror = function (error) {
//         deferred.reject(error);
//     };
//     reader.onabort = function (abort) {
//         deferred.reject(abort);
//     };
//     reader.readAsBinaryString(slice.sliceBlob);
//     return deferred.promise.then(function (binaryData) {
//         return uploadSliceData(resumableUri, entireBlob, slice, binaryData);
//     });
// };
//
// let uploadSliceData = function (resumableUri, entireBlob, slice, binaryData) {
//     let contentType = slice.sliceBlob.type || 'video/mp4';
//     let contentRange = 'bytes ' + slice.start + '-' + slice.stop  + '/' + entireBlob.size;
//     $log.info("Content-Range: " + contentRange);
//     let dataLength = binaryData.length;
//     let parameters = {
//         'path': resumableUri,
//         'method': 'PUT',
//         'headers': {
//             'Content-Type': contentType,
//             'Content-Range': contentRange
//         },
//         'body': dataLength.toString(16) + '\r\n' + binaryData + '\r\n0\r\n'
//     };
//     let promise = gapi.client.request(parameters);
//     return promise.then(function (response) {
//         $log.info('SUCCESS: PUT request to GCS: ' + JSON.stringify(response));
//         triggerProgressEvent(slice.stop, entireBlob.size);
//         return response;
//     }, function(error){
//         $log.error('FAILURE: PUT request to GCS: ' + JSON.stringify(error));
//         return undefined;
//     });
// };
//
// let triggerProgressEvent = function (sliceStop, entireBlobSize) {
//     let percentLoaded = Math.round((sliceStop / entireBlobSize) * 100);
//     if (percentLoaded > 100) {
//         percentLoaded = 100;
//     }
//     $log.info('Percent loaded: ' + percentLoaded + '%');
//     //$rootScope.emit('', {});
// };
//
// return {
//     selectedFile: undefined,
//     generateTitle: function () {
//         let title = 'Untitled video';
//         if (this.selectedFile !== undefined) {
//             let parts = this.selectedFile.name.split('.');
//             title = '';
//             for (let i = 0; i < parts.length - 1; i++) {
//                 title += parts[i];
//             }
//         }
//         return title;
//     },
//     startFileUpload: function (blob, bucketName, objectName,
//                                onFulfilledHandler, onRejectedHandler,
//                                browserApiKey, clientId) {
//         GApi.load('storage', 'v1');
//         GAuth.setScope(googleApiScopesString);
//         gapi.client.setApiKey(browserApiKey);
//         $timeout(function () {
//             gapi.auth.authorize(
//                 {
//                     client_id: clientId,
//                     scope: googleApiScopesString,
//                     immediate: false
//                 },
//                 function (authResult) {
//                     if (authResult && !authResult.error) {
//                         delete authResult['g-oauth-window'];
//                         uploadFile(blob, bucketName, objectName, onFulfilledHandler, onRejectedHandler);
//                     } else {
//                         window.alertify.maxLogItems(1).error(config.notifications.error.gapi.authorizationFailed);
//                         $log.error('FAILURE: gapi.auth.authorize: ' + JSON.stringify(authResult));
//                     }
//                 }
//             );
//         }, 100);
//     },
//     startResumableFileUpload: function (blob, resumableUploadURL,
//                                         onFulfilledHandler, onRejectedHandler,
//                                         browserApiKey, clientId) {
//         GApi.load('storage', 'v1');
//         GAuth.setScope(googleApiScopesString);
//         gapi.client.setApiKey(browserApiKey);
//         $timeout(function () {
//             gapi.auth.authorize(
//                 {
//                     client_id: clientId,
//                     scope: googleApiScopesString,
//                     immediate: false
//                 },
//                 function (authResult) {
//                     if (authResult && !authResult.error) {
//                         delete authResult['g-oauth-window'];
//                         //startResumableUploadSession(blob, bucketName, objectName)
//                         //    .then(function (resumableUri) {
//                         uploadFileWithResumableUploadSession(resumableUploadURL, blob,
//                             onFulfilledHandler, onRejectedHandler);
//                         //});
//                     } else {
//                         window.alertify.maxLogItems(1).error(config.notifications.error.gapi.authorizationFailed);
//                         $log.error('FAILURE: gapi.auth.authorize: ' + JSON.stringify(authResult));
//                     }
//                 }
//             );
//         }, 100);
//     }
// };
// }]);

