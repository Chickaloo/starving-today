/* vim:ts=4:sw=4:noexpandtab:softtabstop=4
 * Christopher Kong
 */

// StarvingToday API server that supports RESTful interface.
// For more documentation, please go to https://swaggerhub.com/apis/chickaloo/StarvingTodayBackend/1.0.0
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	db "./database"
)

const contentType = "application/json"

// Decode decodes JSON formatted request and error exits on errors in fetching or decoding.
func Decode(w http.ResponseWriter, r *http.Request, req interface{}) (err error) {
	if err = json.NewDecoder(r.Body).Decode(req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	return
}

// Respond sends off the HTTP response in JSON format with an appropriate HTTP status
func Respond(w http.ResponseWriter, res interface{}, status int) {
	w.Header().Set("Content-Type", contentType)
	if status == 0 {
		status = http.StatusOK
	}
	w.WriteHeader(status)

	json.NewEncoder(w).Encode(res)
}

// DebugPOST returns the contents of the recieved packet.
func DebugPOST(w http.ResponseWriter, r *http.Request) {
	var req Request
	var res Response
	if err := Decode(w, r, &req); err != nil {
		res.Content = "Invalid JSON format recieved!"
		Respond(w, res, http.StatusBadRequest)
	}
	Respond(w, req, http.StatusOK)
}

// Stats returns the count of both users and recipes.
func Stats(w http.ResponseWriter, r *http.Request) {
	var res Response

	result, serr := db.Connection.Query("SELECT * FROM stat WHERE 1")
	if serr != nil {
		if *Debug {
			fmt.Println("Count Retrieval Failed: ", serr.Error())
		}
		res.Content = fmt.Sprintf("Count Retrieval Failed: %s", serr.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	}

	defer result.Close()
	for result.Next() {
		if rerr := result.Scan(&res.RecipeCount, &res.UserCount); rerr != nil {
			res.Content = "Count Reading Failed"
			Respond(w, res, http.StatusInternalServerError)
			return
		}
	}
	Respond(w, res, http.StatusOK)
}

func StatUpdate(r int, u int) error {
	var res Response

	rows, serr := db.Connection.Query("SELECT * FROM stat WHERE 1")
	if serr != nil {
		return serr
	}

	defer rows.Close()
	for rows.Next() {
		if rerr := rows.Scan(&res.RecipeCount, &res.UserCount); rerr != nil {
			return rerr
		}
	}

	_, uerr := db.Connection.Exec(fmt.Sprintf("UPDATE stat SET recipe_count = \"%d\", user_count = \"%d\" WHERE 1", res.RecipeCount+r, res.UserCount+u))
	if uerr != nil {
		return uerr
	}

	return nil
}

// Intersection should return the logical AND of two arrays of, in this case, RecipeIDs (ints). Used internally for search.
func Intersection(a []int, b []int) (inter []int) {
	// interacting on the smallest list first can potentailly be faster...but not by much, worse case is the same
	low, high := a, b
	if len(a) > len(b) {
		low = b
		high = a
	}

	done := false
	for i, l := range low {
		for j, h := range high {
			// get future index values
			f1 := i + 1
			f2 := j + 1
			if l == h {
				inter = append(inter, h)
				if f1 < len(low) && f2 < len(high) {
					// if the future values aren't the same then that's the end of the intersection
					if low[f1] != high[f2] {
						done = true
					}
				}
				// we don't want to interate on the entire list everytime, so remove the parts we already looped on will make it faster each pass
				high = high[:j+copy(high[j:], high[j+1:])]
				break
			}
		}
		// nothing in the future so we are done
		if done {
			break
		}
	}
	return
}

// Search is intended to work as an umbrella function of sorts that implements POST /search. it recieves 4 true/false values and a string and calls the relevant search methods from recipes.go
func Search(w http.ResponseWriter, r *http.Request) {
	// Since we need the logical OR of multiple searches, a map will be used here (Recipes struct within Response)
	var res Response
	// As well as an int array to store the RecipeIDs from each individual search
	var req SearchParameters
	//var obj Recipes
	res.Recipes = make(map[string]Recipe)

	derr := Decode(w, r, &req)
	if derr != nil {
		if *Debug {
			fmt.Println("Decode Error.")
		}
		res.Content = "Invalid JSON format recieved!"
		Respond(w, res, http.StatusBadRequest)
		return
	}

	if req.ByIngredient == true {
		temp, serr := RecipeSearchByIngredients(req.Keywords)
		if serr != nil {
			fmt.Println(serr.Error())
			return
		}
		for i := 0; i < len(temp); i++ {
			key := strconv.Itoa(temp[i])
			value, cerr := RecipeIDHelper(temp[i])
			res.Recipes[key] = value
			if cerr != nil {
				fmt.Println(serr.Error())
				return
			}
		}
	}

	if req.ByUserID == true {
		temp, serr := RecipeSearchByUser(req.Keywords)
		if serr != nil {
			fmt.Println(serr.Error())
			return
		}
		for i := 0; i < len(temp); i++ {
			key := strconv.Itoa(temp[i])
			value, cerr := RecipeIDHelper(temp[i])
			res.Recipes[key] = value
			if cerr != nil {
				fmt.Println(serr.Error())
				return
			}
		}
	}

	if req.ByName == true {
		temp, serr := RecipeSearchByName(req.Keywords)
		if serr != nil {
			fmt.Println(serr.Error())
			return
		}
		for i := 0; i < len(temp); i++ {
			key := strconv.Itoa(temp[i])
			value, cerr := RecipeIDHelper(temp[i])
			res.Recipes[key] = value
			if cerr != nil {
				fmt.Println(serr.Error())
				return
			}
		}
	}

	if req.ByTag == true {
		temp, serr := RecipeSearchByTags(req.Keywords)
		if serr != nil {
			fmt.Println(serr.Error())
			return
		}
		for i := 0; i < len(temp); i++ {
			key := strconv.Itoa(temp[i])
			value, cerr := RecipeIDHelper(temp[i])
			res.Recipes[key] = value
			if cerr != nil {
				fmt.Println(serr.Error())
				return
			}
		}
	}

	//res.Recipes = &obj
	Respond(w, res, http.StatusOK)
}
