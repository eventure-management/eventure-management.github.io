'use strict';

(function () {
	var app = angular.module('myApp');

	var Injectables = ['$scope', '$http', '$location'];
    var editController = function ($scope, $http, $location) {
		setTimeout(function(){
			Materialize.updateTextFields();
		}, 250);

		$scope.tempuser = $scope.user;
		$scope.response = null;

		$scope.update = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'updateUser',
				email: $scope.user.email,
				title: $scope.tempuser.title,
				first_name: $scope.tempuser.first,
				last_name: $scope.tempuser.last,
				dob: $scope.tempuser.dob,
				address: $scope.tempuser.address,
				city: $scope.tempuser.city,
				state: $scope.tempuser.state,
				country: $scope.tempuser.country
	        };
			console.log(data);
	        $http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("success");
					//tell the user it was successful
					$scope.response = "Settings succesfully updated";

					//update the local user with updated values
					$scope.user = $scope.tempuser;
				}
				else {
					console.log("failure");
					$scope.response = result.message;
				}
	        }, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}

		$scope.delete = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'updateUser',
				email: $scope.user.email,
				active: "false"
			};

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("Succeeded to delete user");
					$scope.user = null;
					$location.path('/');
				}
				else {
					console.log("Failed to delete user");
					$scope.response = result.message;
				}
			}, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}

		$scope.passwords = {
			old: "",
			new: ""
		};
		$scope.changePassword = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'changePassword',
				email: $scope.user.email,
				old_password: sha256($scope.passwords.old),
				new_password: sha25($scope.passwords.new)
			};

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("password updated successfully");
					$scope.response = "Password succesfully updated";
				}
				else {
					console.log(result.message);
					$scope.response = result.message;
				}
			}, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}

		$scope.expertise = {
			name: ""
		};
		$scope.tags = [];
		$scope.addExpertise = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'addUserTag',
				email: $scope.user.email,
				tag_names: $scope.expertise.name
			};

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("tags added successfully");
					$scope.response = "Tags added updated";
					$scope.tags.push($scope.expertise.name);
				}
				else {
					console.log(result.message);
					$scope.response = result.message;
				}
			}, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}
		$scope.removeExpertise = function(expertise) {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'deleteUserTag',
				email: $scope.user.email,
				tag_names: expertise
			};

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("tag removed succesfully successfully");
					var index = $scope.tags.indexOf(expertise);
					if (index > -1)
						$scope.tags.splice(index, 1);
				}
				else {
					console.log(result.message);
					$scope.response = result.message;
				}
			}, function (response) {
				$scope.response = JSON.stringify(response);
			});
		}

		$scope.getExpertise = function() {
			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'getUserTags',
				email: $scope.user.email
			};

			$http.post(url, data).then(function(response) {
				var result = response.data;
				if (result.success == "true") {
					console.log("tags received succesfully");
					for (var i=0; i<result.data.length; i++)
						$scope.tags.push(result.data[i]);
				}
				else {
					console.log(result.message);
					$scope.response = result.message;
				}
			}, function(response) {
				$scope.response = JSON.stringify(response);
			});
		};
		if ($location.path() == "/dash/edit/expertise") {
			$scope.getExpertise();
		}
	};

	app.controller('EditCtrl', Injectables.concat([editController]));
})();
