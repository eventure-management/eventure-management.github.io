'use strict';

(function () {
	var app = angular.module('myApp');

	var Injectables = ['$scope', '$http'];
	var userPapersController = function($scope, $http) {
		$scope.papers = [];

		//function on press
		$scope.getPapers = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getPapersByAuthor',
				email: $scope.user.email
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					//do stuff
					$scope.papers = [];
					for (var i=0; i<result.data.length; i++) {
						$scope.papers.push(result.data[i]);
						$scope.papers[$scope.papers.length-1].tags = []; //can't do this yet
						$scope.papers[$scope.papers.length-1].events = []; //or this
					}
					console.log("success");
				}
				else {
					//output fail
					console.log("fail");
					console.log(result);
				}
			})
			.then(function (response) {
				//something bad happened
			});
		};
		$scope.getPapers();
	};

	app.controller('userPapersCtrl', Injectables.concat([userPapersController]));
})();
