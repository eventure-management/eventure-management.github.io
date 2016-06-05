'use strict';

(function () {
	var app = angular.module('myApp');

	var Injectables = ['$scope', '$http', '$routeParams', '$sce'];
	var userManagePaperController = function($scope, $http, $routeParams, $sce) {
		$scope.paper = {};

		$scope.event = {
			type: ""
		};

		//add paper to event
		$scope.searchEvent = {
			query: ""
		};
		$scope.events = [];

		//add author
		$scope.author = {
			email: ""
		};

		//remove author
		$scope.authors = [];

		//add / edit / remove tags
		$scope.tags = [];

		//output
		$scope.response = [];

		$scope.paper.paper_id = $routeParams.paperid;

		$scope.trustedURL = function (str) {
			return $sce.trustAsUrl(str);
		};

		//get paper
		$scope.getPaper = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getPaperDetails',
				paper_id: $scope.paper.paper_id
			};

			console.log(data);

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == 'true' || result.success == true) {
					//output success
					$scope.paper = result.data[0];
				}
				else {
					//output fail
					$scope.response.push({icon: 'warning', content: "Was unable to get paper with id " + $scope.paper.paper_id});
					console.log(result.message);
				}
			}, function (response) {
				//something bad happened
				$scope.response.push({icon: 'error', content: "Something didn't quite go right in getPaper"});
				console.log(response);
			});
		};
		$scope.getPaper();

		//get authors
		$scope.getAuthors = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getPaperAuthors',
				paper_id: $scope.paper.paper_id
			};

			console.log(data);

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == 'true' || result.success == true) {
					console.log("Success got Authors")
					//output success
					$scope.authors = [];
					for (var i=0; i<result.data.length; i++) {
						$scope.authors.push(result.data[i].email);
					}
				}
				else {
					//output fail
					$scope.response.push({icon: 'warning', content: "Was unable to get authors for paper with id " + $scope.paper.paper_id});
					console.log(result.message);
				}
			}, function (response) {
				//something bad happened
				$scope.response.push({icon: 'error', content: "Something didn't quite go right in getPaperAuthors"});
				console.log(response);
			});
		};
		$scope.getAuthors();

		//get tags
		$scope.getTags = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getPaperTags',
				paper_id: $scope.paper.paper_id
			};

			console.log(data);

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == 'true' || result.success == true) {
					//output success
					$scope.tags = [];
					for (var i=0; i<result.data.length; i++)
						$scope.tags.push(result.data[i]);
				}
				else {
					//output fail
					$scope.response.push({icon: 'info', content: "There are no tags for paper with id " + $scope.paper.paper_id});
				}
			}, function (response) {
				//something bad happened
				$scope.response.push({icon: 'error', content: "Something didn't quite go right in getPaperTags"});
				console.log(response);
			});
		};
		$scope.getTags();

		//add author
		$scope.add = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'addPaperAuthor',
				email: $scope.author.email,
				paper_id: $scope.paper.paper_id
			};

			console.log($scope.paper);
			console.log(data);

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == 'true' || result.success == true) {
					//output success
					$scope.authors.push(data.email);
				}
				else {
					//output fail
					$scope.response.push({icon: 'warning', content: "Was unable to add author to paper in addPaperAuthor"});
				}
			}, function (response) {
				//something bad happened
				$scope.response.push({icon: 'error', content: "Something didn't quite go right in addPaperAuthor"});
				console.log(response);
			});
		};

		//remove author
		$scope.remove = function(authorEmail) {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'removePaperAuthor',
				email: authorEmail
			};

			$scope.response.push({icon: 'info', content: "Removing authors not yet supported"});
			// $http.post(url, data).then(function (response) {
			// 	var result = response.data;
			// 	if (result.success == 'true' || result.success == true) {
			// 		//remove author from local array
			// 		var index = authors.indexOf(authorEmail);
			// 		if (index > -1)
			// 			array.splice(index, 1);
			//
			// 		//output success
			// 		$scope.response.push({icon: 'info', content: "Author was successfully removed"});
			// 	}
			// 	else {
			// 		//output fail
			// 		$scope.response.push({icon: 'warning', content: "Was unable to remove author from paper in addPaperAuthor"});
			// 	}
			// })
			// .then(function (response) {
			// 	//something bad happened
			// 	$scope.response.push({icon: 'error', content: "Something didn't quite go right in addPaperAuthor"});
			// 	console.log(response);
			// });
		};

		//update paper
		$scope.edit = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'updatePaper',
				paper_id: $scope.paper.paper_id,
				title: $scope.paper.title,
				publish_date: $scope.paper.publish_date,
				latest_submit_date: toDateString(new Date()),
				paper_data_url: $scope.paper.paper_data_url
			};

			$scope.response = "This one can take awhile, please be patient";

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == true) {
					//output success
					$scope.response.push({ icon: 'info', content: "Paper succesfully updated" });
				}
				else {
					//output fail
					$scope.response.push({icon: 'warning', content: "Something went wrong in updatePaper"});
				}
			}, function (response) {
				//something bad happened
				$scope.response.push({icon: 'error', content: "Something didn't quite go right in updatePaper"});
				console.log(response);
			});
		};

		//delete paper
		$scope.delete = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'deletePaper',
				paper_id: $scope.paper.paper_id
			};

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == true) {
					//output success
					$scope.response.push({ icon: 'info', content: "Paper succesfully deleted" });
				}
				else {
					//output fail
					$scope.response.push({icon: 'warning', content: "Warning: " + result.message});
				}
			}, function (response) {
				//something bad happened
				$scope.response.push({icon: 'error', content: "Error: " + response});
				console.log(response);
			});
		};

		//add tag

		//close tag
		$scope.closeTag = function(tagName) {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getPaper',
				paper_id: $scope.paper.paper_id,
				tag: tagName
			};

			$scope.response.push({icon: 'info', content:"At the moment you cannot remove tags, sorry #notsorry"});

			// $http.post(url, data).then(function (response) {
			// 	var result = response.data;
			// 	if (result.success == 'true' || result.success == true) {
			// 		//output success
			// 		$scope.authors = [];
			// 		for (var i=0; i<result.data.length; i++)
			// 			$scope.authors.push(result.data[0].email);
			// 	}
			// 	else {
			// 		//output fail
			// 		$scope.response = "Was unable to get authors for paper with id " + $scope.paper.paper_id;
			// 	}
			// })
			// .then(function (response) {
			// 	//something bad happened
			// 	$scope.response = "Something didn't quite go right";
			// 	console.log(response);
			// });
		};

		function toDateString(dateObj) {
			dateObj = dateObj.toISOString();
			return dateObj.substr(0, 10) + " " + dateObj.substr(11, 5);
		}

		//search for an event
		$scope.searchEvent = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getEventsByKeyword',
				keyword: $scope.searchEvent.query
			};

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == 'true' || result.success == true) {
					$scope.events = [];
					for (var i=0; i<result.data.length; i++) {
						$scope.events.push(result.data[i]);
						$scope.events[$scope.events.length-1].venue = getVenueInfo($scope.events[$scope.events.length-1].venue_id);
					}
				}
				else {
					$scope.response.push({ icon: 'info', content: "Was unable to find any matches" });
				}
			}, function (response) {
				$scope.response.push({ icon: 'error', content: response });
			});
		};

		function getVenueInfo(id) {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getVenue',
				venue_id: id
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == 'true' || result.success == true) {
					return result.data;
				}
				else {
					$scope.response.push({ icon: 'warning', content: "Unable to get venueinfo for event" });
				}
			}, function (response) {
				$scope.response.push({ icon: 'error', content: response });
			});
		}

		//add to event
		$scope.submitToEvent = function(eventid) {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'addPaperToEvent',
				paper_id: $scope.paper.paper_id,
				event_id: eventid
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == 'true' || result.success == true) {
					$scope.response.push({ icon: 'info', content: "Succesfully added paper to event for review" });
				}
				else {
					$scope.response.push({ icon: 'warning', content: "Unable to submit paper to event" });
					console.log(result.message);
				}
			}, function (response) {
				$scope.response.push({ icon: 'error', content: "Something went wrong" });
				console.log(response);
			});
		};
	};

	app.controller('userManagePaperCtrl', Injectables.concat([userManagePaperController]));
})();
