'use strict';

(function () {
	var app = angular.module('myApp');

	var Injectables = ['$scope', '$http', '$routeParams'];
    var managePapersController = function ($scope, $http, $routeParams) {
		//initialize dropdowns
		setTimeout(function () {
			$('select').material_select();
		}, 100);

		$scope.papers = {
			reviewedCount: 0,
			inreviewCount: 0,
			pendingCount: 0,
			unassignedCount: 0,
			papers: []
		};
		$scope.reviewers = [];
		$scope.eventid = $routeParams.eventid;
		$scope.manager = "";

		$scope.rate = 3;
		$scope.getStar = function (rate) {
			return new Array(rate);
		}
		$scope.getEmptyStar = function (rate) {
			return new Array(5-rate);
		}

		//selected papers
		$scope.papersSelected = [];
		$scope.toggleSelectionPaper = function(paper_id) {
			var i = $scope.papersSelected.indexOf(paper_id);
			if (i > -1) {
				$scope.papersSelected.splice(i, 1);
			}
			else {
				$scope.papersSelected.push(paper_id);
			}
		}

		//select reviewers
		$scope.reviewer = {
			selected: ""
		};
		$scope.toggleSelectionReviewer = function(reviewer_email) {
			var i = $scope.reviewersSelected.indexOf(reviewer_email);
			if (i > -1) {
				$scope.reviewersSelected.splice(i, 1);
			}
			else {
				$scope.reviewersSelected.push(reviewer_email)
			}
		}

		$scope.topicFilter = "";

		$scope.getEventPapers = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getPapersSubmittedToEvent',
				event_id: $routeParams.eventid
	        };
			console.log(data);
	        $http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					$scope.papers.papers = [];
					for (var i=0; i<result.data.length; i++) {
						getPaperDetails(result.data[i].paper_id, $routeParams.eventid);
					}
				}
				else {
					console.log("failure");
					console.log(result.message);
					$scope.response = result.message;
				}
	        }, function (response) {
				$scope.response = JSON.stringify(response);
			});
		};
		$scope.getEventPapers();

		function getPaperDetails(paper, event) {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getPaperForEvent',
				paper_id: paper,
				event_id: event
			}

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					console.log("Successfully got paper details");
					$scope.papers.papers.push(result.data);
					updateStatuses();
				}
				else {
					console.log(result.message);
				}
			}, function (response) {
				console.log(response);
			});
		}

		$scope.getEventReviewers = function() {
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
					for (var i=0; i<result.data.length; i++) {
						if (result.data[i].role_name == 'reviewer')
							$scope.reviewers.push({email: result.data[i].email});
						else if (result.data[i].role_name == 'manager')
							$scope.manager = result.data[i].email;
					}
					console.log("success event reviewers");
					setTimeout(function() {
						$('select').material_select();
					}, 100);
				}
				else {
					console.log("failure event reviewers");
					console.log(result.message);
				}
			}, function (response) {
				console.log("server error");
				$scope.response = JSON.stringify(response);
			});
		};
		$scope.getEventReviewers();

		$scope.assignPaper = function() {
			//for each reviewer send a message for each paper
			//createConversation();
			//createMessage();
			var url = $scope.API_URL;
			var email_list = $scope.manager;
			//for (var i=0; i<reviewersSelected.length; i++)
			email_list = email_list + "," + $scope.reviewer.selected;

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
					for (var i=0; i<$scope.papersSelected.length; i++) {
						sendReviewerInviteToReviewPaper($routeParams.eventid, $scope.papersSelected[i], result.data.id);
						addReviewer($routeParams.eventid, $scope.papersSelected[i], $scope.reviewer.selected);
					}
					console.log("success event reviewers");
				}
				else {
					console.log("failure event reviewers");
					console.log(result.message);
				}
			}, function (response) {
				console.log("server error");
				$scope.response = JSON.stringify(response);
			});
		};

		function addReviewer(event_id, paper_id, email) {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'addReviewer',
				event_id: event_id,
				paper_id: paper_id,
				email: email
			};

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					console.log("success reviewer added");
				}
				else {
					console.log("failure reviewer added");
				}
			}, function (response) {
				console.log("server error");
			});
		}

		function sendReviewerInviteToReviewPaper(event_id, paper_id, conversation_id) {
			//send message JSON.stringy({message: "", type: "", data: {event_id: ""}})
			var url = $scope.API_URL;

			var content = {
				message: "You have been asked to review this paper",
				type: "paperInvite",
				data: {
					event_id: event_id,
					paper_id: paper_id
				}
			};

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'sendMessage',
				sender_email: $scope.manager,
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

		function updateStatuses() {
			console.log("update statuses");
			$scope.papers.unassignedCount = 0;
			$scope.papers.pendingCount = 0;
			$scope.papers.inreviewCount = 0;
			$scope.papers.reviewedCount = 0;
			for (var i=0; i<$scope.papers.papers.length; i++) {
				if ($scope.papers.papers[i].status == 'unassigned')
					$scope.papers.unassignedCount++;
				else if ($scope.papers.papers[i].status == 'pending')
					$scope.papers.pendingCount++;
				else if ($scope.papers.papers[i].status == 'inreview')
					$scope.papers.inreviewCount++;
				else if ($scope.papers.papers[i].status == 'reviewed')
					$scope.papers.reviewedCount++;
			}
		}
	};

	app.controller('managePapersCtrl', Injectables.concat([managePapersController]));
})();
