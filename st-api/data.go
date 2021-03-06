/* vim:ts=4:sw=4:noexpandtab:softtabstop=4
 * Christopher Kong
 */

// StarvingToday API server that supports RESTful interface.
// For more documentation, please go to https://swaggerhub.com/apis/chickaloo/StarvingTodayBackend/1.0.0
package main

// A collection of data structures used to return responses in JSON format.

// SearchParameters is for POST /Search
type SearchParameters struct {
	ByIngredient bool   `json:"byingredient,omitempty"`
	ByTag        bool   `json:"bytag,omitempty"`
	ByName       bool   `json:"byname,omitempty"`
	ByUserID     bool   `json:"byuserid,omitempty"`
	Keywords     string `json:"keywords,omitempty"`
}

// Request is for general calls and inter API communication.
type Request struct {
	Name    string                 `json:"name,omitempty"`
	Options map[string]interface{} `json:"opts,omitempty"`
}

// Response returned by every HTTP request.
type Response struct {
	Recipes     map[string]Recipe `json:"recipes,omitempty"`
	Recipe      *Recipe           `json:"recipe,omitempty"`
	RecipeCount int               `json:"recipecount,omitempty"`
	Users       []User            `json:"users,omitempty"`
	User        *User             `json:"user,omitempty"`
	UserCount   int               `json:"usercount,omitempty"`
	Posts       map[string]Post   `json:"posts,omitempty"`
	Content     string            `json:"content,omitempty"`
}

// Recipe structure
type Recipe struct {
	RecipeID           int          `json:"recipeid"`
	UserID             int          `json:"userid,omitempty"`
	RecipeName         string       `json:"recipename,omitempty"`
	RecipeDescription  string       `json:"recipedescription,omitempty"`
	RecipeInstructions string       `json:"recipeinstructions,omitempty"`
	ImageURL           string       `json:"imageurl,omitempty"`
	Ingredients        []Ingredient `json:"ingredients,omitempty"`
	IngredientsIn      string       `json:"ingredientsin,omitempty"`
	Tags               []string     `json:"tags,omitempty"`
	TagsIn             string       `json:"tagsin,omitempty"`
	Calories           uint16       `json:"calories,omitempty"`
	PrepTime           uint16       `json:"preptime,omitempty"`
	CookTime           uint16       `json:"cooktime,omitempty"`
	TotalTime          uint         `json:"totaltime,omitempty"`
	Servings           uint8        `json:"servings,omitempty"`
	Upvotes            int          `json:"upvotes"`
	Downvotes          int          `json:"downvotes"`
	Made               int          `json:"made"`
}

// Ingredient structure
type Ingredient struct {
	RecipeID   string `json:"recipeid"`
	Amount     string `json:"amount,omitempty"`
	Unit       string `json:"unit,omitempty"`
	Ingredient string `json:"ingredient,omitempty"`
}

// User structure
type User struct {
	UserID       int    `json:"userid,omitempty"`
	Username     string `json:"username,omitempty"`
	Firstname    string `json:"firstname,omitempty"`
	Lastname     string `json:"lastname,omitempty"`
	Email        string `json:"email,omitempty"`
	Password     string `json:"password,omitempty"`
	Bio          string `json:"bio,omitempty"`
	ProfileImage string `json:"profileimage,omitempty"`
}

// FollowerPair structure for subscription methods
type FollowerPair struct {
	SubID    int `json:"subid,omitempty"`
	FollowID int `json:"followid,omitempty"`
}

// Recipes list of recipes response
type Recipes struct {
	RecipeList map[int]Recipe `json:"recipes,omitempty"`
}

type Post struct {
	PostID   int    `json:"postid,omitempty"`
	UserID   int    `json:"userid,omitempty"`
	PosterID int    `json:"posterid,omitempty"`
	Title    string `json:"title,omitempty"`
	Content  string `json:"content,omitempty"`
	Date     string `json:"date,omitempty"`
}

// Comment structure
type Comment struct {
	CommentID int    `json:"commentid,omitempty"`
	Date      string `json:"date,omitempty"`
	Comment   string `json:"comment,omitempty"`
	RecipeID  int    `json:"recipeid,omitempty"`
	UserID    int    `json:"userid,omitempty"`
	PosterID  int    `json:"posterid,omitempty"`
}

// Comments list of a recipe
type Comments struct {
	CommentsList map[int]Comment `json:"comments,omitempty"`
}
