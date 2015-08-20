angular.module('instagramService', [])
    .factory('Instagram', ['$http',function($http) {
        return {
            getPhotos: function(callback) {
                var endPoint = "https://api.instagram.com/v1/users/self/media/recent?access_token=1357338078.a81c08a.f31d953f9a92465097e4d962284c5921&callback=JSON_CALLBACK";

                $http.jsonp(endPoint).success(function(response){
                    callback(response);
                });
            }
        }
    }]);