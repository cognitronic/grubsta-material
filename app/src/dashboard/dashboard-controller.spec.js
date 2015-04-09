/**
 * Created by Danny Schreiber on 4/2/15.
 */

describe('Dashboard Controller', function() {
	var $scope;
	var $controller;
	var $templateCache;
	var $location;
	var $state;

	beforeEach(module('grubsta'));
	beforeEach(inject(init));


	function fixturesAndSetup() {

		$templateCache.put('app/src/common/layout/header.html', 'app/src/common/layout/header.html');
		$templateCache.put('app/src/common/layout/left-sidebar.html', 'app/src/common/layout/left-sidebar.html');
		$templateCache.put('app/src/common/layout/right-sidebar.html', 'app/src/common/layout/right-sidebar.html');
		$templateCache.put('app/src/dashboard/dashboard.html', 'app/src/dashboard/dashboard.html');
	}

	function init(_$rootScope_, _$controller_, _$templateCache_, _$state_, _$location_) {
		$scope = _$rootScope_.$new();
		$state = _$state_;
		$location = _$location_;
		$templateCache = _$templateCache_;
		$controller = _$controller_('DashboardController as vm', {
			$scope: $scope
		});

		fixturesAndSetup();
	}

	describe('when init is called', function() {
		it('should do nothing', function() {
			//expect($scope.vm.feed).to.be.ok;

			expect($scope.vm.feed.length).to.equal(5);

		});
	});

});
