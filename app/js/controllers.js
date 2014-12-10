'use strict';

/* Controllers */

var ssdApp = angular.module('SSDW3.controllers', []);

ssdApp.controller('AppCtrl', [
		'$scope',
		'$rootScope',
		'$route',
		'$window',
		'$location',
		'$routeParams',
		'$filter',
		'$sanitize',
		'$translate',
		'Rest',
		function($scope, $rootScope, $route, $window, $location, $routeParams,
				$filter, $sanitize, $translate, Rest) {
			$scope.topnav = [ {
				active : false,
				path : '/news',
				label : 'NAV_NEWS'
			}, {
				active : false,
				path : '/events',
				label : 'NAV_EVENTS'
			}, {
				active : false,
				path : '/wiki',
				label : 'NAV_WIKI'
			}, {
				active : false,
				path : '/presents',
				label : 'NAV_PRESO'
			}, {
				active : false,
				path : '/projects',
				label : 'NAV_PROJECTS'
			}, {
				active : false,
				path : '/contact',
				label : 'NAV_CONTACT'
			}, {
				active : false,
				path : '/photos',
				label : 'NAV_PHOTOS'
			}, {
				active : false,
				path : '/docs',
				label : 'NAV_DOCS'
			}, {
				active : false,
				path : '/about',
				label : 'NAV_ABOUT'
			}, {
				active : false,
				path : '/donate',
				label : 'NAV_DONATE'
			} ];
			$rootScope.thirdlev = { ssdPosts : [], ssdEvents : [] };
			$scope.goToNav = function(path) {
				$location.url(path);
			};
			$scope.setPreferredLanguage = function(langKey) {
				$translate.use(langKey);
			};
			$scope.updateNavState = function() {
				var currentContext = $location.url().split("/");
				$scope.topNavClasses = [];
				var i = 0;
				// console.log(currentContext[1]);
				for (i = 0; i < $scope.topnav.length; i++) {
					if ($scope.topnav[i].path == '/' + currentContext[1]) {
						$scope.topnav[i].active = true;
						$scope.topNavClasses[i] = 'active';
					} else {
						$scope.topnav[i].active = false;
						$scope.topNavClasses[i] = '';
					}
				}
			};
			$rootScope.$on('$routeChangeSuccess', $scope.updateNavState);
			$scope.updateNavState();
			$scope.randomLogo = function() {
				$scope.logoSrc = 'img/ssd_logo_'
						+ Math.floor(Math.random() * 10) + '.png';
			};
			$scope.randomHeaderBg = function() {
				$scope.headerBgClass = 'navbar-bg-' + Math.floor(Math.random() * 5);
			};
			$scope.randomHeaderBg();
			$scope.randomLogo();
			//$scope.logoSrc = 'img/ssd_logo_6.png';
		} ]);

ssdApp.controller('ContactSSDCtrl', [
		'$scope',
		'$translate',
		'GoogleMapApi'.ns(),
		function($scope, $translate, GoogleMapApi) {
			$scope.map = {
				center : {
					latitude : 40.0216838,
					longitude : -105.2501556
				},
				zoom : 15
			};
			$scope.options = {
				scrollwheel : false
			};
			GoogleMapApi.then(function(maps) {
			});
			$scope.marker = {
				id : 0,
				coords : {
					latitude : 40.02155131437684,
					longitude : -105.2501663288603
				},
				options : {
					draggable : true
				},
				events : {
					dragend : function(marker, eventName, args) {
						// $log.log('marker dragend');
						var lat = marker.getPosition().lat();
						var lon = marker.getPosition().lng();
						// $log.log(lat);
						// $log.log(lon);

						$scope.marker.options = {
							draggable : true,
							labelContent : "lat: "
									+ $scope.marker.coords.latitude + ' '
									+ 'lon: ' + $scope.marker.coords.longitude,
							labelAnchor : "100 0",
							labelClass : "marker-labels"
						};
					}
				}
			};
		} ]);

