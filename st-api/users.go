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
	"time"

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
	/*
		ndata := strings.Split(rdata.Firstname, " ")
		fname := ndata[0]
		lname := strings.Join(ndata[1:], " ")
		rdata.Firstname = fname
		rdata.Lastname = lname
	*/
	query := fmt.Sprintf("INSERT INTO user (user_name, first_name, last_name, password, email)\nVALUES (\"%s\", \"%s\", \"%s\", \"%s\", \"%s\")", rdata.Username, "Stranger", "Danger", rdata.Password, rdata.Email)
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

	// Increment User count in stats
	if uperr := StatUpdate(0, 1); uperr != nil {
		Respond(w, res, http.StatusInternalServerError)
		return
	}

	Respond(w, rdata, http.StatusOK)
	return
}

// UserDelete is the delete function for Users
func UserDelete(w http.ResponseWriter, r *http.Request) {
	var res Response

	params := mux.Vars(r)

	query := fmt.Sprintf("DELETE FROM user WHERE user_id=%s", params["userid"])
	result, err := db.Connection.Exec(query)
	if err != nil {
		if *Debug {
			fmt.Println("User Not Found: ", err.Error())
		}
		res.Content = fmt.Sprintf("User Not Found: %s", err.Error())
		Respond(w, res, http.StatusNotFound)
		return
	}

	_, cerr := result.RowsAffected()
	if cerr != nil {
		if *Debug {
			fmt.Println("User Deletion failed: ", cerr.Error())
		}
		res.Content = fmt.Sprintf("User Deletion failed: %s", cerr.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	}

	// Decrement recipe count in stats
	if uperr := StatUpdate(0, -1); uperr != nil {
		Respond(w, res, http.StatusInternalServerError)
		return
	}

	Respond(w, res, http.StatusOK)
}

// UserLogin is the authentication function for the API. It implements POST /users/login
func UserLogin(w http.ResponseWriter, r *http.Request) {

	var rdata User
	var res Response

	if r.Method == "OPTIONS" {
		Respond(w, res, http.StatusOK)
		return
	}

	if err := Decode(w, r, &rdata); err != nil {
		if *Debug {
			fmt.Println("Erreeeer")
		}
		res.Content = "Invalid JSON format recieved!"
		Respond(w, res, http.StatusBadRequest)
		return
	}

	err := db.Connection.QueryRow(fmt.Sprintf("SELECT user_id, user_name, first_name, last_name, email, bio, profile_image FROM user WHERE user_name=\"%s\" AND password=\"%s\"", rdata.Username, rdata.Password)).Scan(&rdata.UserID, &rdata.Username, &rdata.Firstname, &rdata.Lastname, &rdata.Email, &rdata.Bio, &rdata.ProfileImage)
	switch {
	case err == sql.ErrNoRows:
		res.Content = fmt.Sprintf("Login Combination not found. Error: %s", err.Error())
		Respond(w, res, http.StatusNotFound)
		return

	case err != nil:
		res.Content = fmt.Sprintf("Login DB Failed: %s", err.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	default:
		res.Content = "Login successful!"
	}

	var cookie = http.Cookie{
		Name:     "HungerHub-Auth",
		Value:    strconv.Itoa(rdata.UserID) + "-" + rdata.Username,
		HttpOnly: true,
		Path:     "/",
		MaxAge:   86400,
	}

	res.User = &rdata

	http.SetCookie(w, &cookie)
	Respond(w, res, http.StatusOK)

	return
}

// UserLogout logs a user out.
func UserLogout(w http.ResponseWriter, r *http.Request) {
	var res Response

	if r.Method == "OPTIONS" {
		Respond(w, res, http.StatusOK)
		return
	}

	_, err := r.Cookie("HungerHub-Auth")
	if err != nil {
		res.Content = "Cookie Reading Failed"
		Respond(w, res, http.StatusInternalServerError)
		return
	}

	var dcookie = http.Cookie{
		Name:   "HungerHub-Auth",
		Value:  "-1",
		Path:   "/",
		MaxAge: -1,
	}

	http.SetCookie(w, &dcookie)
	Respond(w, res, http.StatusOK)
}

// UserAuth implements GET /users/auth
func UserAuth(w http.ResponseWriter, r *http.Request) {
	var res Response
	var rdata User

	if r.Method == "OPTIONS" {
		Respond(w, res, http.StatusOK)
		return
	}

	cookie, err := r.Cookie("HungerHub-Auth")
	if err != nil {
		res.Content = "Cookie Reading Failed"
		Respond(w, res, http.StatusInternalServerError)
		return
	}

	if time.Now().Sub(cookie.Expires) <= 0 {
		res.Content = "Cookie Expired"
		Respond(w, res, http.StatusTeapot)
		return
	}

	id := strings.Split(cookie.Value, "-")[0]

	uerr := db.Connection.QueryRow(fmt.Sprintf("SELECT user_id, user_name, first_name, last_name, email, bio, profile_image FROM user WHERE user_id=\"%s\"", id)).Scan(&rdata.UserID, &rdata.Username, &rdata.Firstname, &rdata.Lastname, &rdata.Email, &rdata.Bio, &rdata.ProfileImage)
	switch {
	case uerr == sql.ErrNoRows:
		res.Content = fmt.Sprintf("Login Combination not found. Error: %s", err.Error())
		Respond(w, res, http.StatusNotFound)
		return

	case uerr != nil:
		res.Content = fmt.Sprintf("Login DB Failed: %s", err.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	default:
		res.Content = "Login successful!"
	}

	res.User = &rdata

	res.Content = "Login OK"
	Respond(w, res, http.StatusOK)
}

// UserGetByID implements the GET /api/users/{userid} to retrieve info about a particular user
func UserGetByID(w http.ResponseWriter, r *http.Request) {
	var udata User
	var res Response
	params := mux.Vars(r)

	err := db.Connection.QueryRow(fmt.Sprintf("SELECT user_id, user_name, first_name, last_name, email, bio, profile_image FROM user WHERE user_id=%s", params["userid"])).Scan(&udata.UserID, &udata.Username, &udata.Firstname, &udata.Lastname, &udata.Email, &udata.Bio, &udata.ProfileImage)
	switch {
	case err == sql.ErrNoRows:
		res.Content = fmt.Sprintf("User not found. Error: %s", err.Error())
		Respond(w, res, http.StatusNotFound)
		return

	case err != nil:
		res.Content = fmt.Sprintf("Database error. Error: %s", err.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	default:
		res.Content = "User Found!"
	}

	if *Debug {
		fmt.Printf("%d: %s %s %s %s %s %s\n", udata.UserID, udata.Firstname, udata.Lastname, udata.Email, udata.Password, udata.Bio, udata.ProfileImage)
	}
	res.User = &udata
	Respond(w, res, http.StatusOK)

}

// UserEdit implements the PUT /users/{userid} endpoint to edit a user's info
func UserEdit(w http.ResponseWriter, r *http.Request) {
	var rdata User
	var res Response
	params := mux.Vars(r)

	if err := Decode(w, r, &rdata); err != nil {
		if *Debug {
			fmt.Println("Error")
		}
		res.Content = "Invalid JSON format received!"
		Respond(w, res, http.StatusBadRequest)
		return
	}

	query := fmt.Sprintf("UPDATE user\nSET user_name=\"%s\", first_name=\"%s\", last_name=\"%s\", email=\"%s\", password=\"%s\", bio=\"%s\", profile_image=\"%s\"\nWHERE user_id=\"%s\"", rdata.Username, rdata.Firstname, rdata.Lastname, rdata.Email, rdata.Password, rdata.Bio, rdata.ProfileImage, params["userid"])
	result, err := db.Connection.Exec(query)
	if err != nil {
		if *Debug {
			fmt.Println("User Edit Failed: ", err.Error())
		}
		res.Content = fmt.Sprintf("User Edit Failed: %s", err.Error())
		Respond(w, result, http.StatusInternalServerError)
		return
	}
	Respond(w, res, http.StatusOK)
}
