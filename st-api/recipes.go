/* vim:ts=4:sw=4:noexpandtab:softtabstop=4
 * Christopher Kong
 */

// StarvingToday API server that supports RESTful interface.
// For more documentation, please go to https://swaggerhub.com/apis/chickaloo/StarvingTodayBackend/1.0.0
package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	db "./database"
	"github.com/gorilla/mux"
)

// RecipeCreate implements the POST /recipes/ endpoint to create a recipe.
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

	query := fmt.Sprintf("INSERT INTO recipe (user_id, recipe_name, recipe_description, recipe_instructions, image_url, calories, prep_time, cook_time, total_time, servings, upvotes, downvotes, made)\nVALUES (\"%d\", \"%s\", \"%s\", \"%s\", \"%s\", \"%d\", \"%d\", \"%d\", \"%d\", \"%d\", \"%d\", \"%d\", \"%d\")", rdata.UserID, rdata.RecipeName, rdata.RecipeDescription, rdata.RecipeInstructions, rdata.ImageURL, rdata.Calories, rdata.PrepTime, rdata.CookTime, rdata.TotalTime, rdata.Servings, rdata.Upvotes, rdata.Downvotes, rdata.Made)
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

	//Adds the tags to the tag table
	tquery := fmt.Sprintf("INSERT INTO tag (recipe_id, tag)\nVALUES ")
	for i := 0; i < len(rdata.Tags); i++ {
		tquery += fmt.Sprintf("(\"%d\", \"%s\")", rdata.RecipeID, rdata.Tags[i])
		if i != len(rdata.Tags)-1 {
			tquery += ","
		}
	}
	tresult, terr := db.Connection.Exec(tquery)
	if terr != nil {
		if *Debug {
			fmt.Println("Tags Insertion Failed: ", err.Error())
		}
		res.Content = fmt.Sprintf("Tags Insertion Failed: %s", err.Error())
		Respond(w, tresult, http.StatusInternalServerError)
		return
	}

	//Adds the ingredients to the ingredient table
	iquery := fmt.Sprintf("INSERT INTO ingredient (recipe_id, count, unit, ingredient)\nVALUES ")
	for i := 0; i < len(rdata.Ingredients); i++ {
		iquery += fmt.Sprintf("(\"%d\", \"%s\", \"%s\", \"%s\")", rdata.RecipeID, rdata.Ingredients[i].Amount, rdata.Ingredients[i].Unit, rdata.Ingredients[i].Ingredient)
		if i != len(rdata.Ingredients)-1 {
			iquery += ","
		}
	}
	iresult, ierr := db.Connection.Exec(iquery)
	if ierr != nil {
		if *Debug {
			fmt.Println("Ingredients Insertion Failed: ", err.Error())
		}
		res.Content = fmt.Sprintf("Ingredients Insertion Failed: %s", err.Error())
		Respond(w, iresult, http.StatusInternalServerError)
		return
	}

	//RecipeCount update block
	rows, serr := db.Connection.Query("SELECT * FROM stat WHERE 1")
	if serr != nil {
		if *Debug {
			fmt.Println("Count Retrieval Failed: ", serr.Error())
		}
		res.Content = fmt.Sprintf("Count Retrieval Failed: %s", serr.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	}

	defer rows.Close()
	for rows.Next() {
		if rerr := rows.Scan(&res.RecipeCount, &res.UserCount); rerr != nil {
			res.Content = "Count Reading Failed"
			Respond(w, res, http.StatusInternalServerError)
			return
		}
	}

	uresult, uerr := db.Connection.Exec(fmt.Sprintf("UPDATE stat SET recipe_count = \"%d\", user_count = \"%d\" WHERE 1", res.RecipeCount+1, res.UserCount))
	if uerr != nil {
		if *Debug {
			fmt.Println("Count Update Failed: ", uerr.Error())
		}
		res.Content = fmt.Sprintf("Count Update Failed: %s", uerr.Error())
		Respond(w, uresult, http.StatusInternalServerError)
		return
	}

	res.RecipeCount--

	Respond(w, rdata, http.StatusOK)
}