ssdApp
		.controller(
				'NewsCtrl',
				[
						'$rootScope',
						'$scope',
						'$translate',
						'Rest',
						'$sce',
						'$filter',
						function($rootScope, $scope, $translate, Rest, $sce, $filter) {
							$scope.slides = [
									{
										image : 'img/slides/img00.jpg',
										description : $translate
												.instant('SLIDE_DESC_00')
									},
									{
										image : 'img/slides/img01.jpg',
										description : $translate
												.instant('SLIDE_DESC_01')
									},
									{
										image : 'img/slides/img02.jpg',
										description : $translate
												.instant('SLIDE_DESC_02')
									},
									{
										image : 'img/slides/img03.jpg',
										description : $translate
												.instant('SLIDE_DESC_03')
									},
									{
										image : 'img/slides/img04.jpg',
										description : $translate
												.instant('SLIDE_DESC_04')
									} ];
							$scope.direction = 'left';
							$scope.currentIndex = 0;
							$scope.setCurrentSlideIndex = function(index) {
								$scope.direction = (index > $scope.currentIndex) ? 'left'
										: 'right';
								$scope.currentIndex = index;
							};
							$scope.isCurrentSlideIndex = function(index) {
								return $scope.currentIndex === index;
							};
							$scope.prevSlide = function() {
								$scope.direction = 'left';
								$scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex
										: 0;
							};
							$scope.nextSlide = function() {
								$scope.direction = 'right';
								$scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex
										: $scope.slides.length - 1;
							};
							$scope.newsLoadingClass = 'hidden';
							$scope.transformWPURL2NG = function(rawContent) {
								var transformed = rawContent;
								transformed = transformed
								.replace(
										/href=(?:['|"])*http:(?:[/|\\|\/])*www.boulderhackerspace.com([^']*)(?:['|"])*/g,
										"href='#\/postdetail/$1'");
								return transformed;
							};
							// setup pagination
							$scope.currentPage = 1;
							$scope.pageSize = 10;
							$scope.allPostItems = $rootScope.thirdlev.ssdPosts.length;
							$scope.postsFilter = '';
							// load items from API if empty/incomplete
							if ($scope.pageSize >= $rootScope.thirdlev.ssdPosts.length) {
								$scope.loadingLabel = $translate.instant('LOADING');
								$scope.newsLoadingClass = 'visible';
								var p = Rest.getLatestPosts($scope.pageSize, 1);	// first get page size items
								p
										.then(
												function(data) {
													data.data = Rest.filterHackerspaceDotComJSONHeaderFOO(data.data);
													data.data = angular.fromJson(data.data);
													if (data.data && data.data.posts) {
														$scope.newsLoadingClass = 'hidden';
														for (var i = 0; i < data.data.posts.length; i++) {
															$rootScope.thirdlev.ssdPosts[i] = {};
															$rootScope.thirdlev.ssdPosts[i].date = data.data.posts[i].date;
															$rootScope.thirdlev.ssdPosts[i].modified = data.data.posts[i].modified;
															$rootScope.thirdlev.ssdPosts[i].title = data.data.posts[i].title.replace(/http:(?:[/|\\|\/])*www.boulderhackerspace.com(?:[^\/]*)\/(.*)/g,
																	"#\/postdetail/$1")
																	.replace('&#8211;', '-')
																	.replace('&#8217;', '\'');
	// $scope.allPosts[i].url =
	// data.data.posts[i].url.replace(/http:(?:[/|\\|\/])*blog.terawattindustries.com(?:[^\/]*)\/(.*)/g,
	// "#\/postdetail/$1");
															$rootScope.thirdlev.ssdPosts[i].url = "#\/postdetail/" + data.data.posts[i].id;
															$rootScope.thirdlev.ssdPosts[i].id = data.data.posts[i].id;
															// http://blog.terawattindustries.com/wp-content/uploads/2014/05/Print3r-for-Android-150x150.png
															$rootScope.thirdlev.ssdPosts[i].content = $sce
																	.trustAsHtml($scope.transformWPURL2NG(data.data.posts[i].content));
														}
													}
													$scope.allPostItems = $rootScope.thirdlev.ssdPosts.length;
													$scope.pagedPosts = $scope.groupToPages(
															$rootScope.thirdlev.ssdPosts,
															$scope.pageSize,
															$scope.postsFilter,
															'date',
															true);
														// console.log($scope.pagedPosts);
														// get remainder of items
														$scope.loadingLabel = $translate.instant('LOADING_MORE');
														$scope.newsLoadingClass = 'visible';
														var p2 = Rest.getLatestPosts(10000, 1);	// first get page size items
														p2
																.then(
																		function(data) {
																			data.data = Rest.filterHackerspaceDotComJSONHeaderFOO(data.data);
																			data.data = angular.fromJson(data.data);
																			if (data.data && data.data.posts) {
																				$scope.newsLoadingClass = 'hidden';
																				for (var i = $scope.pageSize; i < data.data.posts.length; i++) {
																					$rootScope.thirdlev.ssdPosts[i] = {};
																					$rootScope.thirdlev.ssdPosts[i].date = data.data.posts[i].date;
																					$rootScope.thirdlev.ssdPosts[i].modified = data.data.posts[i].modified;
																					$rootScope.thirdlev.ssdPosts[i].title = data.data.posts[i].title.replace(/http:(?:[/|\\|\/])*www.boulderhackerspace.com(?:[^\/]*)\/(.*)/g,
																							"#\/postdetail/$1")
																							.replace('&#8211;', '-')
																							.replace('&#8217;', '\'');
																					$rootScope.thirdlev.ssdPosts[i].url = "#\/postdetail/" + data.data.posts[i].id;
																					$rootScope.thirdlev.ssdPosts[i].id = data.data.posts[i].id;
																					$rootScope.thirdlev.ssdPosts[i].content = $sce
																							.trustAsHtml($scope.transformWPURL2NG(data.data.posts[i].content));
																				}
																			}
																			$scope.allPostItems = $rootScope.thirdlev.ssdPosts.length;
																			$scope.pagedPosts = $scope.groupToPages(
																					$rootScope.thirdlev.ssdPosts,
																					$scope.pageSize,
																					$scope.postsFilter,
																					'date',
																					true);
																		}, function(error) {
																			console.log('could not retrieve remainder of news posts - error was \n' + err);
																		});
													 
												}, function(err) {
													console.log('could not retrieve news posts - error was \n' + err);
												});
							}	// if
							$scope.groupToPages = function(items, itemsPerPage,
									filterQuery, sortProp, reverseSort) {
								if (!items) {
console.log('invalid arg, exiting');
									return items;
								}
								var ret = [];
								// filtering
								var newList = $filter('filter')(items,
										filterQuery);
								$scope.totalItems = newList.length;
								// sorting
								newList = $filter('orderBy')(newList, sortProp,
										reverseSort);
								// grouping
								for ( var i = 0; i < newList.length; i++) {
									if (i % itemsPerPage === 0) {
										ret[Math.floor(i / itemsPerPage)] = [ newList[i] ];
									} else {
										ret[Math.floor(i / itemsPerPage)]
												.push(newList[i]);
									}
								}
console.log(ret);
								return ret;
							};
							$scope.pagedPosts = $scope.groupToPages(
								$rootScope.thirdlev.ssdPosts,
								$scope.pageSize,
								$scope.postsFilter,
								'date',
								true);
						} ]);

ssdApp.controller('PostDetailCtrl', ['$scope', '$routeParams', '$sce', '$translate', 'Rest', 
		function($scope, $routeParams, $sce, $translate, Rest) {
			$scope.post = { title : '', contents : '', date : '', modified : ''};
			// get ID etc. from url hash
			var p = Rest.getPostDetails($routeParams.postId);
			p.then(function(data) {
				data.data = Rest.filterHackerspaceDotComJSONHeaderFOO(data.data);
				data.data = angular.fromJson(data.data);
				if (data.data && data.data.post) {
					$scope.post = data.data.post;
					$scope.post.title = $scope.post.title_plain.replace('&#8211;', '-')
						.replace('&#8217;', '\'');
					$scope.post.content = $sce.trustAsHtml(data.data.post.content);
				}
			}, function(err) {
				console.log('error retrieving post content - error was\n' + err);
			});
}]);
ssdApp.controller('DonateCtrl', [ '$scope', '$sanitize', '$translate',
		function($scope, $sanitize, $translate) {
			$scope.mainContent1 = $translate.instant('DONATE_CONTENT_1');
			$scope.mainContent2 = $translate.instant('DONATE_CONTENT_2');
			$scope.mainContent3 = $translate.instant('DONATE_CONTENT_3');
		} ]);

ssdApp
		.controller(
				'EventCtrl',
				[
						'$rootScope',
						'$scope',
						'$translate',
						'Rest',
						function($rootScope, $scope, $translate, Rest) {
							$scope.closeEventDialog = function() {
								$scope.evtOverlayClass = 'hidden';
							};
							$scope.openEventDialog = function(date, jsEvent, view) {
								// console.log(date);
								$scope.eventDetails = date;
								$scope.evtOverlayClass = 'visible';
							};
							$scope.uiConfig = {
								calendar:{
								editable: false,
								eventClick: $scope.openEventDialog
								}
							};
							$scope.calLoadingClass = $scope.evtOverlayClass = 'hidden';
							$scope.eventSources = [ $rootScope.thirdlev.ssdEvents ];
							if (1 > $rootScope.thirdlev.ssdEvents.length) {
								$scope.calLoadingClass = 'visible';
								var p = Rest.getSSDMeetupEventsCalendar();
								p.success = function(data) {
									$scope.eventSources = [];
									if (angular.isDefined(data.data.results)
											&& angular.isDefined(data.data.results)) {
										for ( var i = 0; i < data.data.results.length; i++) {
											$rootScope.thirdlev.ssdEvents[i] = {};
											$rootScope.thirdlev.ssdEvents[i].title = data.data.results[i].name;
											$rootScope.thirdlev.ssdEvents[i].event_url = data.data.results[i].event_url;
											$rootScope.thirdlev.ssdEvents[i].id = data.data.results[i].id;
											$rootScope.thirdlev.ssdEvents[i].start = new Date(
													(data.data.results[i].time + data.data.results[i].utc_offset));
											$rootScope.thirdlev.ssdEvents[i].duration = data.data.results[i].duration;
											if (!angular
													.isDefined(data.data.results[i].duration)) {
												$rootScope.thirdlev.ssdEvents[i].allday = true;
											} else {
												$rootScope.thirdlev.ssdEvents[i].allday = false;
												$rootScope.thirdlev.ssdEvents[i].end = new Date(
														(data.data.results[i].time
																+ data.data.results[i].utc_offset + data.data.results[i].duration));
											}
										}
										$scope.eventSources = [ $rootScope.thirdlev.ssdEvents ];
										$scope.calLoadingClass = 'hidden';
										console.log("updated cal events");
									} else {
										$scope.calLoadingClass = 'hidden';
										console
												.log("could not retrieve cal events");
									}
								};
								p.error = function(err) {
									$scope.calLoadingClass = 'hidden';
									console
											.log("could not retrieve cal events");
								};
								p.then(p.success, p.error);
							}
						} ]);

ssdApp.controller('WikiCtrl', [ '$scope', '$translate',
		function($scope, $translate) {
		} ]);

ssdApp
		.controller(
				'AboutCtrl',
				[
						'$scope',
						'$sanitize',
						'$translate',
						function($scope, $sanitize, $translate) {
							$scope.mainContent1 = $translate
									.instant(
											'ABOUT_CONTENT',
											{
												url2 : 'http://www.youtube.com/watch?v=u-jT4Nxbyuk&p=20D9A9637AC71B71',
												url1 : 'http://www.hackerspaces.org/'
											});
						} ]);

ssdApp.controller('SafetyFirstCtrl', [ '$scope', '$translate',
		function($scope, $translate) {
		} ]);

ssdApp
		.controller(
				'PhotoCtrl',
				[
						'$scope',
						'$translate',
						'Rest',
						function($scope, $translate, Rest) {
							$scope.flickrLoadingClass = 'visible';
							$scope.flickrErrorClass = 'hidden';
							var p = Rest.getSSDFlickrPhotos();
							p
									.then(
											function(data) {
												// console.log(data.data);
												var f = new Function(
														"jsonFlickrApi",
														data.data);
												f(function(data) {
													// http://c3.staticflickr.com/3/2923/14104949136_70aa10d478_n.jpg
													/*
													 * jsonFlickrApi({"photos":{"page":1,"pages":3,"perpage":100,"total":"292","photo":[{"id":"14104949136","owner":"8728129@N05","secret":"70aa10d478","server":"2923","farm":3,"title":"Horse
													 * race
													 * game","ispublic":1,"isfriend":0,"isfamily":0,"safe":0}]},"stat":"ok"})
													 */

													if (data.stat == 'fail') {
														console.log('failed to get photos.  err=');
														console.log(data);
														$scope.flickrLoadingClass = 'hidden';
														$scope.flickrErrorClass = 'visible';
													} else if (data.stat == 'ok') {
														$scope.flickrLoadingClass = 'hidden';
														$scope.flickrErrorClass = 'hidden';
														$scope.flickrPhotos = data.photos.photo;
														for ( var i = 0; i < data.photos.photo.length; i++) {
															$scope.flickrPhotos[i].src = 'http://';
															$scope.flickrPhotos[i].src += 'c'
																	+ data.photos.photo[i].farm
																	+ '.staticflickr.com/'
																	+ data.photos.photo[i].farm
																	+ '/'
																	+ data.photos.photo[i].server
																	+ '/';
															$scope.flickrPhotos[i].src += data.photos.photo[i].id
																	+ '_'
																	+ data.photos.photo[i].secret
																	+ '.jpg';
															data.photos.photo[i].id;
															$scope
														}
													}
												});
											}, function(err) {
												console.log('failed to get photos.  err=');
												console.log(err);
												$scope.flickrLoadingClass = 'hidden';
												$scope.flickrErrorClass = 'visible';
											});
							// Scroll to appropriate position based on image
							// index and width
							$scope.scrollTo = function(image, ind) {
								var offset = 0;
								var fullSizeGalleryImgs = document
										.getElementsByClassName('fullsize');
								for ( var i = 0; i < ind; i++) {
									offset += fullSizeGalleryImgs[i].width;
								}
								$scope.listposition = {
									left : (offset * -1) + "px"
								};
								$scope.selected = image;
							};
						} ]);

ssdApp.controller('FriendsCtrl', [ '$scope', '$translate',
		function($scope, $translate) {
			// TODO translate l10n
			$scope.friendsLinks = [ {
				name : 'CU Hackerspace Club Google Group',
				url : 'http://groups.google.com/group/cu-hackerspace-club'
			}, {
				name : 'Phoenix Asylum',
				url : 'http://phoenixasylum.org'
			}, {
				name : 'SparkFun Electronics',
				url : 'http://www.sparkfun.com/'
			}, {
				name : 'Boulder Engineering Studio',
				url : 'http://boulderes.com/'
			}, {
				name : 'Terawatt Industries 3D Printers',
				url : 'https://store.terawattindustries.com/'
			}, {
				name : 'Lulzbot 3-D Printers',
				url : 'http://www.lulzbot.com/'
			}, {
				name : 'Boulder Community Computers',
				url : 'http://www.bococo.org/'
			}, {
				name : 'Hackerspaces Wiki',
				url : 'http://www.hackerspaces.org'
			}, {
				name : 'Hackerspaces Directory',
				url : 'http://hackerspaces.org/wiki/List_of_Hacker_Spaces'
			}, {
				name : 'Hack a Day',
				url : 'http://hackaday.com/'
			}, {
				name : 'Sticker Giant',
				url : 'http://www.stickergiant.com/'
			}, {
				name : 'DenHac: Denver Hackerspace',
				url : 'http://www.denhac.org/'
			}, {
				name : 'Handdrafted',
				url : 'http://handdrafted.com/'
			}, {
				name : 'AlphaOne Labs',
				url : 'http://www.alphaonelabs.com'
			}, {
				name : 'Pumping Station: One',
				url : 'http://pumpingstationone.org/'
			}, {
				name : 'The Transistor: Provo, Utah Hackerspace',
				url : 'http://thetransistor.com/'
			} ];
		} ]);

ssdApp.controller('RecentPostsHomeCtrl', ['$scope', '$translate', 'Rest', function($scope, $translate, Rest) {
	$scope.recentPosts = [];
	var p = Rest.getLatestPosts(10, 1);
	p.then(
		function(data) {
			data.data = Rest.filterHackerspaceDotComJSONHeaderFOO(data.data);
			data.data = angular.fromJson(data.data);
			if (data.data && data.data.posts) {
				$scope.newsLoadingClass = 'hidden';
				for ( var i = 0; i < data.data.posts.length; i++) {
					$scope.recentPosts[i] = {};
					$scope.recentPosts[i].date = data.data.posts[i].date;
					$scope.recentPosts[i].modified = data.data.posts[i].modified;
					$scope.recentPosts[i].title = data.data.posts[i].title_plain.replace('&#8211;', '-')
						.replace('&#8217;', '\'');
					$scope.recentPosts[i].url = "#\/postdetail/" + data.data.posts[i].id;
					$scope.recentPosts[i].id = data.data.posts[i].id;
				}
			}
		}, function(err) {
			console.log('could not retrieve recent posts - error was \n' + err);
		});
}]);

ssdApp
		.controller(
				'PresentCtrl',
				[
						'$scope',
						'$translate',
						function($scope, $translate) {
							// TODO translate l10n
							$scope.presentations = [
									{
										name : 'Advanced Slic3r for 3D Printing',
										type : 'S5',
										url : 'https://github.com/SolidStateDepot/ssd-class-lp3d-adv-slicing'
									},
									{
										name : 'OpenSCAD 101',
										type : 'S5',
										url : 'https://github.com/SolidStateDepot/ssd-class-oscad-101'
									} ];
						} ]);

ssdApp
		.controller(
				'ProjectCtrl',
				[
						'$scope',
						'$translate',
						function($scope, $translate) {
							$scope.ghprojects = [
									{
										name : 'printer-3d',
										original : true,
										url : 'https://github.com/SolidStateDepot/printer-3d'
									},
									{
										name : 'CNC_Mill',
										original : true,
										url : 'https://github.com/SolidStateDepot/CNC_Mill'
									},
									{
										name : 'SSD_Cymatics_project',
										original : true,
										url : 'https://github.com/SolidStateDepot/SSD_Cymatics_project'
									},
									{
										name : 'ChibiOS-RT',
										original : false,
										url : 'https://github.com/printer-3d/SolidStateDepot/ChibiOS-RT'
									},
									{
										name : 'SSD-Workspace-Models',
										original : true,
										url : 'https://github.com/SolidStateDepot/SSD-Workspace-Models'
									} ];
						} ]);

ssdApp
		.controller(
				'DocsCtrl',
				[
						'$scope',
						'$translate',
						function($scope, $translate) {
							$scope.docs = [
									{
										name : 'DOC_TITLE_RELEASE',
										type : 'DOC_TYPE_FORM',
										desc : 'DOC_DESC_RELEASE',
										url : 'pdf/SSDLiabilityRelease.pdf'
									},
									{
										name : 'DOC_TITLE_MEMB_AGREEMENT',
										type : 'DOC_TYPE_FORM',
										desc : 'DOC_DESC_MEMB_AGREEMENT',
										url : 'pdf/SSDMembershipAgreement.pdf'
									},
									{
										name : 'DOC_TITLE_BYLAWS',
										type : 'DOC_TYPE_PLAIN',
										desc : 'DOC_DESC_BYLAWS',
										url : 'pdf/SolidStateDepotBylaws-FinalDraft.pdf'
									},
									{
										name : 'DOC_TITLE_NEWMEMBERORIENT',
										type : 'DOC_TYPE_PLAIN',
										desc : 'DOC_DESC_NEWMEMBERORIENT',
										url : 'http://boulderhackerspace.com/wiki/index.php?title=New_Member_Orientation'
									}, ];
						} ]);

ssdApp.animation('.slide-animation', function() {
	return {
		beforeAddClass : function(element, className, done) {
			var scope = element.scope();

			if (className == 'ng-hide') {
				var finishPoint = element.parent().width();
				if (scope.direction !== 'right') {
					finishPoint = -finishPoint;
				}
				TweenMax.to(element, 0.5, {
					left : finishPoint,
					onComplete : done
				});
			} else {
				done();
			}
		},
		removeClass : function(element, className, done) {
			var scope = element.scope();

			if (className == 'ng-hide') {
				element.removeClass('ng-hide');

				var startPoint = element.parent().width();
				if (scope.direction === 'right') {
					startPoint = -startPoint;
				}

				TweenMax.fromTo(element, 0.5, {
					left : startPoint
				}, {
					left : 0,
					onComplete : done
				});
			} else {
				done();
			}
		}
	};
});