'use strict';

(function () {
	var app = angular.module('myApp');

	var sCInjectables = ['$scope', '$http', '$location'];
    var signupController = function ($scope, $http, $location) {
		$scope.userdata = {
			email: "",
			username: "",
			password: "",
			confirmpass: ""
		};
		$scope.response = null;
		$scope.signupresp = [];

		$scope.signup = function() {
			var url = $scope.API_URL;

			if ($scope.userdata.password != $scope.userdata.confirmpass) {
				$scope.signupresp = [];
				$scope.signupresp.push("Password and confirm password not match.");
			}
			else {

				var data = {
					api_key: $scope.API_KEY,
					app_secret: $scope.APP_SECRET,
					method: 'createUser',
					email: $scope.userdata.email,
					username: $scope.userdata.username,
					password: sha256($scope.userdata.password)
		        };
				console.log(data);
		        $http.post(url, data).then(function (response) {
					var result = response.data;
					if (result.success == "true") {
						console.log("success");
						//tell the user it was successful
						$scope.response = "User successfully created";

						//redirect back to home page
						$location.path('/login');

						//reset all the fields
						angular.forEach($scope.userdata, function(value, key) {
							$scope.userdata.key = "";
						});
						$scope.response = null;
					}
					else {
						console.log("Sign up failure");
						$scope.response = JSON.stringify(response);
						$scope.signupresp = [];
						if ($scope.userdata.email == "") {
							$scope.signupresp.push("Please fill in email field.");
						}
						if ($scope.userdata.username == "") {
							$scope.signupresp.push("Please fill in user name field.");
						}
						if ($scope.userdata.password == "") {
							$scope.signupresp.push("Please fill in password field.");
						}
						if ($scope.userdata.confirmpass == "") {
							$scope.signupresp.push("Please fill in confirm password field.");
						}
						// $scope.response = result.message;
					}
		        }, function (response) {
					$scope.response = JSON.stringify(response);
				});
			}
		}
	};

	app.controller('SignupCtrl', sCInjectables.concat([signupController]));
})();
