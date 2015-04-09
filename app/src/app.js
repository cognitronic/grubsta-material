/**
 * Created by Danny Schreiber on 3/16/15.
 */

/* jshint -W117 */
angular.module('grubsta')
	.config(function(
		$httpProvider,
		$stateProvider,
		$locationProvider,
		$urlRouterProvider,
		$urlMatcherFactoryProvider,
		$mdThemingProvider) {

		$urlMatcherFactoryProvider.strictMode(false);
		//$mdThemingProvider.theme('default')
		//	.primaryPalette('light-blue')
		//	.accentPalette('blue');

		var customRedMap = $mdThemingProvider.extendPalette('red', {
			'contrastDefaultColor': 'light',
			'contrastDarkColors': ['50'],
			'50': 'ffffff'
		});
		$mdThemingProvider.definePalette('customRed', customRedMap);
		$mdThemingProvider.theme('default')
			.primaryPalette('customRed', {
				'default': '500',
				'hue-1': '50'
			})
			.accentPalette('pink');
		$mdThemingProvider.theme('input', 'default')
			.primaryPalette('grey');

		//sets the content type header globally for $http calls
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
		$httpProvider.defaults.headers.put['Content-Type'] = 'application/json; charset=UTF-8';
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
		$httpProvider.defaults.headers['delete'] = {'Content-Type': 'application/json; charset=UTF-8'};
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('dashboard', {
				url: '/',
				views: {
					'header@': {
						templateUrl: 'app/src/common/layout/header.html',
						controller: 'HeaderController as hc'
					},
					'left-sidebar@': {
						templateUrl: 'app/src/common/layout/left-sidebar.html',
						controller: 'LeftSidebarController as lsc'
					},
					'right-sidebar@': {
						templateUrl: 'app/src/common/layout/right-sidebar.html',
						controller: 'RightSidebarController as rsc'
					},
					'main-content@': {
						templateUrl: 'app/src/dashboard/dashboard.html',
						controller: 'DashboardController as vm'
					}
				}
			});
	});


