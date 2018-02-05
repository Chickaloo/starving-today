/*
	LINKS TO VARIOUS VIEWS
	Inserts various html files into the index.html as views as needed.
	
	ISSUES SO FAR:
	So far just putting a list of links at the top of the page that will substitute these views for one another. 
*/
var app = angular.module('app',['ngRoute']);

app.config(function($routeProvider){
	$routeProvider	
	.when('/',{
		templateUrl : 'components/signIn/sign-in-app.html'
	})
	.when('/addRecipe',{
		templateUrl : 'components/addRecipe/add-recipe-app.htm'
	})
	.when('/home',{
		templateUrl : 'components/homePage/home.html'
	})
	.when('/profile',{
		templateUrl : 'components/userPage/profile.html'
	})
	.when('/account',{
		templateUrl : 'components/userPage/account.html'
	});
});