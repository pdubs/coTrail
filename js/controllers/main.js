angular.module('checkinController', [])
	.controller('mainController', ['$scope','$http','Checkins','Traildata','uiGmapGoogleMapApi', function($scope, $http, Checkins, Traildata, uiGmapGoogleMapApi) {
		$scope.checkinData = {};
		$scope.loading = true;

		$scope.options = {
			scrollwheel: false
		}

		Checkins.get()
			.success(function(data) {
				$scope.checkins = data;
				$scope.loading = false;

				var createCheckinMarker = function(i, idKey) {
					if (idKey == null) {
						idKey = "id";
					}

					var latitude = $scope.checkins[i].lat;
					var longitude = $scope.checkins[i].lon;
					var title = 'checkin' + i;

					var returned = {
						latitude: latitude,
						longitude: longitude,
						title: title
					}
					returned[idKey] = i;
					return returned;
				}

			    uiGmapGoogleMapApi.then(function(maps) {
					Traildata.get()
						.success(function(trailData) {
							$scope.trailData = trailData;

							console.log($scope.trailData);

							$scope.map = { center: { latitude: $scope.checkins[0].lat, longitude: $scope.checkins[0].lon }, zoom: 8 };

							$scope.checkinMarkers = [];

							var markers = [];
							for (var i = 0; i < $scope.checkins.length; i++) {
								markers.push(createCheckinMarker(i));
							}

							$scope.checkinMarkers = markers;


						});
			    });
			});


	}]);