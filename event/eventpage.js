'use strict';

(function () {
	var app = angular.module('myApp');

	var Injectables = ['$scope', '$http', '$routeParams'];
	var eventpageController = function($scope, $http, $routeParams) {

		setTimeout(function() {
			$('select').material_select();
		}, 500);

		//function on press
		$scope.event = {};
		$scope.tags = [];
		$scope.tickets = [];
		$scope.response = "";
		$scope.price = {
			total: 0
		};

		//get event
		$scope.getEvent = function() {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getEvent',
				event_id: $routeParams.eventid
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == 'true' || result.success == true) {
					$scope.event = result.data[0];
					$scope.event.venue = {};
					getVenue();
					getTags();
					getPoster();
				}
				else {
					$scope.event.name = "Invalid Event ID";
				}
			}, function (response) {
				console.log("Server error");
				console.log(response);
			});
		};

		function getPoster() {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getPoster',
				event_id: $scope.event.event_id
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == 'true' || result.success == true) {
					$scope.event.poster_data_url = result.data.poster_data_url;
				}
			}, function (response) {
				console.log("Server error");
				console.log(response);
			});
		}

		//get tickets for attendeeinfo.html & buyticket.html
		$scope.getTickets = function() {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getEventTickets',
				event_id: $routeParams.eventid
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;

				if (result.success == 'true' || result.success == true) {
					$scope.tickets = [];
					for (var i=0; i<result.data.length; i++) {
						$scope.tickets.push(result.data[i]);
						// $scope.attendee.ticketname = result.data[i].name;
					}
				}
				else {
					$scope.event.name = "Invalid Event ID";
					console.log("invalid");
				}
			}, function (response) {
				console.log("Server error");
				console.log(response);
			});
		};
		$scope.getTickets();

		//get venues
		function getVenue() {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getVenue',
				venue_id: $scope.event.venue_id
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == 'true' || result.success == true) {
					$scope.event.venue = result.data[0];
				}
				else {
					$scope.event.venue.city = "Invalid";
					$scope.event.venue.state = "Venue";
					$scope.event.venue.country = "ID";
				}
			}, function (response) {
				console.log("Server error");
				console.log(response);
			});
		}

		//get tags
		function getTags() {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getEventTags',
				event_id: $scope.event.event_id
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == 'true' || result.success == true) {
					$scope.tags = [];
					for(var i=0; i<result.data.length; i++) {
						$scope.tags.push(result.data[i]);
					}

					console.log($scope.tags);
				}
				else {
					$scope.tags[0] = "No Tags";
				}
			}, function (response) {
				console.log("Server error");
				console.log(response);
			});
		}

		$scope.getEvent();

		function createTicketRecord() {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'createTicketRecord',
				event_id: $scope.event.event_id,
				title: $scope.tickets[0].title,
				ticket_name: $scope.tickets[0].name,
				class: $scope.tickets[0].class,
				type: $scope.tickets[0].type
			};
			console.log(data);
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					//reset values
					$scope.response = "Ticket record added succesfully";
				}
				else {
					$scope.response = "Unable to create ticket"
					console.log(result.message);
				}
			}, function (response) {
				$scope.response = "Spaghetti";
				console.log(response);
			});
		}

	};

	app.controller('eventpageCtrl', Injectables.concat([eventpageController]));
})();
