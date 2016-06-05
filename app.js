'use strict';

(function () {
	// Declare app level module which depends on views, and components
	var app = angular.module('myApp', [
		'ngRoute'
	]);

	app.config([
		'$compileProvider',
		function ($compileProvider) {
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/);
			// Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
		}
	]);

	var gCInjectables = ['$scope', '$http', '$location', '$routeParams'];
	var globalController = function ($scope, $http, $location, $routeParams) {
		$scope.API_URL = "https://6f7a5a2d.ngrok.io/api/v1";
		$scope.API_KEY = "AHWQQPOAEkUoMjMPGep4za0PVaIOFyKt";
		$scope.APP_SECRET = "KsBg70irVEho4FojGBHa301mlsKut0lD";
		$scope.NOTIFICATION_USER_EMAIL = "notificationagent";

		$scope.dashboard = false;
		$scope.user = null;
		if ($scope.user == null) {
			var storedUser = JSON.parse(localStorage.getItem("user"));
			if (storedUser !== null)
				$scope.user = storedUser;
		}
		//used when in dashboard playing around with events
		$scope.currentEvent = null;
		$scope.storeCurrentEvent = function(event) {
			$scope.currentEvent = event;
		}
		//used when in dashboard playing around with papers
		$scope.currentPaper = {};

		//in signin.html
		$scope.login = {
			email: "",
			password: ""
		};
		$scope.response = "";

		$scope.login = function () {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'login',
				email: $scope.login.email,
				password: sha256($scope.login.password),
			};
			console.log(data);
			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					getUser();
				}
				else {
					$scope.response = JSON.stringify(result);
				}
			});
		}

		function getUser() {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getUser',
				email: $scope.login.email
			};
			$http.post(url,data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					result = result.data[0];
					$scope.response = "Logged In";

					$scope.user = result;

					$location.path('/');

					$scope.login.email = "";
					$scope.login.password = "";
					$scope.response = "";

					//store in local storage
					localStorage.setItem("user", JSON.stringify($scope.user));
				}
				else {
					$scope.response = JSON.stringify(result);
				}
			});
		}
		//end

		//logging out
		$scope.logout = function () {
			console.log("logout");
			$scope.user = null;
			localStorage.removeItem("user");
		}
		//end

		//updating dashboard boolean
		$scope.$on('$routeChangeSuccess', function(next, current) {
			var curr = $location.path();
			if (curr.indexOf('/dash') == 0) {
				if (curr.indexOf('/dash/event') == 0) {
					if (curr.indexOf('/dash/event/create') == 0) {
						$scope.dashboard = 'user';
					}
					else {
						$scope.dashboard = 'event';
						$scope.event_id = $routeParams.eventid;
					}
				}
				else
					$scope.dashboard = 'user';
			}
			else
				$scope.dashboard = 'false';
		});
		//end
    }

	app.controller('GlobalController', gCInjectables.concat([globalController]));

	app.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'main/main.html',
			controller: 'MainCtrl'
		})
		.when('/signup', {
			templateUrl: 'signup/signup.html',
			controller: 'SignupCtrl'
		})
		.when('/login', {
			templateUrl: 'signin/signin.html'
		})
		.when('/search', {
			templateUrl: 'search/search.html',
			controller: 'SearchCtrl'
		})

		.when('/dash', {
			templateUrl: 'dash/dash.html',
			controller: 'DashCtrl'
		})
		.when('/dash/edit/details', {
			templateUrl: 'dash/user/edit/details.html',
			controller: 'EditCtrl'
		})
		.when('/dash/edit/password', {
			templateUrl: 'dash/user/edit/password.html',
			controller: 'EditCtrl'
		})
		.when('/dash/edit/expertise', {
			templateUrl: 'dash/user/edit/expertise.html',
			controller: 'EditCtrl'
		})
		.when('/dash/upgrade', {
			templateUrl: 'dash/user/upgrade.html',
			controller: 'upgradeCtrl'
		})
		.when('/dash/papers', {
			templateUrl: 'dash/user/papers.html',
			controller: 'userPapersCtrl'
		})
		.when('/dash/papers/add', {
			templateUrl: 'dash/user/papers/submit.html',
			controller: 'submitPaperCtrl'
		})
		.when('/dash/papers/:paperid/manage', {
			templateUrl: 'dash/user/papers/manage.html',
			controller: 'userManagePaperCtrl'
		})
		.when('/dash/myevents/manage', {
			templateUrl: 'dash/user/managing.html',
			controller: 'eventsManagedCtrl'
		})
		.when('/dash/myevents/attending', {
			templateUrl: 'dash/user/attending.html',
			controller: 'eventsManagedCtrl'
		})
		.when('/dash/event/:eventid/attlist', {
			templateUrl: 'dash/user/attlist.html',
			controller: 'attendeesCtrl'
		})
		.when('/dash/event/create', {
			templateUrl: 'dash/event/create.html',
			controller: 'createEventCtrl'
		})
		.when('/dash/event/:eventid/', {
			templateUrl: 'dash/event/eventdash.html',
			controller: 'eventDashCtrl'
		})
		.when('/dash/event/:eventid/details', {
			templateUrl: 'dash/event/details.html',
			controller: 'eventDashCtrl'
		})
		.when('/dash/event/:eventid/poster', {
			templateUrl: 'dash/event/poster.html',
			controller: 'eventDashCtrl'
		})
		.when('/dash/event/:eventid/tags', {
			templateUrl: 'dash/event/tags.html',
			controller: 'eventDashCtrl'
		})
		.when('/dash/event/:eventid/billingInfo', {
			templateUrl: 'dash/event/billinginfo.html',
			controller: 'eventDashCtrl'
		})
		.when('/dash/event/:eventid/papers', {
			templateUrl: 'dash/event/papers.html',
			controller: 'managePapersCtrl'
		})
		.when('/dash/event/:eventid/papers/:paperid', {
			templateUrl: 'dash/event/paper.html',
			controller: 'paperDetailCtrl'
		})
		.when('/dash/event/:eventid/reviewers', {
			templateUrl: 'dash/event/reviewers.html',
			controller: 'manageReviewersCtrl'
		})
		.when('/dash/event/:eventid/sessions', {
			templateUrl: 'dash/event/sessions.html',
			controller: 'eventDashCtrl'
		})
		.when('/dash/event/:eventid/tickets', {
			templateUrl: 'dash/event/tickets.html',
			controller: 'eventDashCtrl'
		})
		.when('/dash/event/:eventid/rooms', {
			templateUrl: 'dash/event/venues.html',
			controller: 'eventDashCtrl'
		})
		.when('/dash/event/:eventid/birdseye', {
			templateUrl: 'dash/event/birdseye.html',
			controller: 'eventDashCtrl'
		})

		.when('/event/:eventid', {
			templateUrl: 'event/eventpage.html',
			controller: 'eventpageCtrl'
		})
		.when('/event/:eventid/buyticket',{
			templateUrl: 'event/buyticket.html',
			controller: 'buyticketCtrl'
		})
		.when('/event/:eventid/attendee',{
			templateUrl: 'event/attendeeinfo.html',
			controller: 'eventpageCtrl'
		})
		.when('/event/:eventid/purchase',{
			templateUrl: 'event/purchase.html',
			controller: 'eventpageCtrl'
		})
		.when('/review/:paperid/:eventid/:conversationid', {
			templateUrl: 'review/paper.html',
			controller: 'paperReviewCtrl'
		})

		.when('/notauthorised', {
			templateUrl: 'notauthorised.html'
		})
		.when('/fourohfour', {
			templateUrl: 'fourohfour.html'
		})
		.otherwise({ redirectTo: '/fourohfour' });

	}]);

})();
