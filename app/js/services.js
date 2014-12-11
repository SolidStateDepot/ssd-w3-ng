'use strict';
/* Services */
var services = angular.module('SSDW3.services', []);
// register simple value service
services.value('version', '2.0');
// register factory services
services
		.factory(
				'Rest',
				[
						'$http',
						function($http) {
							var proxyWPJson = '../app/proxy-wp.php';
							var proxyMeetup = '../app/proxy-meetup.php';
							var proxyFlickr = '../app/proxy-flickr.php';
							var service = {};
							service.filterHackerspaceDotComJSONHeaderFOO = function(foo) {
								if (!foo) {
									return foo;
								}
								// console.log(data.data.replace(/HTTP\/1.1 200([\s\S]*)({\"status\")([\s\S]*)/, "$2$3"));
								return foo.replace(/HTTP\/1.1 200([\s\S]*)({\"status\")([\s\S]*)/, "$2$3");
							};
							service.getSSDMeetupEventsCalendar = function() {
								var config = {
									method : 'GET',
									url : proxyMeetup + '?mode=native&url=sign%3Dtrue'
								};
								var promise = $http(config);
								promise.success = function(data) {
									// this callback will be called
									// asynchronously
									// when the response is available
								};
								promise.error = function(data) {
									// called asynchronously if an error occurs
									// or server returns response with an error
									// status.
								};
								promise.then(promise.success, promise.error);
								return promise;
							};
							service.getSSDFlickrPhotos = function() {
								var config = {
									method : 'GET',
									url : proxyFlickr + '?mode=native&url='
								};
								var promise = $http(config);
								promise.success = function(data) {
									// this callback will be called
									// asynchronously
									// when the response is available
								};
								promise.error = function(data) {
									// called asynchronously if an error occurs
									// or server returns response with an error
									// status.
								};
								promise.then(promise.success, promise.error);
								return promise;
							};
							service.getLatestPosts = function(count, page) {
								var config = {
									method : 'GET',
									url : proxyWPJson + '?mode=native&url=get_recent_posts'
										+ (angular.isDefined(page) ? '%26page%3D' + page : '')
										+ (angular.isDefined(count) ? '%26count%3D' + count : '')
								};
								var promise = $http(config);
								promise.success = function(data) {
									// this callback will be called
									// asynchronously
									// when the response is available
								};
								promise.error = function(data) {
									// called asynchronously if an error occurs
									// or server returns response with an error
									// status.
								};
								promise.then(promise.success, promise.error);
								return promise;
							};
							service.getPostDetails = function(id, slug) {
								var config = {
									method : 'GET',
									url : proxyWPJson + '?mode=native&url=get_post'
										+ (angular.isDefined(id) ? '%26id%3D' + id : '')
										+ (angular.isDefined(slug) ? '%26slug%3D' + slug : '')
								};
								var promise = $http(config);
								promise.success = function(data) {
									// this callback will be called
									// asynchronously
									// when the response is available
								};
								promise.error = function(data) {
									// called asynchronously if an error occurs
									// or server returns response with an error
									// status.
								};
								promise.then(promise.success, promise.error);
								return promise;
							};
							return service;
						} ]);
