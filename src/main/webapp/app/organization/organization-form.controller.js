(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('OrganizationFormCtrl', ['$scope', '$state', '$stateParams', '$timeout', '$window', 'Dictionary', 'FederalHierarchyService', 'UserService', 'ngDialog', 'FhConfigurationService',
        function ($scope, $state, $stateParams, $timeout, $window, Dictionary, FederalHierarchyService, UserService, ngDialog, FhConfigurationService) {


            angular.element(document).ready(function () {
                $(".ui.dropdown").dropdown();
            });


            //for select dropdown
            $scope.items = [{
                value: true,
                label: 'Yes'
            }, {
                value: false,
                label: 'No'
            }];
            $scope.selected = $scope.items[0];


            $scope.id = $stateParams.id;
            FhConfigurationService.getFhConfiguration({id: $stateParams.id}, function (data) {
                $scope.oOrganization = data;

                //for select dropdown
                if ($scope.oOrganization.programNumberAuto == true) {
                    $scope.selected = $scope.items[1];
                } else {
                    $scope.selected = $scope.items[0];
                }


                //needs to happen after the GET call..
                $scope.$watch('selected', function () {
                    //switch! to auto = !manual
                    $scope.oOrganization.programNumberAuto = !($scope.selected.value);
                });
            });


            /**
             * Create or Edit Program
             * @returns void
             */
            $scope.saveFhConfiguration = function () {
                //empty message error
                $scope.flash = {};


                if (($scope.oOrganization.programNumberHigh === undefined ) || ($scope.oOrganization.programNumberLow === undefined ) || ($scope.oOrganization.programNumberAuto === undefined )) {
                    $scope.flash = {
                        type: "error",
                        message: "Please provide all required fields before submitting the form."
                    };
                    //scroll up in order for user to see the error message
                    $window.scrollTo(0, 0);
                } else {
                    $scope.oOrganization['$update']({id: $stateParams.id}).then(function (data) {
                        //show dialog
                        ngDialog.open({
                            template: '<div class="usa-alert usa-alert-success" role="alert">' +
                            '<div class="usa-alert-body">' +
                            '<p class="usa-alert-text">The CFDA Number Configuration has been saved successfully !</p>' +
                            '</div>' +
                            '</div>',
                            plain: true,
                            closeByEscape: true,
                            showClose: true
                        });

                        //go to list page after 2 seconds
                        $timeout(function () {
                            ngDialog.closeAll();
                            $state.go('viewOrganization', {id: $scope.id});
                        }, 3000);
                    });
                }
            };


        }]);
})();
