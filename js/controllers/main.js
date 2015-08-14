angular.module('checkinController', [])
	.controller('mainController', ['$scope','$http','Checkins','Traildata','uiGmapGoogleMapApi','uiGmapIsReady', function($scope, $http, Checkins, Traildata, uiGmapGoogleMapApi, uiGmapIsReady) {
		$scope.checkinData = {};
		$scope.loading = true;

		$scope.options = {
			scrollwheel: false
		}

		Checkins.get()
			.success(function(data) {
				$scope.checkins = data;


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

							$scope.polylines = [
							    {
							        id: 1,
							        path: $scope.trailData.features[0].geometry,
							        stroke: {
							            color: '#6060FB',
							            weight: 3
							        },
							        editable: false,
							        draggable: false,
							        geodesic: true,
							        visible: true
							    }
							];

							$scope.map = {
								center: { latitude: $scope.checkins[0].lat, longitude: $scope.checkins[0].lon },
								zoom: 8,
								options: $scope.MapOptions
							};

							$scope.checkinMarkers = [];

							var markers = [];
							for (var i = 0; i < $scope.checkins.length; i++) {
								markers.push(createCheckinMarker(i));
							}

							$scope.checkinMarkers = markers;

//							$scope.addMarkerClickFunction($scope.checkinMarkers);

							$scope.loading = false;


						});
			    });
			});

		$scope.windowOptions = {
		    show: true
		};
/*
		$scope.onClick = function (data) {
		    $scope.windowOptions.show = !$scope.windowOptions.show;
		    console.log('$scope.windowOptions.show: ', $scope.windowOptions.show);
		    console.log('This is a ' + data);
		};

		$scope.closeClick = function () {
		    $scope.windowOptions.show = false;
		};

		$scope.title = "Window Title!";

		$scope.addMarkerClickFunction = function (markersArray) {
		    angular.forEach(markersArray, function (value, key) {
		        value.onClick = function () {
		            $scope.onClick(value.data);
		            $scope.MapOptions.markers.selected = value;
		        };
		    });
		};
*/

		$scope.MapOptions = {
		    minZoom: 3,
		    zoomControl: false,
		    draggable: true,
		    navigationControl: false,
		    mapTypeControl: false,
		    scaleControl: false,
		    streetViewControl: false,
		    disableDoubleClickZoom: false,
		    keyboardShortcuts: true,
		    markers: {
		        selected: {}
		    },
		    styles: [{
		        featureType: "poi",
		        elementType: "labels",
		        stylers: [{
		            visibility: "off"
		        }]
		    }, {
		        featureType: "transit",
		        elementType: "all",
		        stylers: [{
		            visibility: "off"
		        }]
		    }],
		};

	}]);