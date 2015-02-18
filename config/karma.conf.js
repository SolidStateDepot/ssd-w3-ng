module.exports = function(config) {
	config.set({
		basePath : '../',

		files : [ 'bower_components/angular/angular.js',
				'bower_components/angular-mocks/angular-mocks.js',
				'bower_components/angular-animate/angular-animate.js',
				'bower_components/angular-cookies/angular-cookies.js',
				'bower_components/angular-route/angular-route.js',
				'bower_components/angular-sanitize/angular-sanitize.js',
				'bower_components/angular-animate/angular-animate.js',
				'bower_components/angular-bootstrap/ui-bootstrap.js',
				'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
				'bower_components/angular-cookies/angular-cookies.js',
				'bower_components/angular-google-maps/dist/angular-google-maps.js',
				'bower_components/angular-google-maps/dist/angular-google-maps_dev_mapped.js',
				'bower_components/angular-translate/angular-translate.js',
				'bower_components/angular-cookies/angular-cookies.js',
				'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
				'bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
				'bower_components/angular-ui-calendar/src/calendar.js',
				'bower_components/fullcalendar/dist/fullcalendar.js',
				'bower_components/fullcalendar/dist/lang-all.js',
				'bower_components/fullcalendar/dist/gcal.js',
				'bower_components/lodash/dist/lodash.js',
				'bower_components/moment/moment.js',
				'app/js/**/*.js', 'test/unit/**/*.js' ],

		exclude : [ 'app/lib/angular/angular-loader.js',
				'app/lib/angular/*.min.js',
				'app/lib/angular/angular-scenario.js' ],

		autoWatch : true,

		frameworks : [ 'jasmine' ],

		browsers : [ 'PhantomJS' ],

		logLevel : config.LOG_INFO,

		plugins : [ 'karma-junit-reporter', 'karma-chrome-launcher',
				'karma-firefox-launcher', 'karma-phantomjs-launcher',
				'karma-jasmine' ],

		// Uncomment the following lines if you are using grunt's server to run
		// the tests
		// proxies: {
		// '/': 'http://localhost:9000/'
		// },
		// URL root prevent conflicts with the site root
		// urlRoot: '_karma_'

		junitReporter : {
			outputFile : 'test_out/unit.xml',
			suite : 'unit'
		}

	})
}
