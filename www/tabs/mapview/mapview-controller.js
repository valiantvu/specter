angular.module('specter.tab.mapview.controller', [])
.controller('mapviewCtrl', [
  'stacheService',
  'geoService',
  'location',
  '$scope',
  '$rootScope',
  '$timeout',
  '$ionicPopup',
  '$state',
  function(stacheService, geoService, location, $scope, $rootScope, $timeout, $ionicPopup, $state) {
    var self = this;
    var params = {
      lat: location.coords.latitude,
      lon: location.coords.longitude,
      dist: 1000000
    };
    stacheService.getAll(params).then(function(staches) {
      self.staches = staches;
    });

  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Please log in with your Facebook'
    });
    alertPopup.then(function(res) {
      $state.go('tab.profile');
    });
   };

   $rootScope.$on('$showPopup', function (event, next) {
      $scope.showAlert();
    });
}]);
