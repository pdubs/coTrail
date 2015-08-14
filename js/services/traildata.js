angular.module('traildataService', [])
	.factory('Traildata', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('http://45.55.14.136:8000/location/cotrail');
			}
		}
	}]);