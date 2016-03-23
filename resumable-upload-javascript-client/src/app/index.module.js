/* global malarkey:false, moment:false */

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
    'toastr'
];

angular.module('resumableUploadJavascriptClient', dependencies)
    .config(config)
    .config(routerConfig)
    .run(runBlock)
    .service('GoogleCloudStorageService', GoogleCloudStorageService)
    .controller('MainController', MainController);
