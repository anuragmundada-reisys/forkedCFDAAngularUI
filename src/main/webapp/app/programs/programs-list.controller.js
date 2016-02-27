(function(){
    "use strict";

    var myApp = angular
        .module('app');

    myApp.controller('ProgramsListCtrl', ['$scope', '$state', '$stateParams', 'appConstants', 'ProgramService', 
    function($scope, $state, $stateParams, appConstants, ProgramService) {
        $scope.previousState = null;
        $scope.itemsByPage = appConstants.DEFAULT_PAGE_ITEM_NUMBER;
        $scope.itemsByPageNumbers= appConstants.PAGE_ITEM_NUMBERS;
        $scope.programStatus = 'All';

        //updating scope programStatus parent for tabs/query puposes
        if($stateParams.hasOwnProperty('status')) {
            if($stateParams.status === 'published') {
                $scope.programStatus = 'Published';
                $scope.$parent.programStatus = 'Published';
            } else if($stateParams.status === 'archived') {
                $scope.programStatus = 'Archived';
                $scope.$parent.programStatus = 'Archived';
            } else if($stateParams.status === 'pending') {
                $scope.programStatus = 'Pending';
                $scope.$parent.programStatus = 'Pending';
            } else if($stateParams.status === 'requests') {
                $scope.programStatus = 'requests';
                $scope.$parent.programStatus = 'requests';
            } else {
                $scope.programStatus = 'All';
                $scope.$parent.programStatus = 'All';
            }
        } else {
            //main page, go to All tab
            $state.go('programList.status', { status: 'all' });
        }

        /**
         * Function loading programs
         * @param {type} tableState
         * @returns Void
         */
        $scope.loadPrograms = function(tableState) {
            tableState = tableState || {
                search: {},
                pagination: {},
                sort: {}
            };

            $scope.isLoading = true;

            var oApiParam = {
                apiName: 'programList',
                apiSuffix: '',
                oParams: {
                    limit: $scope.itemsByPage,
                    offset: tableState.pagination.start || 0,
                    includeCount: true
                }, 
                oData: {}, 
                method: 'GET'
            };

            if (tableState.search.predicateObject) {
                oApiParam.oParams['keyword'] = tableState.search.predicateObject.$;
            }

            //for unit test purposes $scope.hasOwnProperty('$parent')
            if($scope.programStatus === 'requests') {
                oApiParam.apiSuffix = $scope.programStatus;
            } else if( $scope.programStatus !== 'All') {
                oApiParam.oParams['status'] = $scope.programStatus;
            }

            if(tableState.sort.predicate) {
                var isDescending = tableState.sort.reverse,
                    sortingProperty = tableState.sort.predicate;
                oApiParam.oParams['sortBy'] = ( isDescending ? '-' : '' ) + sortingProperty;
            }

            //call api and get results
            $scope.promise = ProgramService.query(oApiParam).then(
                function(data) {
                    var programs = [];
                    //cleanup and adjust strutre data
                    if($scope.programStatus === 'requests'){
                        programs = data.results;
                    } else {
                        angular.forEach(data.results, function (item) {
                            angular.forEach(item, function (prop, key) {
                                if (!prop._id)
                                    prop._id = key;
                                programs.push(prop);
                            });
                        });
                    }

                    $scope.programs = programs;
                    $scope.isLoading = false;

                    tableState.pagination.numberOfPages = Math.ceil(data.totalCount / $scope.itemsByPage);
                    tableState.pagination.totalItemCount = data.totalCount;
                    $scope.previousState = tableState;
                }, 
                function(error){
                    
            });
        };

        /**
         * function for editing program
         * @param Object program
         * @param {type} section
         * @returns Void
         */
        $scope.editProgram= function(program, section) {
            section = section || 'info';
            $state.go('editProgram', {
                id: program._id,
                section: section
            });
        };

        /**
         * function for deleting program
         * @param Object program
         * @returns Q
         */
        $scope.deleteProgram = function(program) {
            return program.$delete().then(function() {
                $scope.loadPrograms($scope.previousState);
            });
        };

        /**
         * 
         * @param String string
         * @returns Object
         */
        $scope.stringToJson = function(string) {
            return JSON.parse(string);
        };
    }]);

    //Controller for Program Status
    myApp.controller('ProgramStatusCtrl', ['$scope', '$state', '$timeout', 'ApiService', 'ngDialog',
        function($scope, $state, $timeout, ApiService, ngDialog) {

        //get the oEntity that was passed from ngDialog in 'data' option
        $scope.oProgram = $scope.ngDialogData.oEntity;

        //if entity passed isn't program object then retrieve it
        if($scope.ngDialogData.typeEntity === 'request') {
            $scope.oProgram = JSON.parse($scope.ngDialogData.oEntity.data);
            $scope.reason = $scope.ngDialogData.oEntity.reason;
        }

        /**
         * function for submitting changes RestAPI call backend
         * @returns Void
         */
        $scope.changeProgramStatus = function() {
            var message = {
                success: 'Your request has been submitted !',
                error: 'An error has occurred, please try again !'
            };

            if(typeof $scope.reason !== 'undefined' && $scope.reason !== '') {
                var oApiParam = {
                    apiName: '',
                    apiSuffix: '/'+$scope.oProgram._id,
                    oParams: {
                        reason: $scope.reason,
                        parentProgramId: '',
                        programNumber: $scope.oProgram.programNumber
                    }, 
                    oData: {
                        reason: $scope.reason,
                        parentProgramId: '',
                        programNumber: $scope.oProgram.programNumber
                    }, 
                    method: 'POST'
                };

                //which action should we apply to (Program or Program Requests)
                if($scope.ngDialogData.typeEntity === 'program') {
                    if($scope.oProgram.status === 'Published') {
                        oApiParam.apiName = 'programArchiveRequest';
                    } else if($scope.oProgram.status === 'Archived') {
                        oApiParam.apiName = 'programUnArchiveRequest';
                    }

                    message.success = 'Your request has been processed !';
                } else if($scope.ngDialogData.typeEntity === 'request') {
                    if($scope.ngDialogData.action === 'approve' && $scope.oProgram.status === 'Published') {
                        oApiParam.apiName = 'programArchive';
                    } else if($scope.ngDialogData.action === 'reject' && $scope.oProgram.status === 'Published') {
                        oApiParam.apiName = 'programArchiveRequestReject';
                    } else if($scope.ngDialogData.action === 'approve' && $scope.oProgram.status === 'Archived') {
                        oApiParam.apiName = 'programUnArchive';
                    } else if($scope.ngDialogData.action === 'reject' && $scope.oProgram.status === 'Archived') {
                        oApiParam.apiName = 'programUnArchiveRequestReject';
                    }
                }

                //Call API
                ApiService.call(oApiParam).then(
                function(data){
                    $scope.flash = {
                        type: 'success',
                        message: message.success
                    };

                    //go to list page after 2 seconds
                    $timeout(function() {
                        ngDialog.closeAll();
                        $state.go('programList.status', {status: 'all'});
                    }, 2000);
                }, 
                function(error){
                    $scope.flash = {
                        type: 'error',
                        message: message.error
                    };
                });
            }
        };
    }]);
})();

