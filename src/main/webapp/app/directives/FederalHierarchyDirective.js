!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.directive('federalHierarchyLabel', ['FederalHierarchyService', function(FederalHierarchyService) {
        return {

            scope: {
                "organizationId": "@"
            },
            link: function(scope, element, attributes) {
                attributes.$observe('organizationId', function(value){
                    if(value) {
                        //Call FederalHierarchy API and get Label of the organization
                        FederalHierarchyService.getFullLabelPathFederalHierarchyById(scope.organizationId, true, false, function (organizationNames) {
                            scope.organizationName = organizationNames;
                        }, function (error) {
                            scope.organizationName = "An error has occurred, Please try again !";
                        });
                    }
                });
            },
            template: '<img ng-show="!organizationName" style="max-width: 10%;" src="/img/img_cfda/loading.svg" />{{ organizationName }}'
        };
    }]);
}();
