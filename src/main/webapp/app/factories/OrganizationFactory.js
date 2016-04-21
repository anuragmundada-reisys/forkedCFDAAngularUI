(function(){
    "use strict";

    var myApp = angular.module('app');

    myApp.factory('OrganizationFactory', ['$resource', 'ApiService', function ($resource, ApiService){
        return $resource(ApiService.APIs.federalHierarchyConfigurationEntity, {
            id: '@_id'
        }, {
            save: {
                method: 'POST'
            },
            update: {
                method: 'PATCH',
                params: {
                    id: '@_id'
                }
            },
            delete:{
                method: 'DELETE',
                params: {
                    id: '@_id'
                }
            }
        });
    }]);
})();