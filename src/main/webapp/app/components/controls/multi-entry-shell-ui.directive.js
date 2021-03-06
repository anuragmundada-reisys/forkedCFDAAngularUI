(function() {
    "use strict";

    angular
        .module('app')
        .directive('multiEntry', multiEntryDirective)
        .directive('multiEntryHeader', multiEntryHeaderDirective)
        .directive('multiEntryList', multiEntryListDirective);

    multiEntryDirective.$inject = ['$parse', '$compile', 'appConstants', 'DictionaryService'];

    //////////////////

    function multiEntryDirective($parse, $compile, appConstants, DictionaryService) {
        return {
            restrict: 'E',
            controller: multiEntryController,
            controllerAs: '$ctrl',
            priority: 1,
            template: "<div transclude-append></div>",
            require: ['multiEntry', '^ngModel'],
            transclude: true,
            replace: false,
            scope: {
                itemTitle: "=",
                onEntryDelete: "&",
                editableItems: "@",
                newEntryBtnName: "@",
                deleteLabelName: "@",
                parentVm: "=",
                dictionaryItems: '@',
                listTrackBy: "@",
                listFilter: "=",
                onAfterDialogOpen: "="
            },
            link: link
        };

        ///////////////

        function link(scope, element, attrs, ctrls) {
            var ctrl = ctrls[0],
                model = ctrls[1];
        
            ctrl.appConstants = appConstants;
            ctrl.model = model;

            scope.$watch(function() {
                return scope.parentVm;
            }, function(newVal){
                ctrl.parentVm = newVal;
            });

            if (element.find('multi-entry-list').length <= 0) {
                var listElement = angular.element("<multi-entry-list><span class='text-nowrap'>{{$ctrl.formatTitle(item)}}</span></multi-entry-list>"),
                    filterFunc;
                listElement.attr('editable', scope.editableItems);
                listElement.attr('listTrackBy', scope.listTrackBy);
                var filterExp = filterFunc = scope.listFilter;
                if(angular.isFunction(filterFunc)) {
                    ctrl.listFilter = filterFunc;
                    filterExp = "filter:$ctrl.listFilter";
                }
                listElement.attr('listFilter', filterExp);
                element.find('multi-entry-header').after(listElement);
                $compile(listElement)(scope);
            }

            //FIXME REMOVE BY RECODING ADD/EDIT PROGRAM DIRECTIVE BS
            // Begin: isteven Dropdown Data Structure
            attrs.$observe('dictionaryItems', function(value){
                if(angular.isArray(JSON.parse(value)) && JSON.parse(value).length > 0 && (typeof scope.$ctrl.dictionaryItems === 'undefined' || !angular.isArray(scope.$ctrl.dictionaryItems))) {
                    DictionaryService.setDictionary(JSON.parse(value));
                }
            });

            scope.$ctrl.setSelectedDictionaryItems = function(aSelectedItems, isGrouped) {

                if(!angular.isArray(aSelectedItems)) {
                    aSelectedItems = [aSelectedItems];
                } else {
                    if(aSelectedItems.length==0){
                        return [];
                    }
                    aSelectedItems = [aSelectedItems[0].element_id];
                }

                DictionaryService.setSelectedDictionaryIDs(aSelectedItems, isGrouped);

                if(aSelectedItems.length > 0) {
                    return aSelectedItems.map(function(item){
                        return JSON.parse('{"element_id":"'+item+'"}');
                    });
                } else {
                    return [];
                }
            };

            scope.$ctrl.getDictionaryItems = function() {
                return DictionaryService.getDictionary();
            };
            // End: isteven Dropdown Data Structure
            //END FIXME

            scope.$ctrl.formatTitle = function(item) {
                var strFormatter = scope.itemTitle;
                return angular.isString(strFormatter) ? $parse(strFormatter)(item) : strFormatter(item);
            };
            scope.$ctrl.onDelete = scope.onEntryDelete || angular.noop;

            if(scope.onAfterDialogOpen)
                ctrl.initAfterDialogOpen(scope.onAfterDialogOpen);
            scope.$watchCollection(function(){ return model.$modelValue; }, function(newValue, oldValue) {
                if (oldValue !== newValue) {
                    model.$modelValue = null;
                }
            });
        }

        function multiEntryController() {
            var ctrl = this,
                onOpenAddEntryDialog = angular.noop,
                onOpenEditEntryDialog = angular.noop,
                onAfterDialogOpen = angular.noop;

            ctrl.locals = {};

            ctrl.showList = true;

            ctrl.deleteEntry = deleteEntry;
            ctrl.allowModifications = true;
            ctrl.openEntryDialog = openEntryDialog;
            ctrl.closeEntryDialog = closeEntryDialog;
            ctrl.initOpenAddEntryDialog = initOpenAddEntryDialog;
            ctrl.initOpenEditEntryDialog = initOpenEditEntryDialog;
            ctrl.initAfterDialogOpen = initAfterDialogOpen;

            ////////////

            function deleteEntry(item) {
                if (ctrl.allowModifications) {
                    var list = ctrl.model.$modelValue,
                        index = list.indexOf(item);
                    list.splice(index, 1);
                    ctrl.onDelete({ removed: item });
                }
            }

            function openEntryDialog(item) {
                if (ctrl.allowModifications) {
                    ctrl.allowModifications = false;
                    if (!item)
                        onOpenAddEntryDialog();
                    else
                        onOpenEditEntryDialog(item);
                    onAfterDialogOpen(item, ctrl.locals);
                }
            }

            function closeEntryDialog() {
                ctrl.allowModifications = true;
            }

            function initOpenAddEntryDialog(func) {
                if (onOpenAddEntryDialog  === angular.noop)
                    onOpenAddEntryDialog = func;
            }

            function initOpenEditEntryDialog(func) {
                if (onOpenEditEntryDialog === angular.noop)
                    onOpenEditEntryDialog = func;
            }

            function initAfterDialogOpen(func) {
                if (onAfterDialogOpen === angular.noop)
                    onAfterDialogOpen = func;
            }
        }
    }

    function multiEntryListDirective() {
        var defaultTrackBy = "$index";

        return {
            restrict: 'E',
            transclude: true,
            templateUrl: function(element, attr) {
                return attr.editable === "true"
                    ? 'components/controls/multi-entry-list-editable.tpl.html'
                    : 'components/controls/multi-entry-list.tpl.html';
            },
            compile: compile
        };

        /////////////

        function compile(element, attr) {
            var listitem = element.find('li'),
                repeatExp = "item in $ctrl.model.$modelValue",
                trackBy = "track by " + (attr.listtrackby || defaultTrackBy);
            if(attr.listfilter)
                repeatExp += " | " + attr.listfilter;

            repeatExp += " " + trackBy;

            listitem.attr('ng-repeat', repeatExp);
        }
    }

    function multiEntryHeaderDirective() {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl:'components/controls/multi-entry-header-section.tpl.html'
        };
    }
})();
