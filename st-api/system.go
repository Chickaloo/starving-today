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
