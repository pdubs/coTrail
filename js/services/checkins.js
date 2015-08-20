angular.module('checkinService', [])
	.factory('Checkins', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('http://45.55.14.136:8095/api/checkins');
			}
		}
	}]);