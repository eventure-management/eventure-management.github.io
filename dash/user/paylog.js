'use strict';

(function () {
	var app = angular.module('myApp');

	var Injectables = ['$scope', '$http'];
	var paymentLogController = function($scope, $http) {
		$scope.logs = [];

		//function on press
		$scope.getPapers = function() {
			var url = $scope.API_URL;

			var data = {
				method: 'getPaymentHistory',
				email: $scope.user.email
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == true) {
					//do stuff
					$scope.logs = [];
					for (var i=0; i<result.data.length; i++) {
						$scope.logs.push(result.data[i]);
						$scope.logs[$scope.logs.length-1].tags = []; //can't do this yet
						$scope.logs[$scope.logs.length-1].logs = []; //or this
					}
				}
				else {
					//output fail
				}
			})
			.then(function (response) {
				//something bad happened
			});
		};
		$scope.getPapers();
	};

	app.controller('paymentLogCtrl', Injectables.concat([paymentLogController]));
})();
