
import {constants} from './index.constants';
import {config} from './index.config';
import {routerConfig} from './index.route';
import {runBlock} from './index.run';
import {MainController} from './main/main.controller';
import {GoogleCloudStorageService} from './main/google-cloud-storage.service';


const dependencies = [
    'ngAnimate',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ngMessages',
    'ngAria',
    'ui.router',
    'ngMaterial',
    'toastr', 
    'angular-google-gapi'
];

angular.module('resumableUploadJavascriptClient', dependencies)
    .constant('configuration', constants)
    .config(config)
    .config(routerConfig)
    .run(runBlock)
    .service('GoogleCloudStorageService', GoogleCloudStorageService)
    .controller('MainController', MainController);
