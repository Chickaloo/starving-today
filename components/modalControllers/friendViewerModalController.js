angular.module('starvingToday').controller('friendViewerModalController',['$scope' , '$http' , '$state', 'dataUser' , function($scope , $http , $state, dataUser){

  $scope.myUser = dataUser.getMyUser();

  var config = {
      withCredentials: 'true',
      headers : {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }

  $http.get('http://138.68.22.10:84/subscriptions/' + $scope.myUser.userid , config)
  .then(
    function(response){
      $scope.currfriends = response.data;
      console.log($scope.userfriends);
    },
    function(response){
      if (response.status === 500) {
          $scope.responseDetails = "Something went wrong with our servers!";
      } else if(response.status === 400){
          $scope.responseDetails = "The input was invalid. Please try again.";
      } else if(response.status === 404){
          $scope.responseDetails = "No recipes were found.";
      } else {
          $scope.responseDetails = "Something broke!";
      }
    }
  );

  $scope.searchForUser = function(value){

  var query = {
    keywords: $scope.searchquery,
    bytag: false,
    byname: false,
    byingredient: false,
    byuserid: true
  };

  var data = JSON.stringify(query);

  var config = {
    withCredentials: 'true',
		headers : {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	}

	$http.post('http://138.68.22.10:84/search', query, config)
	.then(
		function (response) {
        dataUser.setUsers(response.data.users);
        $scope.searchres = dataUser.getUsers();
        console.log($scope.userfriends);
        $scope.usercount = dataUser.getUserLength();
        $scope.search = $scope.searchquery;
        $scope.$apply();
		},
		function (response) {
			if (response.status === 500) {
					$scope.responseDetails = "Something went wrong with our servers!";
			} else if(response.status === 400){
					$scope.responseDetails = "The input was invalid. Please try again.";
			} else if(response.status === 404){
					$scope.responseDetails = "No recipes were found.";
			} else {
					$scope.responseDetails = "Something broke!";
			}
	});
  }

  $scope.selectUser = function(value){
    $http.get('http://138.68.22.10:84/users/id/' + value).then(
      function(response){
        dataUser.setUser(response.data.user);
        $state.go('yourHub', {}, {reload:true});
      },
      function(response){
        dataRecipe.recipelen = 0;
      });
  }
}]);
