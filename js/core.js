var myApp = angular.module('checkIn', ['checkinController', 'checkinService', 'uiGmapgoogle-maps'])
	.config(function(uiGmapGoogleMapApiProvider) {
	    uiGmapGoogleMapApiProvider.configure({
	        key: 'AIzaSyCfDQydL7AKQfYjrYBkAIV_jj_XH15YqdU',
	        v: '3.17',
	        libraries: 'weather,geometry,visualization'
	    });
	});