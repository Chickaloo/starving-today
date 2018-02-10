var app = angular.module('starvingToday',['ui.router']);

app.config(function($stateProvider) {
	
	
	var landingState = {
    name: 'login',
    url: '',
    templateUrl: 'components/landingPage/landingPage.html',
    controller: 'landingController'
  }
  var helloState = {
    name: 'hello',
    url: '/hello',
    templateUrl: 'index.html'
  }

  var landingState = {
    name: 'login',
    url: '/login',
    templateUrl: 'components/landingPage/landingPage.html',
    controller: 'landingController'
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
  
  $stateProvider.state(landingState);
  $stateProvider.state(helloState);
  $stateProvider.state(aboutState);
  $stateProvider.state(recipeState);

  

});
