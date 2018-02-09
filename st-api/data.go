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
	Recipes map[string]Recipe `json:"recipes,omitempty"`
	Recipe  Recipe            `json:"recipe,omitempty"`
	User User `json:"user,omitempty"`
	Content string            `json:"content,omitempty"`
}

// Recipe structure
type Recipe struct {
	RecipeID	int	`json:"recipeid,omitempty"`
	UserID		int	`json:"userid,omitempty"`
	RecipeName	string	`json:"recipename,omitempty"`
	RecipeDescription string `json:"recipedescription,omitempty"`
	RecipeInstructions string `json:"recipeinstructions,omitempty"`
	Calories	uint16	`json:"calories,omitempty"`
	PrepTime	uint16	`json:"preptime,omitempty"`
	CookTime	uint16	`json:"cooktime,omitempty"`
	TotalTime	uint	`json:"totaltime,omitempty"`
	Servings	uint8	`json:"servings,omitempty"`
	Upvotes		int	`json:"upvotes,omitempty"`
	Downvotes	int	`json:"downvotes,omitempty"`
	Made		int	`json:"made,omitempty"`
}

// User structure
type User struct {
	UserID     int    `json:"userid,omitempty"`
	Username       string `json:"username,omitempty"`
	Firstname string `json:"firstname,omitempty"`
	Lastname     string    `json:"lastname,omitempty"`
	Email       string `json:"email,omitempty"`
	Password string `json:"password,omitempty"`
	Bio string `json:"bio,omitempty"`
	ProfileImage string `json:"profileimage,omitempty"`
}

// Recipes list of recipes response
type Recipes struct {
	RecipeList map[int]Recipe `json:"recipes,omitempty"`
}
