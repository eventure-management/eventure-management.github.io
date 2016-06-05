'use strict';

(function () {
	var app = angular.module('myApp');

	var Injectables = ['$scope', '$http', '$routeParams'];
	var buyticketController = function($scope, $http, $routeParams) {

		setTimeout(function() {
			$('select').material_select();
		}, 500);

		//function on press
		$scope.event = {};
		$scope.tickets = [];
		$scope.response = "";
		$scope.total = 0;
		$scope.records = [];
		$scope.stage = 1;
		$scope.session = [];
		$scope.nextnum = [];
		$scope.emails = [];

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
						if (result.data[i].tickets.length>0) {
							for (var j=0; j<result.data[i].tickets.length; j++)
								$scope.tickets.push(result.data[i].tickets[j]);
						}
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

		$scope.next = function() {
			$scope.stage = 2;

			for (var i=0; i<$scope.tickets.length; i++) {
				for (var j=0; j<$scope.tickets[i].qty; j++) {
					$scope.records.push($scope.tickets[i]);
					if ($scope.tickets[i].qty > 1)
					//somehow when quantity is more than one the number input doubles its value
						$scope.total += $scope.tickets[i].price * ($scope.tickets[i].qty/2);
					else
						$scope.total += $scope.tickets[i].price * $scope.tickets[i].qty;
				}
			}

			//populate sessions array according to record
			$scope.sessions = [];
			$scope.nextnum = [];
			for (var i=0; i<$scope.records.length; i++) {
				console.log($scope.records[i].title);
				//first get ticket session
				var url = $scope.API_URL;
				var data = {
					api_key: $scope.API_KEY,
					app_secret: $scope.APP_SECRET,
					method: 'getSession',
					event_id: $routeParams.eventid,
					title: $scope.records[i].title
				};
				console.log(data);
				$http.post(url, data).then(function (response) {

					var result = response.data;
					if (result.success == "true" || result.success == true) {
						$scope.sessions.push(result.data[0]);
					}
					else {
						$scope.response = "Unable to find session";
						console.log(result.message);
					}
				}, function (response) {
					$scope.response = "Spaghetti";
					console.log(response);
				});
			}

			$scope.addhowmany = 0;
			for (var i=0; i<$scope.records.length; i++) {

				if (i==0) {
					$scope.addhowmany = 0;
					console.log("I am stupid");
				}
				else {
					if ($scope.records[i].title == $scope.records[i-1].title) {
						//if same title as record before, add num to next seat num
						$scope.addhowmany++;
					}
					else {
						//if title diff, set var back to 0
						$scope.addhowmany = 0;
					}
				}

				//first get ticket session
				var url = $scope.API_URL;
				var data = {
					api_key: $scope.API_KEY,
					app_secret: $scope.APP_SECRET,
					method: 'getSeatsAndOccupants',
					event_id: $routeParams.eventid,
					title: $scope.records[i].title
				};
				console.log(data);
				$http.post(url, data).then(function (response) {

					var result = response.data;

					if (result.success == "true" || result.success == true) {
						var cont = true;
						var j=0;
						while (cont && j<result.data.length) {
							if (result.data[j].seat_num != undefined && result.data[j].email == undefined) {
									// if ($scope.addhowmany > 0) {
										//if same ticket as before add 1 to seat num
										$scope.nextnum.push(1 * result.data[j].seat_num + $scope.addhowmany);
										console.log(1 * result.data[j].seat_num + $scope.addhowmany);
									// }
									// else {
									// 	//if email is undefined,seat is empty
									// 	//take seat number as next num
									// 	$scope.nextnum.push(result.data[j].seat_num);
									// 	console.log(result.data[j].seat_num);
									// }

									cont = false; //stop looping
							}
							else {
								j++;
							}
						}

					}
					else {
						$scope.response = "Unable to find session";
						console.log(result.message);
					}
				}, function (response) {
					$scope.response = "Spaghetti";
					console.log(response);
				});
			}
		}

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
				}
				else {
					$scope.event.name = "Invalid Event ID";
				}
			}, function (response) {
				console.log("Server error");
				console.log(response);
			});
		};
		$scope.getEvent();

		$scope.addSessionAttendee = function () {
			//get session for all ticket records

			for (var i=0; i<$scope.records.length; i++) {
			console.log($scope.sessions[i]);
				var url = $scope.API_URL;
				var data = {
					api_key: $scope.API_KEY,
					app_secret: $scope.APP_SECRET,
					method: 'addSessionAttendee',
					event_id: $routeParams.eventid,
					title: $scope.records[i].title,
					ticket_name: $scope.records[i].name,
					class: $scope.records[i].class,
					type: $scope.records[i].type,
					venue_id: $scope.event.venue_id,
					room_name: $scope.sessions[i].room_name,
					seat_num: $scope.nextnum[i],
					email: $scope.emails[i]
				};
				console.log(data);
				$http.post(url, data).then(function (response) {
					var result = response.data;
					if (result.success == "true" || result.success == true) {
						//reset values
						console.log("Session attendee added succesfully");
					}
					else {
						$scope.response = "Unable to add session attendee";
						console.log(result.message);
					}
				}, function (response) {
					$scope.response = "Spaghetti";
					console.log(response);
				});
			}
		}
	};

	app.controller('buyticketCtrl', Injectables.concat([buyticketController]));
})();
