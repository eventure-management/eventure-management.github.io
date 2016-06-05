'use strict';

(function () {
	var app = angular.module('myApp');

	var Injectables = ['$scope', '$http', '$routeParams'];
	var manageReviewersController = function($scope, $http, $routeParams) {
		$scope.reviewers = [];
		$scope.manager = {}
		$scope.search = {
			input: ""
		};
		$scope.response = "";

		$scope.askToReview = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getUser',
				email: $scope.search.input
			};

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					$scope.reviewers.push(result.data[0]);
					addEventRole(result.data[0].email, $routeParams.eventid);
				}
				else {
					console.log(result.message);
				}
			}, function (response) {
				console.log(response);
			});
		};

		function addEventRole(email, event_id) {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'addEventRole',
				email: email,
				event_id: event_id,
				role_name: "pending"
			};

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					$scope.response = email + " sent invite to be reviewer";
					sendInvite(email, event_id);
				}
				else {
					$scope.response = email + " was unable to be invited as a reviewer";
					console.log(result.message);
				}
			}, function (response) {
				console.log(response);
			});
		}

		function sendInvite(email, event_id) {
			//create conversation between event manager and reviewer
			var url = $scope.API_URL;
			var email_list = $scope.manager.email + "," + email;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'createConversation',
				emails: email_list
			};

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					console.log("Conversation created");

					//send message JSON.stringy({message: "", type: "", data: {event_id: ""}})
					sendMessage(email, event_id, result.data.id);
				}
				else {
					console.log(result.message);
				}
			}, function (response) {
				console.log(response);
			});
		}

		function sendMessage(email, event_id, conversation_id) {
			//send message JSON.stringy({message: "", type: "", data: {event_id: ""}})
			var url = $scope.API_URL;

			var content = {
				message: "You have been invited to be a reviewer of our conference",
				type: "reviewerInvite",
				data: {
					event_id: event_id
				}
			};

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'sendMessage',
				sender_email: $scope.manager.email,
				content: JSON.stringify(content),
				conversation_id: conversation_id
			};

			console.log(data);

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

		$scope.editReviewer = function() {

		}

		$scope.removeReviewer = function(email) {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'deleteEventRole',
				event_id: $routeParams.eventid,
				email: email
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					console.log("Reviewer deleted");
					$scope.response = "Reviewer removed successfully";
					$scope.getReviewers();
				}
				else {
					console.log("Reviewer not deleted");
					$scope.response = result.message;
				}
			}, function (response) {
				console.log(response);
			});
		}

		$scope.getReviewers = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getEventRolesForEvent',
				event_id: $routeParams.eventid
			};

			console.log(data);

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					$scope.reviewers = [];
					$scope.manager = {};
					for (var i=0; i<result.data.length; i++) {
						if (result.data[i].role_name == "manager") {
							$scope.manager = result.data[i];
							console.log("Manager is " + $scope.manager.email);
						}
						else if (result.data[i].role_name == "reviewer" || result.data[i].role_name == "pending") {
							$scope.reviewers.push(result.data[i]);
							console.log("Reviewer is " + $scope.reviewers[$scope.reviewers.length-1].email);
						}
					}
				}
				else {
					console.log(result.message);
				}
			}, function (response) {
				console.log(response);
			});
		};
		$scope.getReviewers();
	};

	app.controller('manageReviewersCtrl', Injectables.concat([manageReviewersController]));
})();
