(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('HistoricalIndexFormCtrl', ['$scope', '$state', '$stateParams', '$timeout', 'HistoricalIndexFactory', 'ProgramFactory', 'ngDialog',
        function ($scope, $state, $stateParams, $timeout, HistoricalIndexFactory, ProgramFactory,  ngDialog) {

            //hard coded dictionary for now, may change later
            $scope.labels = {
                agency: "Agency Changed",
                unarchive: "Reinstated",
                title: "Title Changed",
                archived: "Archived",
                program_number: "Number Changed",
                publish: "Published"
            };

            HistoricalIndexFactory.get({id: $stateParams.hid}).$promise.then(function (historicalIndexChange) {
                $scope.oHistoricalIndex = historicalIndexChange;
                ProgramFactory.get({id: $stateParams.pid}).$promise.then(function(program){
                    $scope.oHistoricalIndex.programTitle = program.title;
                });
                $scope.oHistoricalIndex.reason = "mock reason... ";
            });


            $scope.years = _.range(1965, new Date().getFullYear());


            $scope.updateHistoricalIndex = function () {
                $scope.oHistoricalIndex.$update({id: $scope.oHistoricalIndex.id}).then(function (data) {
                        ngDialog.open({
                            template: '<div class="usa-alert usa-alert-success" role="alert">' +
                            '<div class="usa-alert-body">' +
                            '<p class="usa-alert-text">The Historical Index Change has been saved successfully !</p>' +
                            '</div>' +
                            '</div>',
                            plain: true,
                            closeByEscape: true,
                            showClose: true
                        });

                        //go to list page after 2 seconds
                        $timeout(function () {
                            ngDialog.closeAll();
                            $state.go('historicalIndex');
                        }, 3000);
                    },
                    function (error) {
                        ngDialog.open({
                            template: '<div class="usa-alert usa-alert-error" role="alert">' +
                            '<div class="usa-alert-body">' +
                            '<h3 class="usa-alert-heading">Error Status</h3>' +
                            '<p class="usa-alert-text">An error has occurred, please try again!</p>' +
                            '</div>' +
                            '</div>',
                            plain: true,
                            closeByEscape: true,
                            showClose: true
                        });
                    });
            };

            $scope.deleteHistoricalIndex = function () {
                if (confirm("Are you sure you want to delete this Historical Index Change?")) {
                    $scope.oHistoricalIndex.$delete({id: $scope.oHistoricalIndex.id}).then(function (data) {
                            ngDialog.open({
                                template: '<div class="usa-alert usa-alert-success" role="alert">' +
                                '<div class="usa-alert-body">' +
                                '<p class="usa-alert-text">This Historical Index Change has been successfully deleted.</p>' +
                                '</div>' +
                                '</div>',
                                plain: true,
                                closeByEscape: true,
                                showClose: true
                            });

                            //go to list page after 2 seconds
                            $timeout(function () {
                                ngDialog.closeAll();
                                $state.go('historicalIndex');
                            }, 3000);
                        },
                        function (error) {
                            ngDialog.open({
                                template: '<div class="usa-alert usa-alert-error" role="alert">' +
                                '<div class="usa-alert-body">' +
                                '<h3 class="usa-alert-heading">Error Status</h3>' +
                                '<p class="usa-alert-text">An error has occurred, please try again!</p>' +
                                '</div>' +
                                '</div>',
                                plain: true,
                                closeByEscape: true,
                                showClose: true
                            });
                        });
                }
            };

        }]);
})();
