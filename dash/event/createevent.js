'use strict';

(function () {
	var app = angular.module('myApp');

	var Injectables = ['$scope', '$http', '$location'];
    var createeventController = function ($scope, $http, $location) {
		setTimeout(function () {
			$(document).ready(function() {
	    		$('select').material_select();
			});
		}, 500);

		//$scope.stageurl = ["/dash/create/basic", "/dash/create/tickets", "/dash/create/papers", "/dash/create/rooms", "/dash/create/sessions"];
		$scope.event = {
			id: "",
			name: "",
			type: "",
			from_date: null,
			start_hours: null,
			start_minutes: null,
			to_date: null,
			end_hours: null,
			end_minutes: null,
			description: "",
			paper_deadline: null,
			venue_id: "",
			privacy: null
		};

		$scope.venue = {
			id: undefined,
			name: undefined,
			type: undefined,
			street: undefined,
			city: undefined,
			state: undefined,
			country: undefined,
			longitude: undefined,
			latitude: undefined
		};

		$scope.venues = [];

		$scope.create = function() {
			if (!$scope.event.venue_id) {
				createVenue();
			}
			else {
				createEvent();
			}
		}

		function createEvent() {
			//data
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'createEvent',
				name: $scope.event.name,
				type: $scope.event.type,
				from_date: $scope.event.from_date,
				to_date: $scope.event.to_date,
				description: $scope.event.description,
				venue_id: $scope.event.venue_id,
				paper_deadline: $scope.event.paper_deadline,
				email: $scope.user.email,
				privacy: $scope.event.privacy
			};

			console.log(data);

			if (data.venue_id === undefined) {
				$scope.response = "Please pick or create a venue";
				return;
			}

			//post request
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("createEvent success");
					//tell the user it was successful
					$scope.response = "Event created succesfully";

					//if conference send to next step
					$location.path("/dash/event/"+result.data.id);

					//update the local event with updated values
					$scope.event.id = result.data.id;
				}
				else {
					console.log("createEvent failure " + result.message);
					$scope.response = result.message;
				}
			}, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}

		//http request function
		function createVenue() {
			//create venue
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'createVenue',
				name: $scope.venue.name,
				type: $scope.venue.type,
				street: $scope.venue.street,
				city: $scope.venue.city,
				state: $scope.venue.state,
				country: $scope.venue.country,
				longitude: $scope.venue.longitude,
				latitude: $scope.venue.latitude
			};

			//post request
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("success");
					//tell the user it was successful
					$scope.response = "Venue created succesfully";

					//update the local venue with id
					$scope.venue.id = result.data.id;
					$scope.event.venue_id = result.data.id;
					console.log(result.data.id);

					createEvent();
				}
				else {
					console.log("failure");
					$scope.response = result.message;
				}
	        }, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}

		$scope.getVenues = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getVenuesByLocation',
				city: $scope.venue.city,
				state: $scope.venue.state,
				country: $scope.venue.country
			};

			//make sure all input is in
			if (data.country === undefined) {
				return;
			}

			//post request
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("success");
					//tell the user it was successful
					$scope.response = "Venue created succesfully";

					//update the local venue with id
					$scope.venues = [];
					for (var i=0; i<result.data.length; i++)
						$scope.venues.push(result.data);
				}
				else {
					console.log("failure");
					$scope.response = result.message;
				}
	        }, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}

		function toDateString(dateObj) {
			dateObj = dateObj.toISOString();
			return dateObj.substr(0, 10) + " " + dateObj.substr(11, 5);
		}
	};

	app.controller('createEventCtrl', Injectables.concat([createeventController]));
})();
