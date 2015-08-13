angular.module('checkinService', [])
	.factory('Checkins', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('http://pdubs.gyges.feralhosting.com:8095/api/checkins');
			}
		}
	}]);