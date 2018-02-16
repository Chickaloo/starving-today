var app = angular.module('starvingToday',['ui.router']);

app.controller('mainController' , function($scope){
	$scope.auth = false;
	$scope.changeAuth = function(newAuthVal){
		$scope.auth = newAuthVal;
	};
});

app.config(function($stateProvider) {

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

  var homeState = {
    name: 'home',
    url: '',
    templateUrl: 'components/homePage/home.html',
    controller: 'landingController'
  }

    var viewRecipesState = {
    name: 'viewRecipesState',
    url: 'recipe',
    templateUrl: 'components/viewRecipePage/viewRecipePage.html',
    controller: 'viewRecipeController'
  }
    
  $stateProvider.state(landingState);
  $stateProvider.state(addRecipeState);
  $stateProvider.state(aboutState);
  $stateProvider.state(homeState);
  $stateProvider.state(recipeState);
  $stateProvider.state(viewRecipesState);
});
