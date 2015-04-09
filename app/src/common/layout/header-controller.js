/**
 * Created by Danny Schreiber on 3/19/15.
 */

(function() {
	'use strict';
	/* @ngInject */
	var HeaderController = function($mdSidenav, $mdBottomSheet) {
		var hc = this;
		hc.toggleSidenav = toggleSidenav;
		hc.showListBottomSheet = showListBottomSheet;

		console.log('hello');
		function toggleSidenav(menuId) {
			console.log(menuId);
			$mdSidenav(menuId).toggle();
		}

		function showListBottomSheet($event) {
			console.log('bottom sheet clicked');
			$mdBottomSheet.show({
				template: '' +
				'<md-bottom-sheet class="md-list md-has-header"> ' +
				'<md-subheader>Settings</md-subheader> ' +

				'</md-bottom-sheet>',
				targetEvent: $event
			}).then(function(clickedItem) {
				console.log(clickedItem.name + ' clicked!');
			});
		}
	};

	angular.module('grubsta').controller('HeaderController', ['$mdSidenav', '$mdBottomSheet', HeaderController]);
})();
