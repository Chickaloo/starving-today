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
)

func UserCreate(w http.ResponseWriter, r *http.Request) {
	var rdata User
	var res Response

	if err := Decode(w, r, &rdata); err != nil {
		if *Debug {
			fmt.Println("Erreeeer")
		}
		res.Content = "Invalid JSON format recieved!"
		Respond(w, res, http.StatusBadRequest)
		return
	}

	query := fmt.Sprintf("INSERT INTO user (user_name, password, email)\nVALUES (\"%s\", \"%s\", \"%s\")", rdata.Username, rdata.Password, rdata.Email)
	result, err := db.Connection.Exec(query)
	if err != nil {
		if *Debug {
			fmt.Println("User Registration Failed!: ", err.Error())
		}
		res.Content = fmt.Sprintf("User Registration Failed: %s", err.Error())
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

	rdata.UserID = int(rid)

	Respond(w, rdata, http.StatusOK)
	return
}
