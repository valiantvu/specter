angular.module('specter.tab.create.controller', [])
.controller('createCtrl', function($scope, $ionicActionSheet, $ionicPopup, $timeout) {
  $scope.data = {
    currentTags: []
  };
  // Triggered on a button click, or some other target
  $scope.show = function() {
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [{
        text: 'Funny'
      }, {
        text: 'Puzzle'
      }, {
        text: 'Event'
      }, {
        text: 'Add a tag...'
      }],
      addText: 'Add a tag',
      cancelText: 'Done',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index, data) {
        if (index === 3) {
          // clicked add tags button
          $scope.showPopup();
        } else {
          $scope.data.currentTags.push(data.text);
        }
      }
    });

    // For example's sake, hide the sheet after two seconds
    // $timeout(function() {
    //   hideSheet();
    // }, 2000);

  };

  $scope.showPopup = function() {
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.newTag">',
      title: 'Enter a new tag',
      // subTitle: 'Please use normal things',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
      },
      {
        text: '<b>Save tag</b>',
        type: 'button-positive',
        onTap: function(e) {
          $scope.data.currentTags.push($scope.data.newTag);
          $scope.data.newTag = '';
        }
      }, ]
    });
    myPopup.then(function(res) {
      // console.log('Tapped!', res);
    });
  };
});