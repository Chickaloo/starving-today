

var app = angular.module('app',['ngRoute']);

/*
	LINKS TO VARIOUS VIEWS
	Inserts various html files into the index.html as views as needed.
	
	ISSUES SO FAR:
	So far just putting a list of links at the top of the page that will substitute these views for one another. 
*/
app.config(function($routeProvider){
	$routeProvider	
	.when('/',{
		templateUrl : 'components/signIn/sign-in-app.html'
	})
	.when('/addRecipe',{
		templateUrl : 'components/addRecipe/add-recipe-app.htm'
	});
});