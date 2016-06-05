'use strict';

(function () {
	var app = angular.module('myApp');

	var Injectables = ['$scope', '$http'];
    var managingController = function ($scope, $http) {
		$scope.response = null;

		$scope.events = [];

		$scope.getEvents = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getEventsManaged',
				email: $scope.user.email
	        };
			console.log(data);
	        $http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("success");

					$scope.events = [];
					for (var i=0; i<result.data.length; i++)
						$scope.events.push(result.data[i]);
				}
				else {
					console.log("failure");
					$scope.response = result.message;
				}
	        }, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}
		$scope.getEvents();
	};

	app.controller('eventsManagedCtrl', Injectables.concat([managingController]));
})();
