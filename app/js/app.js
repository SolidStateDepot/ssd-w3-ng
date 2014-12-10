'use strict';
/**
 * Module dependencies
 */
var appDependencies = ['ngRoute',
	'ngSanitize',
	'ngCookies',
	'ngAnimate',
	'ui.bootstrap',
	'pascalprecht.translate',
	'google-maps'.ns(),
	'ui.calendar',
	'SSDW3.filters',
	'SSDW3.services',
	'SSDW3.directives',
	'SSDW3.controllers'
];
/**
 * Start of block required for e2e tests
 */
var mocks = parent.parent ? parent.parent.mocks : parent.mocks;
mocks = mocks || [];
var dependencies = (mocks ? mocks : []).concat(appDependencies);
/**
 * End of block required for e2e tests
 */
/**
 * Configuration
 */
// Declare app level module which depends on filters, and services
var ssdApp = angular.module('SSDW3', appDependencies);
ssdApp.config(['$routeProvider', '$translateProvider', 'GoogleMapApiProvider'.ns(),
		function($routeProvider, $translateProvider, GoogleMapApi) {
	$routeProvider.when('/donate', {templateUrl: 'partials/donate.html', controller: 'DonateCtrl'});
	$routeProvider.when('/news', {templateUrl: 'partials/news.html', controller: 'NewsCtrl'});
	$routeProvider.when('/events', {templateUrl: 'partials/events.html', controller: 'EventCtrl'});
	$routeProvider.when('/wiki', {templateUrl: 'partials/wiki.html', controller: 'WikiCtrl'});
	$routeProvider.when('/presents', {templateUrl: 'partials/presentations.html', controller: 'PresentCtrl'});
	$routeProvider.when('/contact', {templateUrl: 'partials/contactssd.html', controller: 'ContactSSDCtrl'});
	$routeProvider.when('/projects', {templateUrl: 'partials/projects.html', controller: 'PresentCtrl'});
	$routeProvider.when('/photos', {templateUrl: 'partials/photos.html', controller: 'ContactSSDCtrl'});
	$routeProvider.when('/docs', {templateUrl: 'partials/docs.html', controller: 'DocsCtrl'});
	$routeProvider.when('/about', {templateUrl: 'partials/about.html', controller: 'AboutCtrl'});
	$routeProvider.when('/postdetail/:postId', {templateUrl: 'partials/postdetail.html', controller: 'PostDetailCtrl'});
	$routeProvider.otherwise({redirectTo: '/news'});
	$translateProvider.useStaticFilesLoader({
		prefix : 'l10n/',
		suffix : '.json'
	});
	$translateProvider.preferredLanguage('en_US');
	$translateProvider.useCookieStorage();
	GoogleMapApi.configure({
		//key: '0So5Hp0UV09dLV9rOLqmOv9XXj-SBCR9zxC9L0Q',
		v: '3.17',
		libraries: 'weather,geometry,visualization'
	});
}]);
/**
 * Start of block required for e2e tests
 */
if (undefined != mocks.initializeMocks) {
	ssdApp.run(mocks.initializeMocks);
}
/**
 * End of block required for e2e tests
 */
 