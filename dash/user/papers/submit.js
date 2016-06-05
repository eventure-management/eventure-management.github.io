'use strict';

(function () {
	var app = angular.module('myApp');

	var Injectables = ['$scope', '$http'];
	var submitPaperController = function($scope, $http) {
		$scope.response = "";

		$scope.paper = {
			id: "",
			title: "",
			publish_date: "",
			latest_submit_date: "",
			paper_data_url: null
		};

		//function on press
		$scope.submit = function() {
			$scope.paper.latest_submit_date = toDateString(new Date());

			var url = $scope.API_URL;

			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'createPaper',
				title: $scope.paper.title,
				publish_date: $scope.paper.publish_date,
				paper_data_url: $scope.paper.paper_data_url,
				latest_submit_date: $scope.paper.latest_submit_date
			};

			$scope.response = "Submitting...";

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == "true") {
					//output success
					console.log("success");

					$scope.paper.id = result.data.id;
					$scope.response = "Submitted";

					addAuthor();
				}
				else {
					//output fail
					console.log("failure");
					console.log(result);
				}
			})
			.then(function (response) {
				//something bad happened
				console.log("oh fuck sandon fucked up real fucking hard");
			});
		};

		function addAuthor() {
			var url = $scope.API_URL;
			var data = {
				api_key: $scope.API_KEY,
				app_secret: $scope.APP_SECRET,
				method: 'addPaperAuthor',
				email: $scope.user.email,
				paper_id: $scope.paper.id
			};

			$http.post(url, data).then(function (response) {
				var result = response.data;
				if (result.success == true) {
					//output success
					console.log("Added Author to Paper");
				}
				else {
					//output fail
					console.log("Failed to add Author to Paper");
				}
			})
			.then(function (response) {
				//something bad happened
				console.log("critical fail, take 1d4 damage as you fumble the axe in your hand dropping it on your toe");
				console.log(response);
			});
		}

		function toDateString(dateObj) {
			dateObj = dateObj.toISOString();
			return dateObj.substr(0, 10) + " " + dateObj.substr(11, 8);
		}
	};

	app.controller('submitPaperCtrl', Injectables.concat([submitPaperController]));
	app.directive("fileread", [function () {
	    return {
	        scope: {
	            fileread: "="
	        },
	        link: function (scope, element, attributes) {
	            element.bind("change", function (changeEvent) {
					scope.response = "Uploading...";
	                var reader = new FileReader();
	                reader.onload = function (loadEvent) {
	                    scope.$apply(function () {
	                        scope.fileread = loadEvent.target.result;
							scope.response = "Uploaded";
	                    });
	                }
	                reader.readAsDataURL(changeEvent.target.files[0]);
	            });
	        }
	    }
	}]);
})();
