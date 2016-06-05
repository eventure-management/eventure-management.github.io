'use strict';

(function () {
	var app = angular.module('myApp');

	var Injectables = ['$scope', '$http', '$routeParams'];
	var paperReviewController = function($scope, $http, $routeParams) {
		if ($scope.user === null || $scope.user === undefined) {
			$location.path('/notauthorised');
		}

		$scope.review = {
			rate: 0,
			comment: ""
		};

		$scope.reviewPaper = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'addReview',
				email: $scope.user.email,
				paper_id: $routeParams.paperid,
				event_id: $routeParams.eventid,
				comment: $scope.review.comment,
				rate: $scope.review.rate
			};

			console.log(data);

			$http.post(url, data).then(function (response) {
				var result = response.data;
				console.log(result);
				console.log(response);
				if (result.success == "true") {
					//output success
					console.log("paper review submitted successfully");

					deleteFromConversation();
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

		function deleteFromConversation() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'removeUserFromConversation',
				email: $scope.user.email,
				conversation_id: $routeParams.conversationid
			};

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					//output success
					console.log("removed notification");
				}
				else {
					//output fail
					console.log(result.message);
				}
			}, function (response) {
				//something bad happened
				console.log(response);
			});
		}
	};

	app.controller('paperReviewCtrl', Injectables.concat([paperReviewController]));
})();
