var app = angular.module('starvingToday',['ui.router']);

app.controller('mainController' , ['$scope', '$http', 'dataUser', 'dataRecipe', function($scope, $http, dataUser, dataRecipe){
		var config = {
      withCredentials: 'true',
			headers : {
				'Content-Type': 'application/json;charset=UTF-8'
			}
		}

		$http.get('http://138.68.22.10:84/users/auth', config)
		.then(
			function(response){
				dataUser.setMyUser(response.data.user);
				$scope.auth = true;
			},
			function(response){
				$scope.auth = false;
			});

	$scope.changeAuth = function(newAuthVal){
		$scope.auth = newAuthVal;
	};
}]);

app.config(function($stateProvider, $httpProvider) {

  $httpProvider.defaults.withCredentials = true;
  var addRecipeState = {
    name: 'addRecipe',
    url: '/addRecipe',
    templateUrl: 'components/addRecipe/addRecipe.html',
	 controller: 'addRecipeController'
  }

  var myHubState = {
    name: 'myHub',
    url: '/myHub',
    templateUrl: 'components/myHub/myHub.html',
    controller: 'myHubController'
  }

  var yourHubState = {
    name: 'yourHub',
    url: '/yourHub',
    templateUrl: 'components/yourHub/yourHub.html',
    controller: 'yourHubController'
  }

  var recipeState = {
    name: 'recipes',
    url: '/recipes',
    templateUrl: 'components/listRecipes/listRecipes.html',
    controller: 'listRecipesController'
  }

  var defaultState = {
    name: 'default',
    url: '',

    templateUrl: 'components/homePage/home.html',
    controller: 'homeController'
    // templateUrl: 'components/homePage/home.html',
    // controller: 'landingController'
  }

  var homeState = {
    name: 'home',
    url: '/home',
    templateUrl: 'components/myHub/myHub.html',
    controller: 'myHubController'
    // templateUrl: 'components/homePage/home.html',
    // controller: 'landingController'
  }

    var viewRecipesState = {
    name: 'viewRecipesState',
    url: 'recipe',
    templateUrl: 'components/viewRecipePage/viewRecipePage.html',
    controller: 'viewRecipeController'
  }

  $stateProvider.state(myHubState);
  $stateProvider.state(yourHubState);
  $stateProvider.state(addRecipeState);
  $stateProvider.state(defaultState);
  $stateProvider.state(homeState);
  $stateProvider.state(recipeState);
  $stateProvider.state(viewRecipesState);
});

angular.module('starvingToday').factory('dataUser', ['$http', function ($http) {
		var dataUser = {};
		var myUser;
		var user;
		var users;
		var userPosts;

		dataUser.setUsers = function (userlist) {
			users = userlist;
		}

		dataUser.getUsers = function (userlist) {
			return users;
		}

		dataUser.getMyUser = function () {
			return myUser;
		}
		dataUser.setMyUser = function (user) {
			myUser = user;
		}
		dataUser.getUserLength = function () {
			if (typeof users !== "undefined"){
				return users.length;
			} else {
				return 0;
			}
		}

		dataUser.setUser = function(userdata){
			user = userdata;
		}

		dataUser.getUser = function (userid) {
			return user;
		}

		dataUser.setOtherUser = function (userdata) {
			user = userdata;
		}

		dataUser.getPosts = function (userid) {
	      $http.get('http://138.68.22.10:84/posts/' + userid).then(
	  			function (response) {
						var temp = [];
						Object.keys(response.data).forEach(function(key) {
						    temp.push(response.data[key]);
						});
	  				userPosts = temp.reverse();
	  			},
	  			function (response) {
	  				userPosts = 0;
	  		});
				return userPosts;
	    };

    dataUser.searchUser = function (userid) {
        return $http.get('http://138.68.22.10:84/users/id/' + userid);
    };

    dataUser.pushUser = function(value) {
        dataUser.push(value);
    };

    dataUser.popUser = function() {
        dataUser.pop();
    };

		return dataUser
}]);

angular.module('starvingToday').factory('dataRecipe', ['$http', function ($http) {
    var dataRecipe = {};
    var recipe = [];
    var currRecipe;
    var recipes;
    var recipelen = 0;
		var comment;

    dataRecipe.setRecipes = function(incomingrecipes) {
      if (typeof incomingrecipes !== "undefined"){
        recipes = incomingrecipes;
        recipelen = Object.keys(recipes).length;
      } else {
        recipelen = 0;
      }
      console.log(recipelen);
    };

    dataRecipe.getRecipes = function() {
      return recipes;
    };

    dataRecipe.setRecipeLength = function(value) {
        recipelen = value;
    }

    dataRecipe.getRecipeLength = function() {
      return recipelen;
    };

    dataRecipe.getRecipeDump = function () {
        return $http.get('http://138.68.22.10:84/recipes');
    };

    dataRecipe.getRecipe = function () {
      return currRecipe;
    };

    dataRecipe.getRecipeComments = function(recipeid) {
        $http.get('http://138.68.22.10:84/comments/recipe/' + recipeid).then(
            function (response) {
                console.log(response.data);
                return response.data;
            })
    };

    dataRecipe.setCurrRecipe = function (recipe) {
      currRecipe = recipe;
      console.log("inside datarecipe");
      console.log(currRecipe);
    }

    dataRecipe.getCurrRecipe = function () {
        return currRecipe;
    };

    dataRecipe.pushRecipe = function(value) {
        recipe.push(value);
    };

    dataRecipe.popRecipe = function() {
        recipe.pop();
    };

		dataRecipe.getComment = function(){
				return comment;
		};

		dataRecipe.setComment = function(value){
				comment = value;
		};
    return dataRecipe;
}]);
