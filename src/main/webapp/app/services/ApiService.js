(function(){
    "use strict";

    var myApp = angular.module('app');

   myApp.service('ApiService',['$http', '$q', '$log', function ($http, $q, $log){
        var APIs = {
            "listProgram": "/api/programs",
        };

        this.APIs = APIs;

        /**
         * common function to perform an API CALL
         * 
         * @param Object oApiParam {
         *          apiName: '',
         *          apiSuffix: '',
         *          oParams: {}, only for GET method
         *          oData: {}, for others method rather then GET
         *          method: '' (GET|POST|PUT...)
         *      }
         * @returns {$q@call;defer.promise}
         */
        this.call = function(oApiParam) {
            var deferred = $q.defer();

            $http({
                'method': oApiParam.method,
                'url': APIs[oApiParam.apiName] + oApiParam.apiSuffix, 
                'params': oApiParam.oParams,
                'data': oApiParam.oData
            })
            .success(function(data) { 
                deferred.resolve(data);
            }).error(function(msg, code) {
                deferred.reject(msg);
                $log.error(msg, code);
            });

            return deferred.promise;
        };

        /**
         * common function to perform multiple API CALLS
         * 
         * @param Array object aApiParams
         * @returns {$q@call;defer.promise}
         */
        this.calls = function(aApiParams) {
            var deferred = $q.defer();
            var urlCalls = [];

            angular.forEach(aApiParams, function(oApiParam){
                urlCalls.push(
                    $http({
                        'method': oApiParam.method,
                        'url': APIs[oApiParam.name] + oApiParam.suffix, 
                        'params': oApiParam.oParams,
                        'data': oApiParam.oData
                    })
                );
            });

            $q.all(urlCalls)
            .then(
                function(results) {
                    deferred.resolve(results);
                },
                function(errors) {
                    deferred.reject(errors);
                    $log.error(errors);
                },
                function(updates) {
                    deferred.update(updates);
                }
            );

            return deferred.promise;
        };
    }]);

})();