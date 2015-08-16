angular.module('checkinController', [])
	.controller('mainController', ['$scope','$http','Checkins','Traildata','uiGmapGoogleMapApi','$q', function($scope, $http, Checkins, Traildata, uiGmapGoogleMapApi, $q) {
		$scope.loading = true;

		// chained promises: google maps UI > trail data > checkin data
		uiGmapGoogleMapApi.then(function(maps) {
			return Traildata.get();
		}).then(function(trailData) {
			$scope.trailData = trailData.data;
			return Checkins.get();
		}).then(function(checkins) {
			$scope.checkins = checkins.data;

			var createCheckinMarker = function(i) {
				var marker = {
					latitude: $scope.checkins[i].lat,
					longitude: $scope.checkins[i].lon,
					showWindow: false,
					note: $scope.checkins[i].text,
					id: i,
					optimized: false,
					options: {
						labelContent: ' ',
						labelAnchor: "-15 -15",
						labelClass: "marker-labels"
					},
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

			// init coTrail line
			$scope.polylines = [{
				id: 1,
				path: $scope.trailData.features[0].geometry,
				stroke: {
					color: '#6060FB',
					weight: 3
				}
			}];

			// init checkinMarkers
			$scope.checkinMarkers = [];
			var markers = [];
			for (var i = 0; i < $scope.checkins.length; i++) {
				markers.push(createCheckinMarker(i));
			}
			var newestMarker = markers[markers.length - 1];
			$scope.checkinMarkers = markers;

			// init map
			$scope.map = {
				options: $scope.mapOptions,
				center: { latitude: newestMarker.latitude, longitude: newestMarker.longitude },
				zoom: 10,
				markersEvents: {
					click: function (marker, eventName, model, args) {
						model.options.labelContent = "lat: " + model.latitude + " lon: " + model.longitude;
						model.showWindow = true;
						$scope.$apply();
					},
					mouseover: function (marker, eventName, model, args) {
						model.options.labelContent = "lat: " + model.latitude + " lon: " + model.longitude;
						$scope.$apply();
					},
					mouseout: function (marker, eventName, model, args) {
						model.options.labelContent = " ";
						$scope.$apply();
					}
				}
			};

			$scope.loading = false;
		});
	}]);