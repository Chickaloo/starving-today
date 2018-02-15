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

	if err := Decode(w, r, &rdata); err != nil {
		if *Debug {
			fmt.Println("Erreeeer")
		}
		res.Content = "Invalid JSON format recieved!"
		Respond(w, res, http.StatusBadRequest)
		return
	}

	err := db.Connection.QueryRow(fmt.Sprintf("SELECT user_id, first_name, last_name FROM user WHERE user_name=\"%s\" AND password=\"%s\"", rdata.Username, rdata.Password)).Scan(&rdata.UserID, &rdata.Firstname, &rdata.Lastname)
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
		Name:    "HungerHub-Auth",
		Value:   strconv.Itoa(rdata.UserID) + "-" + rdata.Username,
		Expires: time.Now().AddDate(0, 0, 1),
		Path:    "/",
		MaxAge:  86400,
	}
	http.SetCookie(w, &cookie)

	Respond(w, rdata, http.StatusOK)
	return
}

// UserAuth implements GET /users/auth
func UserAuth(w http.ResponseWriter, r *http.Request) {
	var res Response

	cookie, err := r.Cookie("HungerHub-Auth")
	if err != nil {
		res.Content = "Cookie Reading Failed"
		Respond(w, res, http.StatusNotFound)
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
