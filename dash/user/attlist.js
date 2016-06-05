'use strict';

(function () {
	var app = angular.module('myApp');

	var Injectables = ['$scope', '$http', '$routeParams'];
    var attendeesController = function ($scope, $http, $routeParams) {
		$scope.response = null;
		$scope.eventid = $routeParams.eventid;
		$scope.attendees = [];

		$scope.getAttendees = function() {
			var url = $scope.API_URL;
			console.log($scope.eventid);
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getEventAttendees',
				event_id: $scope.eventid
	        };
			console.log(data);
	        $http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("success");

					$scope.attendees = [];
					for (var i=0; i<result.data.length; i++)
						$scope.attendees.push(result.data[i]);
				}
				else {
					console.log("failure");
					$scope.response = result.message;
				}
	        }, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}
		$scope.getAttendees();
	};

	app.controller('attendeesCtrl', Injectables.concat([attendeesController]));
})();
