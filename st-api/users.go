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

// UserLogin is the authentication function for the API.
func UserLogin(w http.ResponseWriter, r *http.Request) {

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

	rows, err := db.Connection.Query(fmt.Sprintf("SELECT user_id, first_name, last_name FROM user WHERE user_name=\"%s\" AND password=\"%s\"", rdata.Username, rdata.Password))
	if err != nil {
		res.Content = fmt.Sprintf("Login failed. Error: %s", err.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	for rows.Next() {
		if err := rows.Scan(&rdata.UserID, &rdata.Firstname, &rdata.Lastname); err != nil {
			res.Content = "Login Failed!"
			Respond(w, res, http.StatusNotFound)
			return
		}
		if *Debug {
			fmt.Printf("Input: %s %s\nResult:%d %s %s\n", rdata.Username, rdata.Password, rdata.UserID, rdata.Firstname, rdata.Lastname)
		}
	}

	Respond(w, rdata, http.StatusOK)
	return
}
