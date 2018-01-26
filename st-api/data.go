/* vim:ts=4:sw=4:noexpandtab:softtabstop=4
 * Christopher Kong
 */

// StarvingToday API server that supports RESTful interface.
// For more documentation, please go to https://swaggerhub.com/apis/chickaloo/StarvingTodayBackend/1.0.0
package main

// A collection of data structures used to return responses in JSON format.

// Request is for general calls and inter API communication.
type Request struct {
	Name    string                 `json:"name,omitempty"`
	Options map[string]interface{} `json:"opts,omitempty"`
}

// Response returned by every HTTP request.
type Response struct {
	Content string `json:"content,omitempty"`
}
