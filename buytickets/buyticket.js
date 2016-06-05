'use strict';

angular.module('myApp.buytickets', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/buytickets/1', {
    templateUrl: 'buytickets/buyticket1.html',
    controller: 'Buyticket1Ctrl'
  })
  .when('/buytickets/2', {
    templateUrl: 'buytickets/buyticket2.html',
    controller: 'Buyticket2Ctrl'
  })
  .when('/buytickets/3', {
    templateUrl: 'buytickets/buyticket3.html',
    controller: 'Buyticket3Ctrl'
  })
  .when('/buytickets/4', {
    templateUrl: 'buytickets/buyticket4.html',
    controller: 'Buyticket4Ctrl'
  })
  ;
}])

.controller('Buyticket1Ctrl', [function() {

}])
.controller('Buyticket2Ctrl', [function() {

}])
.controller('Buyticket3Ctrl', [function() {

}])
.controller('Buyticket4Ctrl', [function() {

}]);
