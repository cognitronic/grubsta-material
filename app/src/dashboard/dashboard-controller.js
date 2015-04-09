/**
 * Created by Danny Schreiber on 3/19/15.
 */

(function() {
	'use strict';
	/***
	 * @constructor HomeController
	 * @classdesc The home controller is a test controller to get the mdm project up and running.
	 */
	var DashboardController = function($state) {
		var vm = this;
		vm.feed = [
			{
				icon: 'whatshot',
				title: 'Tamales by the dozen ready to pick up!',
				desc: 'Here is a description of meal',
				price: '$10',
				qty: '12',
				cook: 'David Darmstandler',
				deliveryMethod: 'Pick-Up'
			},
			{
				icon: 'cake',
				title: 'Tamales by the dozen ready to pick up!',
				desc: 'Here is a description of meal',
				price: '$10',
				qty: '12',
				cook: 'David Darmstandler',
				deliveryMethod: 'Pick-Up'
			},
			{
				icon: 'local_pizza',
				title: 'Tamales by the dozen ready to pick up!',
				desc: 'Here is a description of meal',
				price: '$10',
				qty: '12',
				cook: 'David Darmstandler',
				deliveryMethod: 'Pick-Up'
			},
			{
				icon: 'whatshot',
				title: 'Tamales by the dozen ready to pick up!',
				desc: 'Here is a description of meal',
				price: '$10',
				qty: '12',
				cook: 'David Darmstandler',
				deliveryMethod: 'Pick-Up'
			},
			{
				icon: 'cake',
				title: 'Tamales by the dozen ready to pick up!',
				desc: 'Here is a description of meal',
				price: '$10',
				qty: '12',
				cook: 'David Darmstandler',
				deliveryMethod: 'Pick-Up'
			}

		];

		vm.init = init;

		vm.init();

		function init() {

		}


	};


	angular
		.module('grubsta.dashboard')
		.controller('DashboardController', ['$state', DashboardController]);
})();
