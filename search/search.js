'use strict';

(function () {
    var app = angular.module('myApp');

    var Injectables = ['$scope', '$http'];
    var SearchController = function($scope, $http) {
        $scope.search = {
            field: ""
        };
        $scope.response = "";

        $scope.events = [];

        $scope.search = function() {
			var url = $scope.API_URL;
            var data = {
                api_key: $scope.API_KEY,
                app_secret: $scope.APP_SECRET,
                method: 'getEventsByKeyword',
                keyword: $scope.search.field
            };
            $http.post(url, data).then(function (response) {
              var result = response.data;
              if (result.success == "true") {
                console.log("success");
                $scope.response = "Events found.";

                $scope.events = [];
                for (var i=0; i<result.data.length; i++) {
                    $scope.events.push(result.data[i]);
                    getTagsForEvent(result.data[i].event_id);
                }
              }
              else {
                  console.log("success1");
                $scope.response = JSON.stringify(result);
              }
            }, function (response) {
                console.log("success2");
                $scope.response = JSON.stringify(response);
            });
        }

        function getTagsForEvent(event_id) {
            var url = $scope.API_URL;
            var data = {
                method: 'getEventTag',
                event_id: event_id
            }
        }
    };
    app.controller('SearchCtrl', Injectables.concat([SearchController]));
}) ();
