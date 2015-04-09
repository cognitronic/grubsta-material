/**
 * Created by Danny Schreiber on 3/30/15.
 */

(function() {
	'use strict';

	angular
		.module('grubsta.component.toggle-class', [])
		.directive('gsToggleClass', gsToggleClass);

	/**
	 * @constructor gsToggleClass
	 * @classdesc Directive for toggling any element by #id.
	 * @returns {{restrict: string, link: link}}
	 */
	function gsToggleClass() {
		var directive = {
			restrict: 'A',
			link: link
		};

		return directive;
	}

	/**
	 * If the toggle-element attribute is used, will look for the passed in id and toggle that element.  Otherwise,
	 * toggles the element the directive is applied to.
	 * @param {object} scope Scope if present
	 * @param {object} element HTML element the directive is applied to
	 * @param {object} attrs A collection of attributes that are present on the active element
	 * @memberOf gsToggleClass
	 */
	function link(scope, element, attrs) {
		element.bind('click', function() {
			var wrapper = angular.element(document.querySelector('#mdm-main-view'));
			if(attrs.toggleElement) {
				var el = angular.element(document.querySelector('#' + attrs.toggleElement));
				el.toggleClass(attrs.gsToggleClass);
			} else {
				element.toggleClass(attrs.gsToggleClass);
			}
		});
	}
})();
