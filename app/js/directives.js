'use strict';

/* Directives */
var directives = angular.module('SSDW3.directives', []);
directives.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

directives.directive('hiddenIframe', [ function() {
	return {
		restrict : 'E',
		transclude : false,
		scope : {
			url : '=url',
		},
		template : '<iframe class="gone"></iframe>',
		link : function link(scope, element, attrs) {

			var el = angular.element(element.children()[0]);
			// console.log(el);
			el.attr('src', scope.url);

			scope.$watch('url', function(value) {
				el.attr('src', scope.url);
			});

			element.on('$destroy', function() {
				// implement
			});
		}
	}
} ]);
