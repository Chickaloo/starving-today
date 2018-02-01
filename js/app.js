var app = angular.module("app",["ngRoute"]);
app.config(function($routeProvider)){
		   $routeProvider
		   .when("/",{
		   		templateURL: "sign-in-app.html"
		   })

});
