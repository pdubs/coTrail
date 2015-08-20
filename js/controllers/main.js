angular.module('checkinController', [])
	.controller('mainController', ['$scope','$http','Checkins','Traildata','Instagram','uiGmapGoogleMapApi','$interval', function($scope, $http, Checkins, Traildata, Instagram, uiGmapGoogleMapApi, $interval) {

		Traildata.get().then(function(trailData) {
			$scope.trailData = trailData.data;
			console.log("* TRAIL DATA LOADED");
			return Checkins.get();
		}).then(function(checkins){
			$scope.checkins = checkins.data;
			console.log("* CHECKIN DATA LOADED:");
			console.log($scope.checkins);
			return uiGmapGoogleMapApi;
		}).then(function(maps) {

			// init instagram photos
			Instagram.getPhotos(function success(photos){
				$scope.photos = photos.data;

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
							scaledSize: new google.maps.Size(40, 40),
							origin: new google.maps.Point(0,0),
							anchor: new google.maps.Point(20, 20)
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

				// init co trail polyline
				$scope.polylines = [{
	                id: 1,
	                path: $scope.trailData.features[0].geometry,
	                stroke: {
	                    color: '#6060FB',
	                    weight: 3
	                }
	            }];

				// init checkin markers
				$scope.checkinMarkers = [];
				var markers = [];
				for (var i = 0; i < $scope.checkins.length; i++) {
					markers.push(createCheckinMarker(i));
				}
				$scope.checkinMarkers = markers;



				console.log("* INSTAGRAM PHOTO DATA LOADED:");
				console.log($scope.photos);

				$scope.photoMarkers = [];

				var photomarker = {
					latitude: $scope.photos[0].location.latitude,
					longitude: $scope.photos[0].location.longitude,
					showWindow: false,
					note: $scope.photos[0].caption.text,
					id: 0,
					optimized: false,
					icon: {
						url: $scope.photos[0].images.thumbnail.url,
						scaledSize: new google.maps.Size(40, 40),
						origin: new google.maps.Point(0,0),
						anchor: new google.maps.Point(20, 20)
					},
					img: $scope.photos[0].images.standard_resolution.url
				};

				var photomarkers = [];
				photomarkers.push(photomarker);
				$scope.photoMarkers = photomarkers;


				// init google map
				$scope.map = {
					options: $scope.mapOptions,
					center: { latitude: $scope.checkins[$scope.checkins.length - 1].lat, longitude: $scope.checkins[$scope.checkins.length - 1].lon },
					zoom: 10,
					markersEvents: {
						click: function (marker, eventName, model, args) {
							model.showWindow = true;
							$scope.$apply();
						}
					}
				};

			});
		});
	}]);