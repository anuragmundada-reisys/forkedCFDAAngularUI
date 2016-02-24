(function(){
    "use strict";

    angular
        .module('app')
        .controller('HomeController', homeController);

    homeController.$inject = ['$state', 'appConstants', 'Program', 'ListingCount'];

    //////////////////////

    function homeController($state, appConstants, Program, ListingCount) {
        var vm = this,
            previousState;

        angular.extend(vm, {
            itemsByPage: appConstants.DEFAULT_PAGE_ITEM_NUMBER,
            itemsByPageNumbers: appConstants.PAGE_ITEM_NUMBERS,

            data: {
                singleSelect: null,
                multipleSelect: [],
                option1: 'option-1',
            },
            programList: programList,
            getListingCount: getListingCount,
            test: {
                testid: getListingCount()
            }
        });

        /////////////////////

        function programList() {
            $state.go('programList');
        }

        function getListingCount() {
            return ListingCount.query();
        }
    }

})();