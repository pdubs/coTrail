angular.module('checkinController', [])
	.controller('mainController', ['$scope','$http','Checkins','Traildata','Instagram','uiGmapGoogleMapApi', function($scope, $http, Checkins, Traildata, Instagram, uiGmapGoogleMapApi) {

		Traildata.get().then(function(trailData) {
			$scope.trailData = trailData.data;
			console.log("* TRAIL DATA LOADED");
			return Checkins.get();
		}).then(function(checkins){
			$scope.checkins = checkins.data;
			console.log("* CHECKIN DATA LOADED:");
			console.log("latest marker: " + $scope.checkins[$scope.checkins.length - 1].text);
			return uiGmapGoogleMapApi;
		}).then(function(maps) {

			$scope.$watch('Checkins', function() {
				$scope.center = {
					lon : $scope.checkins[$scope.checkins.length - 1].lon,
					lat : $scope.checkins[$scope.checkins.length - 1].lat
				}
				initialize();
				$scope.map.isReady = true;
			});

			function initialize() {
				var createCheckinMarker = function(i) {
					var marker = {
						latitude: $scope.checkins[i].lat,
						longitude: $scope.checkins[i].lon,
						showWindow: false,
						note: $scope.checkins[i].text,
						id: i,
						optimized: false,
						icon: {
							url: "img/bike.png",
							scaledSize: new google.maps.Size(40, 40), // scaled size
							origin: new google.maps.Point(0,0), // origin
							anchor: new google.maps.Point(20, 20) // anchor
						}
					}
					return marker;
				}

				$scope.mapOptions = {
					panControl    : true,
					zoomControl   : true,
					scaleControl  : true,
					mapTypeControl: true,
					streetViewControl: false,
					mapTypeId     : google.maps.MapTypeId.TERRAIN
				};

				// init co trail line
				$scope.polylines = [{
                    id: 1,
                    path: $scope.trailData.features[0].geometry,
                    stroke: {
                        color: '#6060FB',
                        weight: 3
                    }
                }];

				// init check in markers
				$scope.checkinMarkers = [];
				var markers = [];
				for (var i = 0; i < $scope.checkins.length; i++) {
					markers.push(createCheckinMarker(i));
				}
				var newestMarker = markers[markers.length - 1];
				$scope.checkinMarkers = markers;

				// init instagram photos
				Instagram.getPhotos(function success(photos){
					$scope.photos = photos;
					console.log("* INSTAGRAM PHOTO DATA LOADED:");
					console.log($scope.photos);
				});

				// init google map
				$scope.map = {
					options: $scope.mapOptions,
					center: { latitude: $scope.center.lat, longitude: $scope.center.lon },
					zoom: 10,
					markersEvents: {
						click: function (marker, eventName, model, args) {
							model.showWindow = true;
							$scope.$apply();
						}
					},
					isReady: false
				};
			}

		});
	}]);