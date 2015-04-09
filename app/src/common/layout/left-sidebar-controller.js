/**
 * Created by Danny Schreiber on 3/30/15.
 */


(function() {
	'use strict';

	/* @ngInject */
	var LeftSidebarController = function($state, $mdSidenav) {
		var lsc = this;
		lsc.menu = [];
		lsc.admin = [];
		lsc.init = init;
		lsc.closeSideNav = closeSideNav;
		lsc.clearTenant = clearTenant;
		lsc.activeTenant = '';

		lsc.init();

		function init() {
			lsc.menu = [
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
			lsc.admin = [
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

		function clearTenant() {
			//CacheService.clearCache();
			lsc.activeTenant = 'No Active Tenant';
		}

	};


	angular
		.module('grubsta')
		.controller('LeftSidebarController', ['$state', '$mdSidenav', LeftSidebarController]);
})();
