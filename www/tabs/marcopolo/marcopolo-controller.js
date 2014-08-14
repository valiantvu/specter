angular.module('specter.tab.marcopolo.controller', [])
  .controller('marcopoloCtrl', [
      'heatmapService',
      'geoService',
      '$cordovaGeolocation',
      '$scope',
      'location',
      '$stateParams',
      'stacheService',
    function(heatmapService, geoService, $cordovaGeolocation, $scope, location, $stateParams, stacheService) {
      var self = this;
      self.location = {long: "", lat: ""};
      self.id = $stateParams.id.slice(1);
      self.location.long = location.coords.longitude;
      self.location.lat = location.coords.latitude;

      stacheService.getOne(self.id)
        .then(function(stache) {
          self.currentStache = stache;
        })
        .then(function(stache) {
          self.distance = geoService.calculateDistance(self.currentStache.loc[0], self.currentStache.loc[1], self.location.long, self.location.lat);
          var weight = 1 / (4 * Math.log(1 + self.distance * 0.000621371192));
          console.log("weight: ", weight);
          heatmapService.addPoint(self.id, self.location.lat, self.location.long, weight);
          $scope.pointArray = heatmapService.getPoints(self.id);
        })
        .catch(function(err) {
          return err;
        });

      $scope.map = {
        center: {
            latitude: self.location.lat,
            longitude: self.location.long
        },
        zoom: 15
      };

      HeatLayer = function (heatLayer) {
          var map, pointarray, heatmap;
          // TODO: Store heatmap data points in local storage when app closes
          // localStorage.setItem(taxiData, JSON.stringify(taxiData));
          // var pointArray = new google.maps.MVCArray(JSON.parse(localStorage.getItem(taxiData)));

          // Get all data points for heatmap
          var weight = 1 / (3 * Math.log(1 + self.distance * 0.000621371192));
          heatmapService.addPoint(self.id, self.location.lat, self.location.long, weight);
          $scope.pointArray = heatmapService.getPoints(self.id);
          heatLayer.setData($scope.pointArray);

      //function changeGradient() {
      //    var gradient = [
      //        'rgba(0, 255, 255, 0)',
      //        'rgba(0, 255, 255, 1)',
      //        'rgba(0, 191, 255, 1)',
      //        'rgba(0, 127, 255, 1)',
      //        'rgba(0, 63, 255, 1)',
      //        'rgba(0, 0, 255, 1)',
      //        'rgba(0, 0, 223, 1)',
      //        'rgba(0, 0, 191, 1)',
      //        'rgba(0, 0, 159, 1)',
      //        'rgba(0, 0, 127, 1)',
      //        'rgba(63, 0, 91, 1)',
      //        'rgba(127, 0, 63, 1)',
      //        'rgba(191, 0, 31, 1)',
      //        'rgba(255, 0, 0, 1)'
      //    ]
      //    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
      //}
      //
      //function changeRadius() {
      //    heatmap.set('radius', heatmap.get('radius') ? null : 20);
      //}
      //
      //function changeOpacity() {
      //    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
      //}
        return heatLayer;
      };

      $scope.heatLayerCallback = function (layer) {
        $scope.heatLayer = new HeatLayer(layer);
      };

      var watch = $cordovaGeolocation.watchPosition({
        frequency: 10000
      });
      watch.promise.then(function() {
          // Not currently used
        }, function(err) {
          self.location = err;
        }, function(position) {
          self.location.long = position.coords.longitude;
          self.location.lat = position.coords.latitude;
          self.prevDistance = self.distance;
          self.distance = geoService.calculateDistance(self.currentStache.loc[0], self.currentStache.loc[1], self.location.long, self.location.lat);

          // Check if user has moved by 0.30 miles (50 meters)
          // from previous location
          // TODO: Check against existing heat map data
          //  Math.floor lat & lon, use as key,
          //  e.g. stache1: { 'lat1, lon1': datapoint1, 'lat2, lon2': datapoint2 }
          var moveDistance = self.prevDistance - self.distance;
          
          // If user is within 3 meters, reveal stache
          if (self.prevDistance && self.distance < 3) {
            console.log("You found the stache!");
            // Route to mah' staches view, newest stache is highlighted and can be clicked on for viewing
          } else if (self.prevDistance && moveDistance >= 3) {
            console.log("User has traveled, adding new location to heatmap.");

            // Normalize distance in miles to calculate weight of heatmap data point
            var weight = 1 / (5 * Math.log(1 + self.distance * 0.000621371192));

            // console.log(self.id, self.location.lat, self.location.long, weight);
            
            // Add current location to heatmap
            heatmapService.addPoint(self.id, self.location.lat, self.location.long, weight);
            $scope.pointArray = heatmapService.getPoints(self.id);
          }
      });
      $scope.$watch('pointArray', function (pointArray) {
        console.log('watch on pointArray triggered');
        $scope.heatLayer.setData(pointArray);
      }, true);
  }]);
