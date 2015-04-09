/**
 * Created by Danny Schreiber on 3/30/15.
 */


(function() {
	'use strict';

	/* @ngInject */
	var RightSidebarController = function($state, $mdSidenav) {
		var rsc = this;
		rsc.menu = [];
		rsc.admin = [];
		rsc.init = init;
		rsc.closeSideNav = closeSideNav;

		rsc.init();

		function init() {
			rsc.menu = [
				{
					link : 'dashboard',
					title: 'Dashboard',
					icon: 'dashboard'
				},
				{
					link : 'profile',
					title: 'Profile',
					icon: 'person'
				},
				{
					link : 'workspace',
					title: 'Workspaces',
					icon: 'desktop_mac'
				},
				{
					link : 'analytics',
					title: 'Analytics',
					icon: 'equalizer'
				},
				{
					link : 'reports',
					title: 'Reports',
					icon: 'insert_chart'
				}
			];
			rsc.admin = [
				{
					link : 'datasources',
					title: 'Data Sources',
					icon: 'dns',
					action: 'hc.toggleSidenav("left")'
				},
				{
					link : 'entity-templates',
					title: 'Master Templates',
					icon: 'description'
				},
				{
					link : 'advanced-search',
					title: 'Advanced Search',
					icon: 'find_replace'
				},
				{
					link : 'settings',
					title: 'Settings',
					icon: 'settings',
					action: 'showListBottomSheet($event)'
				}
			];
		}


		function closeSideNav(menuId, state) {
			$mdSidenav(menuId).toggle();
			$state.go(state);
		}

	};


	angular
		.module('grubsta')
		.controller('RightSidebarController', ['$state', '$mdSidenav', RightSidebarController]);
})();
