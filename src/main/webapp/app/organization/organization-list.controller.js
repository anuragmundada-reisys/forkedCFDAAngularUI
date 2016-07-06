(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('OrganizationListController', ['$scope', 'UserService', 'AuthorizationService', 'SUPPORTED_ROLES', 'FederalHierarchyService', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', 'filterFilter', '$compile',
        function ($scope, UserService, AuthorizationService, SUPPORTED_ROLES, FederalHierarchyService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, filterFilter, $compile) {

            //Load data from FH
            //------------------------------------------------------------------

            var userOrgId = UserService.getUserOrgId();
            //no filter if rmo or super user
            if (AuthorizationService.authorizeByRole([SUPPORTED_ROLES.SUPER_USER, SUPPORTED_ROLES.RMO_SUPER_USER])) {
                userOrgId = null;
            }

            getDataFromFh();
            function getDataFromFh() {
                //call on fh to get list of obj, formatted properly and in an array
                FederalHierarchyService.dtFormattedData(userOrgId, function (results) {
                    $scope.dtData_topLevel = results.topLevelData;
                    $scope.dtData_total = results.totalData;
                    $scope.childrenMap = results.childrenMappingData;
                    $scope.dtData = results.topLevelData; //current data to show in dt
                });
            }

            $scope.searchKeyword = '';


            function getChildrenMarkup(parentRowId, uniqueParentRowId) {
                var children = $scope.childrenMap[parentRowId];
                //var parentRowObj = $
                var childrenMarkup = '';
                var colors = ['#e5e5e5', '#cccccc']; //0 based, so must minus one from level, levels 1, 2, -> 0, 1
                var padding = ['40px', '80px'];

                angular.forEach(children, function (child, index, array) {
                    var childId = child.DT_RowId;
                    var childName = child.organization.name;
                    var level = child.hierarchyLevel;
                    var downArrow = '';
                    var action = '<td style="background-color: ' + colors[level - 1] + '; padding-left:' + padding[level - 1] + ';"><a class="usa-button usa-button-compact" title="Edit Organization" ng-if="hasPermission([PERMISSIONS.CAN_EDIT_ORGANIZATION_CONFIG])" href="/organization/' + child.organization.organizationId + '/edit"><span class="fa fa-pencil"></span></a><a class="usa-button usa-button-compact" title="View Organization" ng-if="hasPermission([PERMISSIONS.CAN_VIEW_ORGANIZATION_CONFIG])" href="/organization/' + child.organization.organizationId + '/view"><span class="fa fa-file-text-o"></span></a>';
                    action += '<a class="usa-button usa-button-compact" title="Users Directory" ng-if="hasPermission([PERMISSIONS.CAN_VIEW_USERS])" href="/users?organization=' + child.organization.organizationId + '"><span class="fa fa-book"></span></a>';

                    if (child.action.hasChildren) {
                        downArrow = '<a class="usa-button usa-button-compact"><span class="fa fa-chevron-circle-down"></span></a>';
                        action = action + downArrow + '</td>';
                    } else {
                        action = action + '</td>';
                    }
                    var title = '<td style="background-color: ' + colors[level - 1] + '; padding-left:' + padding[level - 1] + ';"><a ng-if="hasPermission([PERMISSIONS.CAN_VIEW_ORGANIZATION_CONFIG])" href="/organization/' + child.organization.organizationId + '/view">' + childName + '</a></td>';
                    var row = '<tr ng-click="rowClicked(\'' + childId + '\')" class="' + uniqueParentRowId + '-child" id="' + childId + '" role="row" class="odd">' + action + title + '</tr>';

                    childrenMarkup = childrenMarkup + row;

                });
                return $compile(childrenMarkup)($scope);
            }


            //Watches
            //------------------------------------------------------------------
            $scope.$watch('searchKeyword', function () {
                if ($scope.dtInstance.DataTable) {
                    $scope.dtData = filterFilter($scope.dtData_total, $scope.searchKeyword);
                    //$scope.dtInstance.DataTable.ajax.reload();
                }
                //if search is empty, then show only top level data
                if ($scope.dtInstance.DataTable && $scope.searchKeyword == '') {
                    $scope.dtData = $scope.dtData_topLevel; //will already trigger reload via watch below
                    //$scope.dtInstance.DataTable.ajax.reload();
                }
            }, true);

            $scope.$watch('dtData', function () {
                if (typeof $scope.dtData !== 'undefined') {
                    $scope.totalCount = $scope.dtData.length;
                }

                if ($scope.dtData) {
                    $scope.dtInstance.DataTable.ajax.reload();
                }
            });


            // Datatables stuff
            //------------------------------------------------------------------
            $scope.loadOrganizations = function (data, callback, settings) {
                if ($scope.dtData) {
                    callback({
                        "draw": parseInt(data['draw']) + 1,
                        "recordsTotal": $scope.dtData.length,
                        "recordsFiltered": $scope.dtData.length,
                        "data": $scope.dtData
                    });
                } else {
                    //console.log("data not available yet??");
                }

            };

            $scope.rowClicked = function (uniqueRowId) {
                //console.log("in rowClicked function: uniqueRowId: ", uniqueRowId);
                //uniqueRowId contains strings like "search-39202332" "search-child-193013013"
                var a = String(uniqueRowId).split("-");
                var rowId = a[a.length - 1];
                //toggle children
                var childRowMarkupClass = "." + uniqueRowId + "-child";
                if ($(childRowMarkupClass).length) {
                    $(childRowMarkupClass).toggle('slide');
                } else {
                    var childrenMarkup = getChildrenMarkup(rowId, uniqueRowId);
                    $(childrenMarkup).insertAfter('#' + uniqueRowId); //insert after original row id
                }
            };

            angular.element('table').on('draw.dt', function () {
                // Initialize semantic ui dropdown
                //$(".dataTables_length select").addClass("ui compact dropdown").dropdown();
                // Remove select to fix dropdown  double click bug
                //$(".dataTables_length select").remove();
                $compile(angular.element('.dataTables_length'))($scope);
                $(".dataTables_info").appendTo(".dataTables_length label");
                $(".dataTables_info").contents().unwrap();
            });

            $scope.dtInstance = {};

            $scope.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0).withOption('sWidth', '200px')
            ];
            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('order', [[1, 'asc']])
                .withOption('searching', false)
                .withOption('info', false)
                .withOption('lengthMenu', [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]])
                .withDataProp('data')
                .withDOM('<"usa-grid"r> <"usa-grid"t> <"usa-background-gray-lightest" <"usa-grid" <"usa-width-one-half"li> <"usa-width-one-half"p> > > <"clear">')
                .withOption('ajax', $scope.loadOrganizations)
                .withOption('bSortClasses', false)
                .withOption('rowCallback', function (row, data, index, indexFull) {
                    // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
                    $('td', row).unbind('click');
                    $('td', row).bind('click', function () {
                        $scope.$apply(function () {
                            $scope.rowClicked(data.DT_RowId);
                        });
                    });
                    return row;
                })
                .withLanguage({
                    'processing': '<div class="ui active small inline loader"></div> Loading',
                    'emptyTable': 'No Agencies Found',
                    'lengthMenu': 'Showing _MENU_ entries of {{totalCount}} entries'
                });
            $scope.dtColumns = [

                DTColumnBuilder.newColumn('action')
                    .withTitle('Action')
                    .withOption('defaultContent', '')
                    .withOption('render', function (data) {
                        var htmlStr = '<a class="usa-button usa-button-compact" ng-if="hasPermission([PERMISSIONS.CAN_EDIT_ORGANIZATION_CONFIG])" title="Edit Organization" href="/organization/' + data['organizationId'] + '/edit">' +
                            '<span class="fa fa-pencil"></span></a>' +
                            '<a class="usa-button usa-button-compact" ng-if="hasPermission([PERMISSIONS.CAN_VIEW_ORGANIZATION_CONFIG])" title="View Organization" href="/organization/' + data['organizationId'] + '/view">' +
                            '<span class="fa fa-file-text-o"></span></a>';
                        if (data.hasChildren) {
                            htmlStr = htmlStr + '<a class="usa-button usa-button-compact"><span class="fa fa-chevron-circle-down"></span></a>';
                        }
                        htmlStr += '<a class="usa-button usa-button-compact" ng-if="hasPermission([PERMISSIONS.CAN_VIEW_USERS])" title="Users Directory" href="/users?organization=' + data['organizationId'] + '"><span class="fa fa-book"></span></a>';
                        return htmlStr;
                    })

                    .withOption('orderable', false),

                DTColumnBuilder.newColumn('organization')
                    .withTitle('Name')
                    .withOption('defaultContent', '')
                    .withOption('render', function (data) {
                        return '<a ng-if="hasPermission([PERMISSIONS.CAN_VIEW_ORGANIZATION_CONFIG])" href="/organization/' + data['organizationId'] + '/view">' + data['name'] + '</a>';
                    })
            ];
        }]);

})();
