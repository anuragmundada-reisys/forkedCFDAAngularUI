(function(){
    "use strict";

    angular.module('app')
        .run(runApp);

    runApp.$inject = ['$rootScope', '$document', '$http', 'env'];

    ////////////

    function runApp($rootScope, $document, $http, env) {
        $http.get("/environment/api").then(function(response) {
            env.setApi("pub.api.programs", response.data);
        });

        $rootScope.$on('$stateChangeSuccess', function() {
            $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
        });
    }
})();