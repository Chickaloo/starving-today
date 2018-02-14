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

// UserCreate implements the POST /api/users endpoint to create a user.
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
<<<<<<< HEAD
			fmt.Println("User Creation Failed: ", err.Error())
		}
		res.Content = fmt.Sprintf("User Creation Failed: %s", err.Error())
=======
			fmt.Println("User Registration Failed!: ", err.Error())
		}
		res.Content = fmt.Sprintf("User Registration Failed: %s", err.Error())
>>>>>>> 0dae4523f680674920539e6bedef45f5af869fa8
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

	//UserCount update block
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

	uresult, uerr := db.Connection.Exec(fmt.Sprintf("UPDATE stat SET recipe_count = \"%d\", user_count = \"%d\" WHERE 1", res.RecipeCount, res.UserCount+1))
	if uerr != nil {
		if *Debug {
			fmt.Println("Count Update Failed: ", uerr.Error())
		}
		res.Content = fmt.Sprintf("Count Update Failed: %s", uerr.Error())
		Respond(w, uresult, http.StatusInternalServerError)
		return
	}

	rdata.UserID = int(rid)

	//UserCount update block
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

	uresult, uerr := db.Connection.Exec(fmt.Sprintf("UPDATE stat SET recipe_count = \"%d\", user_count = \"%d\" WHERE 1", res.RecipeCount, res.UserCount+1))
	if uerr != nil {
		if *Debug {
			fmt.Println("Count Update Failed: ", uerr.Error())
		}
		res.Content = fmt.Sprintf("Count Update Failed: %s", uerr.Error())
		Respond(w, uresult, http.StatusInternalServerError)
		return
	}

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

// UserGetByID implements the GET /api/users/{userid} to retrieve info about a particular user
func UserGetByID(w http.ResponseWriter, r *http.Request) {
	var udata User
	var res Response
	params := mux.Vars(r)

	rows, serr := db.Connection.Query(fmt.Sprintf("SELECT * FROM user WHERE user_id=%s", params["userid"]))
	if serr != nil {
		Respond(w, res, http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	for rows.Next() {
		if serr := rows.Scan(&udata.UserID, &udata.Firstname, &udata.Lastname, &udata.Email, &udata.Password, &udata.Bio, &udata.ProfileImage); serr != nil {
			res.Content = "User Population Failed!"
			Respond(w, res, http.StatusInternalServerError)
			return
		}
		if *Debug {
			fmt.Printf("%d: %s %s %s %s %s %s\n", udata.UserID, udata.Firstname, udata.Lastname, udata.Email, udata.Password, udata.Bio, udata.ProfileImage)
		}
	}

	Respond(w, udata, http.StatusOK)
}
