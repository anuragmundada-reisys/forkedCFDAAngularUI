!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.constant('SUPPORTED_ROLES', {
        SUPER_USER: 'GSA_CFDA_R_cfdasuperuser',
        AGENCY_COORDINATOR: 'GSA_CFDA_R_cfda_agency_coord',
        AGENCY_USER: 'GSA_CFDA_R_agency_submitter',
        OMB_ANALYST: 'GSA_CFDA_R_omb_analyst',
        RMO_SUPER_USER:'GSA_CFDA_R_rmo_superuser',
        LIMITED_SUPER_USER: 'GSA_CFDA_R_cfdalimitedsuperuser'
    });

    myApp.service('ROLES', ['$http', 'SUPPORTED_ROLES', 'PERMISSIONS',
        function($http, SUPPORTED_ROLES, PERMISSIONS) {
            this.isPopulated = false;

            function buildPermissionList(p, list) {
                if (p['systemRole']) {
                    list.push(PERMISSIONS[p['roleId']]);
                }

                if (p['parents']) {
                    angular.forEach(p['parents'], function(v) {
                        buildPermissionList(v, list);
                    });
                }
            }

            var self = this;
            $http({
                method: 'GET',
                url: '/v1/role'
            }).then(function(response) {
                var data = response.data;
                var roleList = {};
                angular.forEach(SUPPORTED_ROLES, function(v) {
                    var permissionList = [];
                    var name = '';
                    data.some(function(r) {
                        if (angular.equals(r['roleId'], v)) {
                            name = r['name'];
                            buildPermissionList(r, permissionList);
                            return true;
                        }
                    });
                    roleList[v] = {
                        name: name,
                        permissions: permissionList
                    };
                });
                angular.extend(self, roleList);
                self.isPopulated = true;
            }, function() {
                //  Error retrieving role information
            });
        }
    ]);

    myApp.run(['$rootScope', 'SUPPORTED_ROLES', 'ROLES', function($rootScope, SUPPORTED_ROLES, ROLES) {
        $rootScope.SUPPORTED_ROLES = SUPPORTED_ROLES;
        $rootScope.ROLE_DEFINITIONS = ROLES;

        //  TODO: Remove and use SUPPORTED ROLES in it's place
        $rootScope.ROLES = SUPPORTED_ROLES;
    }]);
}();