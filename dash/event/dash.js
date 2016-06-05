'use strict';

(function () {
	var app = angular.module('myApp');

	var Injectables = ['$scope', '$http', '$routeParams', '$location'];
    var eventDashController = function ($scope, $http, $routeParams, $location) {
		//global
		$scope.eventid = $routeParams.eventid;
		$scope.currentEvent = {};
		$scope.temp = "";

		$scope.getEvent = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getEvent',
				event_id: $scope.eventid
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("getEvent success");

					//update the local event with values
					$scope.storeCurrentEvent(result.data[0]);
					$scope.details = $scope.currentEvent;
				}
				else {
					console.log("getEvent failure " + result.message);
					$scope.response = result.message;
				}
			}, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}
		if ($scope.currentEvent == null || $scope.currentEvent.event_id == undefined || $scope.currentEvent.event_id != $routeParams.eventid) {
			$scope.currentEvent = undefined;
			$scope.getEvent();
		}

		//dash

		//details

		$scope.updateEvent = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'updateEvent',
				event_id: $scope.eventid,
				name: $scope.details.name,
				from_date: $scope.details.from_date,
				to_date: $scope.details.to_date,
				description: $scope.details.descritpion,
			};

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("updateEvent success");

					//update the local sessions with values
					$scope.currentEvent = $scope.details;
				}
				else {
					console.log("updateEvent failure " + result.message);
					$scope.response = result.message;
				}
			}, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}

		//tickets
		$scope.newTicket = {
			title: "", //session
			name: "",
			class: "",
			type: "",
			price: "",
			description: "",
			start_date: "",
			end_date: "",
			quantity: ""
		};
		$scope.tickets = [];

		$scope.getTickets = function() {
			//get session with tickets
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getEventTickets',
				event_id: $scope.eventid
			}
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					$scope.tickets = [];
					for (var i=0; i<result.data.length; i++) {
						if (result.data[i].tickets.length>0) {
							for (var j=0; j<result.data[i].tickets.length; j++)
								$scope.tickets.push(result.data[i].tickets[j]);
						}
					}
				}
				else {
					console.log(result.message);
				}
			}, function (response) {
				$scope.response = "Spaghetti";
				console.log(response);
			});
		}
		$scope.getTickets();

		$scope.createTicket = function() {
			$scope.createTicketRecords($scope.newTicket.quantity, $scope.newTicket.title,
				$scope.newTicket.name, $scope.newTicket.class, $scope.newTicket.type);

			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'createTicket',
				event_id: $scope.currentEvent.event_id,
				title: $scope.newTicket.title,
				name: $scope.newTicket.name,
				class: $scope.newTicket.class,
				type: $scope.newTicket.type,
				price: $scope.newTicket.price,
				description: $scope.newTicket.description,
				start_date: $scope.newTicket.start_time,
				end_date: $scope.newTicket.end_time,
				quantity: $scope.newTicket.quantity
			};
			console.log(data);
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					//reset values
					$scope.newTicket = {
						title: "", //session
						name: "",
						class: "",
						type: "",
						price: "",
						description: "",
						start_date: "",
						end_date: "",
						quantity: ""
					};
					$scope.response = "Ticket created succesfully";
					$scope.getTickets();
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

		// createTicketRecord should be done when creating ticket
		$scope.createTicketRecords = function(capacity, title, name, ticclass, type) {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getSession',
				event_id: $scope.eventid,
				title: title
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("getEvent success");
					//update the local event with values
					$scope.session = result.data[0];

					$scope.seat_nums = "";
					for (var i=1; i<=capacity; i++) {
						if (i<capacity) {
							$scope.seat_nums += i+",";
						}
						else {
							$scope.seat_nums += i;
						}
					}

					var url = $scope.API_URL;
					var data = {
						api_key: $scope.API_KEY,
						app_secret: $scope.APP_SECRET,
						method: 'createTicketRecords',
						event_id: $scope.event_id,
						title: title,
						ticket_name: name,
						class: ticclass,
						type: type,
						venue_id: $scope.session.venue_id,
						room_name: $scope.session.room_name,
						seat_nums: $scope.seat_nums
					};
					console.log(data);
					$http.post(url, data).then(function (response) {
						var result = response.data;
						if (result.success == "true" || result.success == true) {
							//reset values
							$scope.response = "Ticket record added succesfully";
						}
						else {
							$scope.response = "Unable to create ticket record"
							console.log(result.message);
						}
					}, function (response) {
						$scope.response = "Spaghetti";
						console.log(response);
					});

				}
			}, function (response) {
				$scope.response = "Spaghetti";
				console.log(response);
			});
		}

		$scope.editTicket = function() {

		}

		$scope.removeTicket = function(title,name,className,type) {

			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'deleteTicket',
				event_id: $scope.eventid,
				title: title,
				name: name,
				class: className,
				type: type
			};
			console.log(data);
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					$scope.response = "Ticket deleted succesfully";
					for (var i=0; i<$scope.tickets.length; i++) {
						if ($scope.tickets[i].title == title && $scope.tickets[i].name == name && $scope.tickets[i].class == className && $scope.tickets[i].type == type) {
							$scope.tickets.splice(i, 1);
							break;
						}
					}
				}
				else {
					$scope.response = result.message;
					console.log(result.message);
				}
			}, function (response) {
				console.log(response);
			});
		}

		//sessions
		$scope.newSession = {
			is_event: "",
			title: "",
			start_time: "",
			end_time: "",
			room_name: ""
		};
		$scope.sessions = [];

		$scope.getSessions = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getSessions',
				event_id: $scope.eventid
			};

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("getSessions success");

					//update the local sessions with values
					$scope.sessions = [];
					for (var i=0; i<result.data.length; i++)
						$scope.sessions.push(result.data[i]);
				}
				else {
					console.log("getSessions failure " + result.message);
					$scope.response = result.message;
				}
			}, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}
		if ($scope.sessions.length == 0)
			$scope.getSessions();

		$scope.addSession = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'createSession',
				event_id: $scope.eventid,
				is_event: $scope.newSession.is_event,
				title: $scope.newSession.title,
				start_time: $scope.newSession.start_time,
				end_time: $scope.newSession.end_time,
				venue_id: $scope.currentEvent.venue_id,
				room_name: $scope.newSession.room_name
			};

			console.log(data);

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("addSession success");

					//update the local sessions with values
					$scope.newSession.title = "";
					$scope.newSession.start_time = "";
					$scope.newSession.end_time = "";
					$scope.newSession.room_name = "";
					$scope.getSessions();
				}
				else {
					console.log("addSession failure " + result.message);
					$scope.response = result.message;
				}
			}, function (response) {
				console.log(response);
			});
		}

		$scope.deleteSession = function(title) {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'deleteSession',
				event_id: $scope.eventid,
				title: title
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					$scope.response = "session deleted successfully";
					for (var i=0; i<$scope.sessions.length; i++) {
						if ($scope.sessions[i].title == title) {
							$scope.sessions.splice(i, 1);
							break;
						}
					}
				}
				else {
					$scope.response = result.message;
					console.log(result.message);
				}
			}, function (response) {
				console.log(response);
			});
		}
		//venues
		$scope.eventid = $routeParams.eventid;
  		$scope.currentEvent = {};
		$scope.rooms = [];

		$scope.getRooms = function() {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getEvent',
				event_id: $scope.eventid
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("getEvent success");
					//update the local event with values
					$scope.currentEvent = result.data[0];
          			console.log($scope.currentEvent);
					var url = $scope.API_URL;
			        var data = {
			          api_key: $scope.API_KEY,
			          app_secret: $scope.APP_SECRET,
			          method: 'getRooms',
			          venue_id: $scope.currentEvent.venue_id
			        };
			        $http.post(url, data).then(function (response) {
			          var result = response.data;
			          if (result.success == "true") {
			            console.log("getRooms success");

			            //update the local sessions with values
			            $scope.rooms = [];
			            for (var i=0; i<result.data.length; i++)
			              $scope.rooms.push(result.data[i]);
			          }
			          else {
			            console.log("getRooms failure " + result.message);
			            $scope.response = result.message;
			          }
			        }, function (response) {
			          $scope.response = JSON.stringify(response);
			        });
				}
				else {
					console.log("getEvent failure " + result.message);
					$scope.response = result.message;
				}
			}, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}
		$scope.getRooms();
		$scope.newRoom = {
			name: "",
			type: "",
			capacity: ""
		};
		$scope.rooms = [];

		$scope.addRoom = function() {
		  var url = $scope.API_URL;
		  var data = {
		    api_key: $scope.API_KEY,
		    app_secret: $scope.APP_SECRET,
		    method: 'createRoom',
		    venue_id: $scope.currentEvent.venue_id,
		    name: $scope.newRoom.name,
		    type: $scope.newRoom.type,
		    capacity: $scope.newRoom.capacity
		  };
		  $http.post(url, data).then(function (response) {
		    var result = response.data;
		    if (result.success == "true" || result.success == true) {

				$scope.createSeats($scope.newRoom.name, $scope.newRoom.capacity);

				$scope.response = "Room Added";
			  	$scope.newRoom.name = "";
				$scope.newRoom.type = "";
				$scope.newRoom.capacity = "";
				$scope.getRooms();

		    }
		    else {
		      $scope.response = "Room could not be added";
		      console.log(result.message);
		    }
		  }, function (response) {
		    $scope.response = "Room could not be added";
		    console.log(response);
		  });
		}

		$scope.createSeats = function(room_name, capacity) {
			// create seats with room capacity
			$scope.seat_nums = "";

			for (var i=1; i<=capacity; i++) {
				if (i<capacity) {
					$scope.seat_nums += i+",";
				}
				else {
					$scope.seat_nums += i;
				}
			}

			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'createSeats',
				venue_id: $scope.currentEvent.venue_id,
				name: room_name,
				seat_nums: $scope.seat_nums
			};
			$http.post(url, data).then(function (response) {
			var result = response.data;
			if (result.success == "true" || result.success == true) {

				console.log("Seats Added");
			}
			else {
			  $scope.response = "Seats could not be added";
			  console.log(result.message);
			}
			}, function (response) {
				$scope.response = "Seats could not be added";
				console.log(response);
			});
		}

		$scope.editRoom = function() {
		  $scope.response = "This is stretch funcionality";
		}

		$scope.deleteRoom = function(name) {
	    	var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
		        app_secret: $scope.APP_SECRET,
		        method: 'deleteRoom',
				venue_id: $scope.currentEvent.venue_id,
        		room_name: name
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					$scope.response = "Room deleted";
					var index = $scope.rooms.indexOf(name);
					if (index > -1) {
						$scope.rooms.splice(index, 1);
					}
					$scope.name = "";
					$scope.type = "";
					$scope.capacity = "";
					$scope.getRooms();
				}
				else {
					$scope.response = result.message;
					console.log(result.message);
				}
			}, function (response) {
				console.log(response);
			});
	    }

		$scope.getVenue = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getVenue',
				event_id: $scope.currentEvent.venue_id
			};

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("getSessions success");

					$scope.venue = result.data[0];
				}
				else {
					console.log("getVenue failure " + result.message);
					$scope.response = result.message;
				}
			}, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}


		//tags
		$scope.tag = {
			selected: ""
		}
		$scope.tags = [];
		$scope.addTags = function() {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'addEventTag',
				event_id: $routeParams.eventid,
				tag_names: $scope.tag.selected
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					$scope.response = "Tag Added";
					$scope.tags.push($scope.tag.selected);
				}
				else {
					$scope.response = result.message;
					console.log(result.message);
				}
			}, function (response) {
				console.log(response);
			});
		}
		$scope.removeTags = function(tag) {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'deleteEventTag',
				event_id: $routeParams.eventid,
				tag_names: tag
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					$scope.response = "Tag deleted";
					var index = $scope.tags.indexOf(tag);
					if (index > -1) {
						$scope.tags.splice(index, 1);
					}
				}
				else {
					$scope.response = result.message;
					console.log(result.message);
				}
			}, function (response) {
				console.log(response);
			});
		}
		$scope.getTags = function() {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getEventTags',
				event_id: $routeParams.eventid
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					$scope.response = "Tags received";
				}
				else {
					$scope.response = result.message;
					console.log(result.message);
				}
			}, function (response) {
				console.log(response);
			});
		}
		if ($location.path().substr(-4) == "tags") {
			$scope.getTags();
		}

		//poster
		$scope.poster = {
			url: ""
		};
		$scope.uploadPoster = function() {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'uploadPoster',
				event_id: $routeParams.eventid,
				poster_data_url: $scope.poster.url
			};
			$scope.posterresponse = "Poster Uploading...";
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true" || result.success == true) {
					console.log("upload success")
					$scope.posterresponse = "Poster Uploaded";
				}
				else {
					$scope.posterresponse = result.message;
					console.log(result.message);
				}
			}, function (response) {
				console.log(response);
			});
		}

		$scope.payee = {
			email: ""
		};
		$scope.birdseye = {
			url: ""
		};
		$scope.uploadBirdsEye = function() {
			var url = $scope.API_URL;

  			var data = {
  				api_key: $scope.API_KEY,
  				app_secret: $scope.APP_SECRET,
  				method: 'getEvent',
  				event_id: $scope.eventid
  			};
  			$http.post(url, data).then(function (response) {
  				var result = response.data;
  				if (result.success == "true") {
  					console.log("getEvent success");

  					//update the local event with values
  					$scope.currentEvent = result.data[0];

					var url = $scope.API_URL;
					var data = {
						api_key: $scope.API_KEY,
						app_secret: $scope.APP_SECRET,
						method: 'addVenueMap',
						venue_id: $scope.currentEvent.venue_id,
						image_data_url: $scope.birdseye.url
					};
					$scope.response = "Venue Map Uploading...";
					$http.post(url, data).then(function (response) {
						var result = response.data;
						if (result.success == "true" || result.success == true) {
							$scope.response = "Venue Map Uploaded";
						}
						else {
							$scope.response = result.message;
							console.log(result.message);
						}
					}, function (response) {
						console.log(response);
					});
				}
				else {
					console.log("getEvent failure " + result.message);
					$scope.response = result.message;
				}
			}, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}

		$scope.birdseye_url = "";
		$scope.getBirdsEye = function() {
			var url = $scope.API_URL;

  			var data = {
  				api_key: $scope.API_KEY,
  				app_secret: $scope.APP_SECRET,
  				method: 'getEvent',
  				event_id: $scope.eventid
  			};
  			$http.post(url, data).then(function (response) {
  				var result = response.data;
  				if (result.success == "true") {
  					console.log("getEvent success");

  					//update the local event with values
  					$scope.currentEvent = result.data[0];

					var url = $scope.API_URL;
					var data = {
						api_key: $scope.API_KEY,
						app_secret: $scope.APP_SECRET,
						method: 'getVenueMap',
						venue_id: $scope.currentEvent.venue_id
					};

					$http.post(url, data).then(function (response) {
						console.log("here");
						var result = response.data;
						if (result.success == "true" || result.success == true) {
							$scope.birdseye_url = result.data.image_data_url;
						}
						else {
							$scope.response = result.message;
							console.log(result.message);
						}
					}, function (response) {
						console.log(response);
					});
				}
				else {
					console.log("getEvent failure " + result.message);
					$scope.response = result.message;
				}
			}, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}

		$scope.eventid = $routeParams.eventid;
  		$scope.currentEvent = {};
		$scope.rooms = [];

		$scope.updateBilling = function() {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'updateEvent',
				payee: $scope.payee.email
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("Success billing");
					$scope.response = "Payee succesfully updated";
				}
				else {
					console.log(result.message);
					$scope.response = result.message;
				}
			}, function (response) {
				console.log(response);
			});
		}


		$scope.birdseye = {
			url: ""
		};
		$scope.uploadBirdsEye = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getEvent',
				event_id: $scope.eventid
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("getEvent success");

					//update the local event with values
					$scope.currentEvent = result.data[0];

					var url = $scope.API_URL;
					var data = {
						api_key: $scope.API_KEY,
						app_secret: $scope.APP_SECRET,
						method: 'addVenueMap',
						venue_id: $scope.currentEvent.venue_id,
						image_data_url: $scope.birdseye.url
					};
					$scope.response = "Venue Map Uploading...";
					$http.post(url, data).then(function (response) {
						var result = response.data;
						if (result.success == "true" || result.success == true) {
							$scope.response = "Venue Map Uploaded";
						}
						else {
							$scope.response = result.message;
							console.log(result.message);
						}
					}, function (response) {
						console.log(response);
					});
				}
				else {
					console.log("getEvent failure " + result.message);
					$scope.response = result.message;
				}
			}, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}

		$scope.birdseye_url = "";
		$scope.getBirdsEye = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getEvent',
				event_id: $scope.eventid
			};
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("getEvent success");

					//update the local event with values
					$scope.currentEvent = result.data[0];

					var url = $scope.API_URL;
					var data = {
						api_key: $scope.API_KEY,
						app_secret: $scope.APP_SECRET,
						method: 'getVenueMap',
						venue_id: $scope.currentEvent.venue_id
					};

					$http.post(url, data).then(function (response) {
						console.log("here");
						var result = response.data;
						if (result.success == "true" || result.success == true) {
							$scope.birdseye_url = result.data.image_data_url;
						}
						else {
							$scope.response = result.message;
							console.log(result.message);
						}
					}, function (response) {
						console.log(response);
					});
				}
				else {
					console.log("getEvent failure " + result.message);
					$scope.response = result.message;
				}
			}, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}
	};

	app.controller('eventDashCtrl', Injectables.concat([eventDashController]));
})();
