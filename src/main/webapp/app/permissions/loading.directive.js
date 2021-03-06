!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.directive('loadingModal', ['UserService', function(UserService) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="loadingModal" style="width: 100%;height: 100%;z-index: 10000;top: 0;left: 0;opacity: .75;position: fixed;background: black center;"><div class="ui active dimmer"><div class="ui large loader"></div></div></div>',
            link: function(scope, element) {
                scope.$watch(
                    function() {
                        return UserService.getUser();
                    },
                    function() {
                        if (!window.skipInitialCheck && !UserService.isLoadingIamUser()) {
                            element.addClass('hidden');
                        } else {
                            element.removeClass('hidden');
                        }
                    }
                );
            }
        }
    }]);
}();
