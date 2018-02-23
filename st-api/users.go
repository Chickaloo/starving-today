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

	uresult, uerr := db.Connection.Exec(fmt.Sprintf("UPDATE stat SET recipe_count = \"%d\", user_count = \"%d\" WHERE 1", res.RecipeCount, res.UserCount-1))
	if uerr != nil {
		if *Debug {
			fmt.Println("Count Update Failed: ", uerr.Error())
		}
		res.Content = fmt.Sprintf("Count Update Failed: %s", uerr.Error())
		Respond(w, uresult, http.StatusInternalServerError)
		return
	}

	res.UserCount -= 1

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
		Name:    "HungerHub-Auth",
		Value:   "",
		Expires: time.Unix(0, 0),
	}

	http.SetCookie(w, &dcookie)
	Respond(w, res, http.StatusOK)

}

// UserAuth implements GET /users/auth
func UserAuth(w http.ResponseWriter, r *http.Request) {
	var res Response

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
