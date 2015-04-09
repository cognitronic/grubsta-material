/**
 * Created by Danny Schreiber on 3/19/15.
 */

(function() {
	'use strict';

	var BASE_API = '/mdm/api/v1/';
	angular
		.module('grubsta')
		.constant('Constants', {
			ROUTES: {
				HEADERS: {
					TENANT_HEADERS: '8cd6e43115e9416eb23609486fa053e3',
					DATASOURCE_HEADERS: '0a0829172fc2433c9aa26460c31b78f0'
				},
				URLS: {
					GET_DATASOURCES: BASE_API + 'dataSources?offset={0}&pageSize={1}&sortBy={2}&sortOrder={3}',
					GET_DATASOURCE: BASE_API + 'dataSources/{0}',
					SAVE_DATASOURCES: BASE_API + 'dataSources',
					UPDATE_DATASOURCE: BASE_API + 'dataSources/{0}'
				}
			}
		});
})();
