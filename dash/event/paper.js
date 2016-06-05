'use strict';

(function () {
	var app = angular.module('myApp');

	var Injectables = ['$scope', '$http', '$routeParams'];
    var paperDetailController = function ($scope, $http, $routeParams) {
		$scope.paper = {};
		$scope.conversations = [];

		$scope.topicFilter = "";

		$scope.getEventPapers = function() {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getPaperForEvent',
				event_id: $routeParams.eventid,
				paper_id: $routeParams.paperid
	        };
	        $http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					$scope.paper = result.data;
				}
				else {
					console.log(result.message);
				}
	        }, function (response) {
				console.log(response);
			});
		}
		$scope.getEventPapers();

		$scope.distributePapers = function() {
			//update to inreview
			updatePaperSubmitted();
			//send message to reviewers with review
			createConversation();
		}

		function updatePaperSubmitted() {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'updatePaperSubmitted',
				event_id: $routeParams.eventid,
				paper_id: $routeParams.paperid,
				status: 'inreview'
	        };
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					console.log("paper updated to in review");
				}
				else {
					console.log(result.message);
				}
			}, function(response) {
				console.log(response);
			});
		}

		function createConversation() {
			var url = $scope.API_URL;
			var email_list = $scope.NOTIFICATION_USER_EMAIL;
			for (var i=0; i<$scope.paper.reviewers.length; i++)
			 	email_list = email_list + "," + $scope.paper.reviewers[i].email;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'createConversation',
				emails: email_list
			};
			console.log(data);
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					sendMessage($routeParams.eventid, $routeParams.paperid, result.data.id);
					console.log("success conversation");
				}
				else {
					console.log("failure conversation");
					console.log(result.message);
				}
			}, function (response) {
				console.log("server error conversation");
			});
		}

		function sendMessage(event_id, paper_id, conversation_id) {
			var url = $scope.API_URL;
			var content = {
				message: "You may now review the paper",
				type: "paperReview",
				data: {
					event_id: event_id,
					paper_id: paper_id
				}
			};
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'sendMessage',
				sender_email: $scope.NOTIFICATION_USER_EMAIL,
				content: JSON.stringify(content),
				conversation_id: conversation_id
			};

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					console.log("Message sent");
				}
				else {
					console.log(result.message);
				}
			}, function (response) {
				console.log(response);
			});
		}
	};

	app.controller('paperDetailCtrl', Injectables.concat([paperDetailController]));
})();
