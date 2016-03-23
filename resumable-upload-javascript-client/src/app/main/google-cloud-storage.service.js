export class GoogleCloudStorageService {
    constructor () {
        'ngInject';
    }

    // getTec() {
    //     return this.data;
    // }
}


//
// var googleApiScopes = [
//     'https://www.googleapis.com/auth/devstorage.read_write'
// ];
// var googleApiScopesString = googleApiScopes.join(' ');
//
// var uploadFile = function (blob, bucketName, objectName,
//                            onFulfilledHandler, onRejectedHandler) {
//     var boundary = '-------314159265358979323846';
//     var delimiter = "\r\n--" + boundary + "\r\n";
//     var close_delim = "\r\n--" + boundary + "--";
//
//     var reader = new FileReader();
//     reader.readAsBinaryString(blob);
//     reader.onload = function (e) {
//         var contentType = blob.type || 'application/octet-stream';
//         var metadata = {
//             'name': objectName,
//             'mimeType': contentType
//         };
//         var base64Data = btoa(reader.result);
//         var multipartRequestBody =
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
//         var parameters = {
//             'path': '/upload/storage/v1/b/' + bucketName + '/o',
//             'method': 'POST',
//             'params': {'uploadType': 'multipart'},
//             'headers': {
//                 'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
//             },
//             'body': multipartRequestBody
//         };
//
//         var request = gapi.client.request(parameters);
//         var context = {};
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
// var startResumableUploadSession = function (blob, bucketName, objectName) {
//     var contentType = blob.type || 'application/octet-stream';
//     var fileSize = blob.size;
//     var metadata = {
//         'name': objectName,
//         'mimeType': contentType
//     };
//     var payload = JSON.stringify(metadata);
//     var parameters = {
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
//     var promise = gapi.client.request(parameters);
//     return promise.then(function (response) {
//         return response.headers.location;
//     });
//     //.catch(function (error) {
//     //$log.error('Error occurred while sending initial POST request to GCS:' + JSON.stringify(error));
//     //return undefined;
//     //});
// };
//
// var step = (256 * 1024);
//
// var uploadFileWithResumableUploadSession = function (resumableUri,
//                                                      blob,
//                                                      onFulfilledHandler,
//                                                      onRejectedHandler) {
//     $log.info('Resumable upload URI: ' + resumableUri);
//     var startIndex = 0;
//     var lastByteIndex = blob.size - 1;
//     var endIndex = Math.min(step, lastByteIndex);
//     var continueProcessing = true;
//     while (continueProcessing && startIndex < blob.size) {
//         var sliceBlob = blob.slice(startIndex, endIndex);
//         var slice = {start: startIndex, stop: endIndex, sliceBlob: sliceBlob};
//         var response = processSliceBlob(resumableUri, blob, slice);
//         if (response !== undefined) {
//             startIndex += step;
//             endIndex = Math.min((startIndex + step), lastByteIndex);
//         } else {
//             continueProcessing = false;
//         }
//     }
// };
//
// var processSliceBlob = function (resumableUri, entireBlob, slice) {
//     var reader = new FileReader();
//     var deferred = $q.defer();
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
// var uploadSliceData = function (resumableUri, entireBlob, slice, binaryData) {
//     var contentType = slice.sliceBlob.type || 'video/mp4';
//     var contentRange = 'bytes ' + slice.start + '-' + slice.stop  + '/' + entireBlob.size;
//     $log.info("Content-Range: " + contentRange);
//     var dataLength = binaryData.length;
//     var parameters = {
//         'path': resumableUri,
//         'method': 'PUT',
//         'headers': {
//             'Content-Type': contentType,
//             'Content-Range': contentRange
//         },
//         'body': dataLength.toString(16) + '\r\n' + binaryData + '\r\n0\r\n'
//     };
//     var promise = gapi.client.request(parameters);
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
// var triggerProgressEvent = function (sliceStop, entireBlobSize) {
//     var percentLoaded = Math.round((sliceStop / entireBlobSize) * 100);
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
//         var title = 'Untitled video';
//         if (this.selectedFile !== undefined) {
//             var parts = this.selectedFile.name.split('.');
//             title = '';
//             for (var i = 0; i < parts.length - 1; i++) {
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

