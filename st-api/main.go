/* vim:ts=4:sw=4:noexpandtab:softtabstop=4
 * Christopher Kong
 */

// StarvingToday API server that supports RESTful interface.
// For more documentation, please go to https://swaggerhub.com/apis/chickaloo/StarvingTodayBackend/1.0.0
package main

import (
	"flag"
	"fmt"
	"net/http"

	"github.com/gorilla/handlers"
)

const (
	version = 0.1
)

// Debug toggles debug
var Debug = flag.Bool("debug", false, "Toggle Debug on (true) or off (false)"

// Port sets the port number
var Port = flag.String("port", "81", "Set API Port (default 81)")

// Feed used by feeder.go
// var Feed Feeder

func main() {

	flag.Parse()

	// Initialize feeder to ease load
	// Feed := new(Feeder)
	// Feed.Init()

	// CORS
	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	router := NewRouter()

	fmt.Println(http.ListenAndServe(":"+*Port, handlers.CORS(headersOk, originsOk, methodsOk)(router)))

}
