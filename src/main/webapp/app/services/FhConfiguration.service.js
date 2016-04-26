(function () {
    "use strict";

    var myApp = angular.module('app');

    myApp.service('FhConfigurationService', ['OrganizationFactory', 'FederalHierarchyService', function (OrganizationFactory, FederalHierarchyService) {

        /**
         * call on config factory, and then  add some more data via the fh service
         * @param oData
         * @param aSelectedData
         * @returns Object
         */
        var getFhConfiguration = function (id, callbackSuccess) {

            //factory doesn't return the entire data that i need
            OrganizationFactory.get(id).$promise.then(function (data) {

                //call on fh to get the rest
                FederalHierarchyService.getFederalHierarchyById(data.organizationId, false, false, function (d) {
                    data.name = d.name;
                    data.agencyProgramCode = d.cfdaCode;
                    data.acronym = 'Not available';
                    data.agencyCode = 'Not available';
                    //execute the callback function
                    callbackSuccess(data);
                });
            });


        };


        //----------- METHODS ------------------
        return {
            getFhConfiguration: getFhConfiguration

        };


    }]);
})();