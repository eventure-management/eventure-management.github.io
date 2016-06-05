'use strict';

(function () {
	var app = angular.module('myApp');

	var Injectables = ['$scope', '$http', '$location'];
	var upgradeController = function($scope, $http, $location) {
		if ($scope.user === null || $scope.user === undefined) {
			$location.path('/notauthorised');
		}

		//function on press
		$scope.upgrade = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'updateUser',
				email: $scope.user.email,
				upgraded: 'true'
			};

			console.log(data);
			console.log($scope.user)

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					//output success
					console.log("successful upgrade");
					$scope.user.upgraded = 'true';
					localStorage.setItem("user", JSON.stringify($scope.user));
					$location.path('/dash');
				}
				else {
					//output fail
					console.log(result.message);
				}
			}, function (response) {
				//something bad happened
				console.log(response);
			});
		};
	};

	app.controller('upgradeCtrl', Injectables.concat([upgradeController]));
})();