// RecipeDelete implements the DELETE /recipes/{recipeid} endpoint to delete a recipe.
func RecipeDelete(w http.ResponseWriter, r *http.Request) {
	var res Response

	params := mux.Vars(r)

	query := fmt.Sprintf("DELETE FROM recipe WHERE recipe_id=%s", params["recipeid"])
	result, err := db.Connection.Exec(query)
	if err != nil {
		if *Debug {
			fmt.Println("Recipe Not Found: ", err.Error())
		}
		res.Content = fmt.Sprintf("Recipe Not Found: %s", err.Error())
		Respond(w, res, http.StatusNotFound)
		return
	}

	_, cerr := result.RowsAffected()
	if cerr != nil {
		if *Debug {
			fmt.Println("Recipe Deletion failed: ", cerr.Error())
		}
		res.Content = fmt.Sprintf("Recipe Deletion failed: %s", cerr.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	}

	//RecipeCount update block
	rows, serr := db.Connection.Query("SELECT * FROM stat WHERE 1")
	if serr != nil {
		if *Debug {
			fmt.Println("Count Retrieval Failed: ", serr.Error())
		}
		res.Content = fmt.Sprintf("Count Retrieval Failed: %s", serr.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	}

	defer rows.Close()
	for rows.Next() {
		if rerr := rows.Scan(&res.RecipeCount, &res.UserCount); rerr != nil {
			res.Content = "Count Reading Failed"
			Respond(w, res, http.StatusInternalServerError)
			return
		}
	}

	uresult, uerr := db.Connection.Exec(fmt.Sprintf("UPDATE stat SET recipe_count = \"%d\", user_count = \"%d\" WHERE 1", res.RecipeCount-1, res.UserCount))
	if uerr != nil {
		if *Debug {
			fmt.Println("Count Update Failed: ", uerr.Error())
		}
		res.Content = fmt.Sprintf("Count Update Failed: %s", uerr.Error())
		Respond(w, uresult, http.StatusInternalServerError)
		return
	}

	//Delete tags according to recipe id
	tquery := fmt.Sprintf("DELETE FROM tag WHERE recipe_id=%s", params["recipeid"])
	tresult, terr := db.Connection.Exec(tquery)
	if terr != nil {
		if *Debug {
			fmt.Println("Tags Not Found: ", terr.Error())
		}
		res.Content = fmt.Sprintf("Tags Not Found: %s", terr.Error())
		Respond(w, res, http.StatusNotFound)
		return
	}

	_, tcerr := tresult.RowsAffected()
	if tcerr != nil {
		if *Debug {
			fmt.Println("Tags Deletion failed: ", tcerr.Error())
		}
		res.Content = fmt.Sprintf("Tags Deletion failed: %s", tcerr.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	}

	//Delete ingredients according to recipe id
	iquery := fmt.Sprintf("DELETE FROM ingredient WHERE recipe_id=%s", params["recipeid"])
	iresult, ierr := db.Connection.Exec(iquery)
	if ierr != nil {
		if *Debug {
			fmt.Println("Ingredients Not Found: ", ierr.Error())
		}
		res.Content = fmt.Sprintf("Ingredients Not Found: %s", ierr.Error())
		Respond(w, res, http.StatusNotFound)
		return
	}

	_, icerr := iresult.RowsAffected()
	if icerr != nil {
		if *Debug {
			fmt.Println("Ingredients Deletion failed: ", icerr.Error())
		}
		res.Content = fmt.Sprintf("Ingredients Deletion failed: %s", icerr.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	}

	Respond(w, res, http.StatusOK)
}

// RecipeDump implements the GET /api/recipes endpoint to dump a list of all recipes.
func RecipeDump(w http.ResponseWriter, r *http.Request) {
	var rdata Recipes
	var res Response

	rows, err := db.Connection.Query("SELECT recipe_id, recipe_name, recipe_description, image_url, prep_time, cook_time, upvotes, downvotes, made FROM recipe")
	if err != nil {
		Respond(w, res, http.StatusInternalServerError)
		return
	}

	defer rows.Close()
	rdata.RecipeList = make(map[int]Recipe)
	for rows.Next() {
		var re Recipe
		if err := rows.Scan(&re.RecipeID, &re.RecipeName, &re.RecipeDescription, &re.ImageURL, &re.PrepTime, &re.CookTime, &re.Upvotes, &re.Downvotes, &re.Made); err != nil {
			res.Content = "Recipe Population Failed!"
			Respond(w, res, http.StatusInternalServerError)
			return
		}
		if *Debug {
			fmt.Printf("%d: %s %s %s %d %d %d %d %d\n", re.RecipeID, re.RecipeName, re.RecipeDescription, re.ImageURL, re.PrepTime, re.CookTime, re.Upvotes, re.Downvotes, re.Made)
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

	err := db.Connection.QueryRow(fmt.Sprintf("SELECT * FROM recipe WHERE recipe_id=\"%s\"", params["recipeid"])).Scan(&rdata.RecipeID, &rdata.UserID, &rdata.RecipeName, &rdata.RecipeDescription, &rdata.RecipeInstructions, &rdata.ImageURL, &rdata.Calories, &rdata.PrepTime, &rdata.CookTime, &rdata.TotalTime, &rdata.Servings, &rdata.Upvotes, &rdata.Downvotes, &rdata.Made)
	switch {
	case err == sql.ErrNoRows:
		res.Content = fmt.Sprintf("Recipe not found. Error: %s", err.Error())
		Respond(w, res, http.StatusNotFound)
		return
	case err != nil:
		res.Content = fmt.Sprintf("Recipe retrieval failed: %s", err.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	default:
		res.Content = "Recipe retrieval successful!"
	}

	rows, err := db.Connection.Query(fmt.Sprintf("SELECT tag FROM tag WHERE recipe_id=%s", params["recipeid"]))
	if err != nil {
		Respond(w, res, http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	for rows.Next() {
		var tag string
		if err := rows.Scan(&tag); err != nil {
			res.Content = "Tag population failed!"
			Respond(w, res, http.StatusInternalServerError)
			return
		}
		rdata.Tags = append(rdata.Tags, tag)
		if *Debug {
			fmt.Printf("%s\n", rdata.Tags)
		}
	}

	irows, err := db.Connection.Query(fmt.Sprintf("SELECT count, unit, ingredient FROM ingredient WHERE recipe_id=%s", params["recipeid"]))
	if err != nil {
		Respond(w, res, http.StatusInternalServerError)
		return
	}
	defer irows.Close()
	for irows.Next() {
		var ingredient Ingredient
		if err := irows.Scan(&ingredient.Amount, &ingredient.Unit, &ingredient.Ingredient); err != nil {
			res.Content = "Ingredient population failed!"
			Respond(w, res, http.StatusInternalServerError)
			return
		}
		rdata.Ingredients = append(rdata.Ingredients, ingredient)
		if *Debug {
			fmt.Printf("%s\n", rdata.Ingredients)
		}
	}

	Respond(w, rdata, http.StatusOK)
}

// RecipeIDHelper Is utilized by the search function to translate recipe IDs to recipes
func RecipeIDHelper(recipeid int) (rdata Recipe, cerr error) {
	idstring := strconv.Itoa(recipeid)
	err := db.Connection.QueryRow(fmt.Sprintf("SELECT * FROM recipe WHERE recipe_id=\"%s\"", idstring)).Scan(&rdata.RecipeID, &rdata.UserID, &rdata.RecipeName, &rdata.RecipeDescription, &rdata.RecipeInstructions, &rdata.ImageURL, &rdata.Calories, &rdata.PrepTime, &rdata.CookTime, &rdata.TotalTime, &rdata.Servings, &rdata.Upvotes, &rdata.Downvotes, &rdata.Made)
	switch {
	case err == sql.ErrNoRows:
		fmt.Printf("Recipe not found. Error: %s", err.Error())
		return
	case err != nil:
		fmt.Printf("Recipe retrieval failed: %s", err.Error())
		return
	default:
		fmt.Print("Recipe retrieval successful!")
	}

	rows, err := db.Connection.Query(fmt.Sprintf("SELECT tag FROM tag WHERE recipe_id=%s", idstring))
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	defer rows.Close()
	for rows.Next() {
		var tag string
		if err := rows.Scan(&tag); err != nil {
			fmt.Print("Tag population failed!")
			return
		}
		rdata.Tags = append(rdata.Tags, tag)
		if *Debug {
			fmt.Printf("%s\n", rdata.Tags)
		}
	}

	irows, err := db.Connection.Query(fmt.Sprintf("SELECT count, unit, ingredient FROM ingredient WHERE recipe_id=%s", idstring))
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	defer irows.Close()
	for irows.Next() {
		var ingredient Ingredient
		if err := irows.Scan(&ingredient.Amount, &ingredient.Unit, &ingredient.Ingredient); err != nil {
			fmt.Println(err.Error())
			return
		}
		rdata.Ingredients = append(rdata.Ingredients, ingredient)
		if *Debug {
			fmt.Printf("%s\n", rdata.Ingredients)
		}
	}

	return
}

// RecipeSearchByIngredients implements the GET /api/recipes/tags/{tags} to retrieve all recipes that contain all listed ingredients
func RecipeSearchByIngredients(s string) (rdata []int, serr error) {
	var search []int
	var temp int
	keywords := s

	ingredients := strings.Split(keywords, ",")
	for i := 0; i < len(ingredients); i++ {
		//ingredients[i] = strings.TrimSpace(ingredients[i])
		search = nil

		//Populate search with all recipes that include the current ingredient.
		rows, qerr := db.Connection.Query(fmt.Sprintf("SELECT recipe_id FROM ingredient WHERE ingredient = \"%s\"", ingredients[i]))
		if qerr != nil {
			fmt.Println(qerr.Error())
			return
		}
		defer rows.Close()
		for rows.Next() {
			if qerr := rows.Scan(&temp); qerr != nil {
				fmt.Println(qerr.Error())
				return
			}
			if *Debug {
				fmt.Printf("%d\n", temp)
			}
			search = append(search, temp)
		}

		//Each pass we set rdata to the AND of itself and the new ingredients recipe list so that the end result is all recipes that contain all searched ingredients
		if i == 0 {
			rdata = search
		} else {
			rdata = Intersection(rdata, search)
		}
	}
	return
}

// RecipeSearchByTags implements the GET /api/recipes/tags/{tags} to retrieve all recipes that contain all listed tags
func RecipeSearchByTags(s string) (rdata []int, serr error) {
	var search []int
	var temp int
	keywords := s

	tags := strings.Split(keywords, ",")
	for i := 0; i < len(tags); i++ {
		search = nil

		//Populate search with all recipes that include the current tag.
		rows, qerr := db.Connection.Query(fmt.Sprintf("SELECT recipe_id FROM tag WHERE tag = \"%s\"", tags[i]))
		if qerr != nil {
			fmt.Println(qerr.Error())
			return
		}
		defer rows.Close()
		for rows.Next() {
			if qerr := rows.Scan(&temp); qerr != nil {
				fmt.Println(qerr.Error())
				return
			}
			if *Debug {
				fmt.Printf("%d\n", temp)
			}
			search = append(search, temp)
		}

		//Each pass we set rdata to the AND of itself and the new ingredients recipe list so that the end result is all recipes that contain all searched tags
		if i == 0 {
			rdata = search
		} else {
			rdata = Intersection(rdata, search)
		}
	}
	return
}

// RecipeSearchByName implements the GET /api/recipes/name/{recipename} to retrieve all recipes that contain any listed words in the name
func RecipeSearchByName(s string) (rdata []int, serr error) {
	var temp int
	var query string

	keywords := s

	namesToSearch := strings.Split(keywords, ",")
	query = "SELECT recipe_id FROM recipe WHERE recipe_name LIKE '%" + namesToSearch[0] + "%'"
	if len(namesToSearch) > 1 {
		for i := 1; i < len(namesToSearch); i++ {
			query += " OR recipe_name LIKE '%" + namesToSearch[i] + "%'"
		}
	}

	rows, qerr := db.Connection.Query(query)
	if qerr != nil {
		fmt.Println(qerr.Error())
		return
	}
	defer rows.Close()
	for rows.Next() {
		if qerr := rows.Scan(&temp); qerr != nil {
			fmt.Println(qerr.Error())
			return
		}
		if *Debug {
			fmt.Printf("%d\n", temp)
		}
		rdata = append(rdata, temp)
	}

	return
}

// RecipeSearchByUser implements the GET /api/recipes/user/{userid} to retrieve all recipes by a particular user
func RecipeSearchByUser(s string) (rdata []int, serr error) {
	var temp int
	var query string

	username := s

	userid, cerr := strconv.Atoi(username)
	if cerr != nil {
		fmt.Println(cerr.Error())
		return
	}

	query = fmt.Sprintf("SELECT recipe_id FROM recipe WHERE user_id = \"%d\"", userid)

	rows, qerr := db.Connection.Query(query)
	if qerr != nil {
		fmt.Println(qerr.Error())
		return
	}
	defer rows.Close()
	for rows.Next() {
		if qerr := rows.Scan(&temp); qerr != nil {
			fmt.Println(qerr.Error())
			return
		}
		if *Debug {
			fmt.Printf("%d\n", temp)
		}
		rdata = append(rdata, temp)
	}

	return
}
