var app = angular.module('starvingToday',['ui.router']);

app.controller('mainController' , ['$scope', '$http', 'dataUser', function($scope, $http, dataUser){
		var config = {
      withCredentials: 'true',
			headers : {
				'Content-Type': 'application/json;charset=UTF-8'
			}
		}

		$http.get('http://138.68.22.10:84/users/auth', config)
		.then(
			function(response){
				$scope.auth = true;

				dataUser.setUser(response.data.user)
			},
			function(response){
				$scope.auth = false;
			}
		);


	$scope.changeAuth = function(newAuthVal){
		$scope.auth = newAuthVal;
	};
}]);

app.config(function($stateProvider, $httpProvider) {

  $httpProvider.defaults.withCredentials = true;
	var landingState = {
    name: 'login',
    url: '/login',
    templateUrl: 'components/landingPage/landingPage.html',
	  controller: 'landingController'
  }

  var addRecipeState = {
    name: 'addRecipe',
    url: '/addRecipe',
    templateUrl: 'components/addRecipe/addRecipe.html',
	 controller: 'addRecipeController'
  }

  var myHubState = {
    name: 'myHub',
    url: '/myHub',
    templateUrl: 'components/myHub/myHub.html'
  }

  var aboutState = {
    name: 'about',
    url: '/about',
    template: '<h3>Its the UI-Router hello world app!</h3>'
  }

  var recipeState = {
    name: 'recipes',
    url: '/recipes',
    templateUrl: 'components/recipesPage/recipesPage.html',
    controller: 'recipesController'
  }

  var defaultState = {
    name: 'default',
    url: '',
    templateUrl: 'components/homePage/home.html',
    controller: 'landingController'
  }

  var homeState = {
    name: 'home',
    url: '/home',
    templateUrl: 'components/homePage/home.html',
    controller: 'landingController'
  }

    var viewRecipesState = {
    name: 'viewRecipesState',
    url: 'recipe',
    templateUrl: 'components/viewRecipePage/viewRecipePage.html',
    controller: 'viewRecipeController'
  }

  $stateProvider.state(myHubState);
  $stateProvider.state(landingState);
  $stateProvider.state(addRecipeState);
  $stateProvider.state(aboutState);
  $stateProvider.state(defaultState);
  $stateProvider.state(homeState);
  $stateProvider.state(recipeState);
  $stateProvider.state(viewRecipesState);
});


angular.module('starvingToday').factory('dataUser', ['$http', function ($http) {
    var dataUser = {};
    var user;

    dataUser.getUser = function (userid) {
        return $http.get('http://138.68.22.10:84/users/id/' + userid);
    };

    dataUser.searchUser = function () {
        return $http.get('http://138.68.22.10:84/recipe/user/' + userid)
    };

    dataUser.pushUser = function(value) {
        dataUser.push(value);
    };

    dataUser.popUser = function() {
        dataUser.pop();
    };

    return {
      setUser: function(user){
          this.user = user;
      }
    }

}]);
