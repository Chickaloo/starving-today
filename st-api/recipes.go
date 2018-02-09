/* vim:ts=4:sw=4:noexpandtab:softtabstop=4
 * Christopher Kong
 */

// StarvingToday API server that supports RESTful interface.
// For more documentation, please go to https://swaggerhub.com/apis/chickaloo/StarvingTodayBackend/1.0.0
package main

import (
	"fmt"
	"net/http"

	db "./database"
	"github.com/gorilla/mux"
)

// RecipeCreate implements the POST /api/recipes endpoint to create a recipe.
func RecipeCreate(w http.ResponseWriter, r *http.Request) {
	var rdata Recipe
	var res Response

	if err := Decode(w, r, &rdata); err != nil {
		if *Debug {
			fmt.Println("Erreeeer")
		}
		res.Content = "Invalid JSON format recieved!"
		Respond(w, res, http.StatusBadRequest)
		return
	}

	query := fmt.Sprintf("INSERT INTO recipe (user_id, recipe_name, recipe_description, recipe_instructions, calories, prep_time, cook_time, total_time, servings, upvotes, downvotes, made)\nVALUES (\"%d\", \"%s\", \"%s\", \"%s\", \"%d\", \"%d\", \"%d\", \"%d\", \"%d\", \"%d\", \"%d\", \"%d\")", rdata.UserID, rdata.RecipeName, rdata.RecipeDescription, rdata.RecipeInstructions, rdata.Calories, rdata.PrepTime, rdata.CookTime, rdata.TotalTime, rdata.Servings, rdata.Upvotes, rdata.Downvotes, rdata.Made)
	result, err := db.Connection.Exec(query)
	if err != nil {
		if *Debug {
			fmt.Println("Recipe Creation Failed: ", err.Error())
		}
		res.Content = fmt.Sprintf("Recipe Creation Failed: %s", err.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	}

	rid, iderr := result.LastInsertId()
	if iderr != nil {
		if *Debug {
			fmt.Println("Problem retrieving ID: ", iderr.Error())
		}
		res.Content = fmt.Sprintf("Problem retrieving ID: %s", iderr.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	}

	rdata.RecipeID = int(rid)

	Respond(w, rdata, http.StatusOK)

}

// RecipeDump implements the GET /api/recipes endpoint to dump a list of all recipes.
func RecipeDump(w http.ResponseWriter, r *http.Request) {
	var rdata Recipes
	var res Response

	rows, err := db.Connection.Query("SELECT recipe_id, recipe_name, recipe_description FROM recipe")
	if err != nil {
		Respond(w, res, http.StatusInternalServerError)
		return
	}

	defer rows.Close()
	rdata.RecipeList = make(map[int]Recipe)
	for rows.Next() {
		var re Recipe
		if err := rows.Scan(&re.RecipeID, &re.RecipeName, &re.RecipeDescription); err != nil {
			res.Content = "Recipe Population Failed!"
			Respond(w, res, http.StatusInternalServerError)
			return
		}
		if *Debug {
			fmt.Printf("%d: %s %s\n", re.RecipeID, re.RecipeName, re.RecipeDescription)
		}
		rdata.RecipeList[re.RecipeID] = re
	}
	if err := rows.Err(); err != nil {
		Respond(w, res, http.StatusInternalServerError)
		return
	}

	Respond(w, rdata, http.StatusOK)

}

// RecipeGetByID implements the GET /api/recipes/{recipeid} to retrieve info about a particular recipe
func RecipeGetByID(w http.ResponseWriter, r *http.Request) {
	var rdata Recipe
	var res Response
	params := mux.Vars(r)

	rows, err := db.Connection.Query(fmt.Sprintf("SELECT * FROM recipe WHERE recipe_id=%s", params["recipeid"]))
	if err != nil {
		Respond(w, res, http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	for rows.Next() {
		if err := rows.Scan(&rdata.RecipeID, &rdata.UserID, &rdata.RecipeName, &rdata.RecipeDescription, &rdata.RecipeInstructions, &rdata.Calories, &rdata.PrepTime, &rdata.CookTime, &rdata.TotalTime, &rdata.Servings, &rdata.Upvotes, &rdata.Downvotes, &rdata.Made); err != nil {
			res.Content = "Recipe Population Failed!"
			Respond(w, res, http.StatusInternalServerError)
			return
		}
		if *Debug {
			fmt.Printf("%s %d: %s %s %s %d %d %d %d %d %d %d %d\n", rdata.RecipeID, rdata.UserID, rdata.RecipeName, rdata.RecipeDescription, rdata.RecipeInstructions, rdata.Calories, rdata.PrepTime, rdata.CookTime, rdata.TotalTime, rdata.Servings, rdata.Upvotes, rdata.Downvotes, rdata.Made)
		}
	}

	Respond(w, rdata, http.StatusOK)
}
