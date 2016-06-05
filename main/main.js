
'use strict';

(function () {
	var app = angular.module('myApp');

	var Injectables = ['$scope', '$http'];
    var mainController = function ($scope, $http) {
		$scope.events = [];
		$scope.tags = [];

		$scope.get = function() {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getUpcomingEventsByCountry',
				country: 'Australia'
			};

			console.log(data);

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					console.log("Successfully grabbed events");

					$scope.events = [];
					for (var i=0; i<result.data.length; i++) {
						$scope.events.push(result.data[i]);
					}
				}
				else {
					console.log("No events fetched: " + result.message);
					$scope.response = "No events fetched: " + result.message;
				}
			}, function (response) {
				console.log("API Error: " + response)
			});
		};

		$scope.get();
	};

	app.controller('MainCtrl', Injectables.concat([mainController]));
})();
