!function () {
    'use strict';

    var app = angular.module('app');

    app.controller('ProgramSearchCtrl', ['$state', '$scope', '$stateParams', 'appConstants', 'SearchFactory', 'Dictionary', 'DictionaryService',
        function ($state, $scope, $stateParams, appConstants, SearchFactory, Dictionary, DictionaryService) {
            $scope.globalSearchValue = $scope.globalSearchValue || $stateParams['keyword'] || SearchFactory.getSearchCriteria().keyword || '';
            $scope.itemsByPage = appConstants.DEFAULT_PAGE_ITEM_NUMBER;
            $scope.itemsByPageNumbers = appConstants.PAGE_ITEM_NUMBERS;
            $scope.advancedSearch = SearchFactory.getSearchCriteria().advancedSearch;
            $scope.dictionary = {};

            //loading dictionary: assistance_type
            Dictionary.query({ids: 'assistance_type'}, function (data) {
                //Assistance Types
                $scope.dictionary.aAssistanceType = DictionaryService.istevenDropdownDataStructure(data.assistance_type, $scope.advancedSearch.aAssistanceType, true);
            });

            //remove custom search fields out of advanced search fields criteria
            if($state.current['name'] === 'advancedSearch' || $state.current['name'] === 'home' || ($stateParams.hasOwnProperty('removeCustomSearchFields') && $stateParams.removeCustomSearchFields)) {
                //remove pre-filtered Publication Listing (Coming from home "New in 2016" section)
                if($scope.advancedSearch.hasOwnProperty('publicationListingType')) {
                    delete $scope.advancedSearch.publicationListingType;
                }
            }

            //initialize advanced search fields criterias
            if ($state.current['name'] === 'advancedSearch' || $state.current['name'] === 'home') {
                //loading dictionaries
                //var aDictionaries = ['assistance_type', 'applicant_types', 'beneficiary_types', 'functional_codes', 'program_subject_terms'];
                var aDictionaries = ['applicant_types', 'beneficiary_types', 'functional_codes', 'assistance_usage_types'];
                Dictionary.query({ids: aDictionaries.join(',')}, function (data) {
                    //Functional Code
                    $scope.dictionary.aFunctionalCode = DictionaryService.istevenDropdownDataStructure(data.functional_codes, $scope.advancedSearch.aFunctionalCode, true);

                    //Applicant Eligibility
                    $scope.dictionary.aApplicantEligibility = DictionaryService.istevenDropdownDataStructure(data.applicant_types, $scope.advancedSearch.aApplicantEligibility, false);

                    //Beneficiary Eligibility
                    $scope.dictionary.aBeneficiaryEligibility = DictionaryService.istevenDropdownDataStructure(data.beneficiary_types, $scope.advancedSearch.aBeneficiaryEligibility, false);

                    //Use of Assistance
                    $scope.dictionary.aAssistanceUsageType = DictionaryService.istevenDropdownDataStructure(data.assistance_usage_types, $scope.advancedSearch.aAssistanceUsageType, false);
                });

                //function for setting the popup when opened to it's field input
                $scope.openDatepicker = function ($event, openedInput) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.advancedSearch[openedInput] = true;
                };

                //setting for datepicker
                $scope.dateOptions = {
                    formatYear: 'yy',
                    showWeeks: false,
                    startingDay: 1
                };

                /**
                 * clear all advanced search form inputs
                 * @returns Void
                 */
                $scope.clearAdvancedSearchForm = function () {
                    var aArray = ['aAssistanceType', 'aFunctionalCode', 'aApplicantEligibility', 'aBeneficiaryEligibility', 'aAssistanceUsageType'];
                    $scope.advancedSearch = {};

                    $scope.dictionary = DictionaryService.istevenDropdownResetData($scope.dictionary, aArray);
                    //empty Search criteria (keyword & advanced search criterias) 
                    //when user go to other pages rather then search
                    SearchFactory.setSearchCriteria(null, {});

                    $scope.globalSearchValue = '';
                };
            }

            $scope.searchKeyUp = function (keyCode) {
                if (keyCode === 13) {
                    $scope.searchPrograms();
                }
            };

            /**
             * Perform Search
             * @returns Void
             */
            $scope.searchPrograms = function () {
                //set the search criteria into factory and store them
                SearchFactory.setSearchCriteria($scope.globalSearchValue, $scope.advancedSearch);
                $state.go('searchPrograms', {keyword: $scope.globalSearchValue}, {reload: true, inherit: false});
            };

            var lastTime;
            $scope.getSearchResults = function (tableState) {
                if (lastTime && ((new Date()).getTime() - lastTime) < 500) {
                    return;
                }
                lastTime = (new Date()).getTime();

                tableState = tableState || {
                        search: {},
                        pagination: {},
                        sort: {}
                    };

                $scope.isLoading = true;

                var queryObj = {
                    keyword: $scope.globalSearchValue,
                    size: $scope.itemsByPage,
                    includeCount: true
                };

                //advanced seach
                var advancedSearch = $scope.prepareAdvancedSearchDataStructure(SearchFactory.getSearchCriteria().advancedSearch);
                //check if we have criteria set from advanced search
                if (!_.isEmpty(advancedSearch)) {
                    angular.extend(queryObj, {oFilterParam: JSON.stringify(advancedSearch)});
                    //console.log(queryObj);
                }

                if (tableState.pagination.start) {
                    queryObj["page"] = Math.ceil(tableState.pagination.start / queryObj.size);
                }

                if (tableState.sort.predicate) {
                    var isDescending = tableState.sort.reverse,
                        sortingProperty = tableState.sort.predicate;
                    queryObj.sortBy = ( isDescending ? '-' : '' ) + sortingProperty;
                }

                SearchFactory.search().get(queryObj, function (data) {
                    $scope.searchResults = data.results;
                    $scope.isLoading = false;
                    tableState.pagination.numberOfPages = Math.ceil(data.totalCount / $scope.itemsByPage);
                    tableState.pagination.totalItemCount = data.totalCount;
                });
            };

            /**
             * prepare advanced search data structure to send to search API as parameters
             * @param Object advancedSearchData
             * @returns Object
             */
            $scope.prepareAdvancedSearchDataStructure = function (advancedSearchData) {
                var aArray = ['aAssistanceType', 'aFunctionalCode', 'aApplicantEligibility', 'aBeneficiaryEligibility', 'aAssistanceUsageType'];
                var oResult = DictionaryService.istevenDropdownGetIds(advancedSearchData, aArray);

                //include whatever left into oResult Object
                if (advancedSearchData.hasOwnProperty('datePublishedStart')) {
                    oResult['datePublishedStart'] = advancedSearchData.datePublishedStart;
                }
                if (advancedSearchData.hasOwnProperty('datePublishedEnd')) {
                    oResult['datePublishedEnd'] = advancedSearchData.datePublishedEnd;
                }
                if (advancedSearchData.hasOwnProperty('executiveOrder12372')) {
                    oResult['executiveOrder12372'] = advancedSearchData.executiveOrder12372;
                }
                if (advancedSearchData.hasOwnProperty('recovery')) {
                    oResult['recovery'] = advancedSearchData.recovery;
                }
                if (advancedSearchData.hasOwnProperty('publicationListingType')) {
                    oResult['publicationListingType'] = advancedSearchData.publicationListingType;
                }
                return oResult;
            };
        }
    ]);
}();