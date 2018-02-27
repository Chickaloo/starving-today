/* vim:ts=4:sw=4:noexpandtab:softtabstop=4
 * Christopher Kong
 */

// StarvingToday API server that supports RESTful interface.
// For more documentation, please go to https://swaggerhub.com/apis/chickaloo/StarvingTodayBackend/1.0.0

package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"os"
	// "time"

	"github.com/gorilla/mux"
)

// Route describes each HTTP URL route supported.
type Route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

// Routes is the list of HTTP routes supported.
type Routes []Route

var routes = Routes{
	// General
	Route{
		"Test",
		"POST",
		"/test",
		DebugPOST,
	},
	Route{
		"Stats",
		"GET",
		"/stats",
		Stats,
	},

	// Recipes
	Route{
		"RecipeCreate",
		"POST",
		"/recipes",
		RecipeCreate,
	},
	Route{
		"RecipeDelete",
		"DELETE",
		"/recipes/{recipeid}",
		RecipeDelete,
	},
	Route{
		"RecipeDump",
		"GET",
		"/recipes",
		RecipeDump,
	},
	Route{
		"RecipeGetByID",
		"GET",
		"/recipes/id/{recipeid}",
		RecipeGetByID,
	},
	// Route{
	// 	"RecipeSearchByUser",
	// 	"GET",
	// 	"/recipes/user/{userid}",
	// 	RecipeSearchByUser,
	// },
	// Route{
	// 	"RecipeSearchByName",
	// 	"GET",
	// 	"/recipes/name/{recipename}",
	// 	RecipeSearchByName,
	// },
	// Route{
	// 	"RecipeSearchByIngredients",
	// 	"GET",
	// 	"/recipes/ingredients/{ingredients}",
	// 	RecipeSearchByIngredients,
	// },
	// Route{
	// 	"RecipeSearchByTags",
	// 	"GET",
	// 	"/recipes/tag/{tags}",
	// 	RecipeSearchByTags,
	// },
	// Route{
	// 	"RecipeGetTop",
	// 	"GET",
	// 	"/recipes/top",
	// 	RecipeGetTop,
	// },
	Route{
		"Search",
		"POST",
		"/search",
		Search,
	},

	// Users
	Route{
		"UserCreate",
		"POST",
		"/users",
		UserCreate,
	},
	Route{
		"UserDelete",
		"DELETE",
		"/users/{userid}",
		UserDelete,
	},
	Route{
		"UserLogin",
		"POST",
		"/users/login",
		UserLogin,
	},
	Route{
		"UserLoginOptions",
		"OPTIONS",
		"/users/login",
		UserLogin,
	},
	Route{
		"UserAuth",
		"GET",
		"/users/auth",
		UserAuth,
	},
	Route{
		"UserAuthOptions",
		"OPTIONS",
		"/users/auth",
		UserAuth,
	},
	Route{
		"UserGetByID",
		"GET",
		"/users/id/{userid}",
		UserGetByID,
	},
}

// Logger hook to implement logging of HTTP requests
func Logger(inner http.Handler, name string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// var start time.Time
		f, err := os.OpenFile("/tmp/st-api-log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
		if err != nil {
			log.Fatalf("error opening file: %v", err)
		}
		defer f.Close()

		if !*Debug {
			// start = time.Now()
			log.SetOutput(f)
		}

		req, err := httputil.DumpRequest(r, true)
		if err != nil {
			req = []byte(err.Error())
		}
		log.Printf("\n\n=====================================================\n\n%s", req)

		inner.ServeHTTP(w, r)
	})
}

// NewRouter configures "github.com/gorilla/mux" to handle all the HTTP routes
func NewRouter() *mux.Router {
	router := mux.NewRouter().StrictSlash(true)
	for _, route := range routes {
		var handler http.Handler

		handler = route.HandlerFunc
		handler = Logger(handler, route.Name)
		router.
			Methods(route.Method).
			Path(route.Pattern).
			Name(route.Name).
			Handler(handler)
	}
	return router
}
