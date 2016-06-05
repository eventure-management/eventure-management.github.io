'use strict';

(function () {
	var app = angular.module('myApp');
	var Injectables = ['$scope', '$http', '$location'];
	var DashController = function($scope, $http, $location) {
		console.log("dashjs init");
		if ($scope.user === null || $scope.user === undefined) {
			$location.path('/notauthorised');
		}

		$scope.Conversations = [];

		//function on press
		$scope.getConversation = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getConversationsByUser',
				email: $scope.user.email
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				console.log("here");
				if (result.success == "true" || result.success == true) {
					//do stuff
					$scope.Conversations = [];
					for (var i=0; i<result.data.length; i++) {
						result.data[i].content = JSON.parse(result.data[i].content);
						$scope.Conversations.push(result.data[i]);
					}
					console.log("success");
				}
				else {
					//output fail
					console.log("fail");
					console.log(result);
				}
			},function (response) {
				$scope.response="Error";
				console.log(response);
			});
		};
		$scope.getConversation();

		$scope.declineReviewer = function(event_id, conversation_id) {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'editEventRole',
				email: $scope.user.email,
				event_id: event_id,
				role_name: "declined"
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				console.log("here");
				if (result.success == "true" || result.success == true) {
					//do stuff
					console.log("declined");
					//remove notification
					removeNotification(conversation_id);
				}
				else {
					//output fail
					console.log("fail decline");
					console.log(result);
				}
			},function (response) {
				$scope.response="Error";
				console.log(response);
			});
		};

		$scope.acceptReviewer = function(event_id, conversation_id) {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'editEventRole',
				email: $scope.user.email,
				event_id: event_id,
				role_name: "reviewer"
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				console.log("here");
				if (result.success == "true" || result.success == true) {
					//do stuff
					console.log("accepted");
					//remove notification
					removeNotification(conversation_id);
				}
				else {
					//output fail
					console.log("fail accept");
					console.log(result);
				}
			},function (response) {
				$scope.response="Error";
				console.log(response);
			});
		};

		$scope.declinePaper = function(paper_id, event_id, conversation_id) {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'acceptPaper',
				accept: "rejected",
				email: $scope.user.email,
				event_id: event_id,
				paper_id: paper_id
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				console.log("here");
				if (result.success == "true" || result.success == true) {
					//do stuff
					console.log("declined");
					//remove notification
					removeNotification(conversation_id);
				}
				else {
					//output fail
					console.log("fail decline");
					console.log(result);
				}
			},function (response) {
				$scope.response="Error";
				console.log(response);
			});
		};

		$scope.acceptPaper = function(paper_id, event_id, conversation_id) {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'acceptPaper',
				accept: "accepted",
				email: $scope.user.email,
				event_id: event_id,
				paper_id: paper_id
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				console.log("here");
				if (result.success == "true" || result.success == true) {
					//do stuff
					console.log("accepted");
					//remove notification
					removeNotification(conversation_id);
				}
				else {
					//output fail
					console.log("fail accept");
					console.log(result);
				}
			},function (response) {
				$scope.response="Error";
				console.log(response);
			});
		};

		function removeNotification(conversation_id) {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'removeUserFromConversation',
				email: $scope.user.email,
				conversation_id: conversation_id
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				console.log("here");
				if (result.success == "true" || result.success == true) {
					//do stuff
					console.log("notification removed");
				}
				else {
					//output fail
					console.log("notification unable to be removed");
					console.log(result);
				}
			},function (response) {
				$scope.response="Error";
				console.log(response);
			});
		}

		$scope.downloadPaper = function(paper_id) {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getPaperDataUrl',
				paper_id: paper_id
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					window.open(result.data.paper_data_url);
				}
				else {
					console.log(result.message);
				}
			}, function (response) {
				console.log(response);
			});
		}

		$scope.reviewPaper = function(paper_id, event_id, conversation_id) {
			$location.path("/review/" + paper_id + "/" + event_id + "/" + conversation_id);
		}
	};
	app.controller('DashCtrl', Injectables.concat([DashController]));


})();
