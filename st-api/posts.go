package main

import (
	//"database/sql"
	"fmt"
	"net/http"

	db "./database"
	"github.com/gorilla/mux"
)

// PostCreate implements the POST /posts endpoint to create a post
func PostCreate(w http.ResponseWriter, r *http.Request) {
	var rdata Post
	var res Response

	if err := Decode(w, r, &rdata); err != nil {
		if *Debug {
			fmt.Println("Error")
		}
		res.Content = "Invalid JSON format received!"
		Respond(w, res, http.StatusBadRequest)
		return
	}

	query := fmt.Sprintf("INSERT INTO post (user_id, poster_id, title, content)\nVALUES (\"%d\", \"%d\", \"%s\", \"%s\")", rdata.UserID, rdata.PosterID, rdata.Title, rdata.Content)
	result, err := db.Connection.Exec(query)
	if err != nil {
		if *Debug {
			fmt.Println("Post Creation Failed: ", err.Error())
		}
		res.Content = fmt.Sprintf("Post Creation Failed: %s", err.Error())
		Respond(w, result, http.StatusInternalServerError)
		return
	}

	Respond(w, rdata, http.StatusOK)
}

// PostDelete implements the DELETE /posts/{postid} endpoint to delete a post
func PostDelete(w http.ResponseWriter, r *http.Request) {
	var res Response
	params := mux.Vars(r)

	query := fmt.Sprintf("DELETE FROM post WHERE post_id=%s", params["postid"])
	result, err := db.Connection.Exec(query)
	if err != nil {
		if *Debug {
			fmt.Println("Post Not Found: ", err.Error())
		}
		res.Content = fmt.Sprintf("Post Not Found: %s", err.Error())
		Respond(w, res, http.StatusNotFound)
		return
	}
	_, perr := result.RowsAffected()
	if perr != nil {
		if *Debug {
			fmt.Println("Post Deletion Failed: ", perr.Error())
		}
		res.Content = fmt.Sprintf("Post Deletion Failed: %s", perr.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	}
	Respond(w, res, http.StatusOK)
}

// PostEdit implements the PUT /posts/{postid} endpoint to edit a post
func PostEdit(w http.ResponseWriter, r *http.Request) {
	var rdata Post
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
	query := fmt.Sprintf("UPDATE post\nSET title=\"%s\", content=\"%s\"\nWHERE post_id=\"%s\"", rdata.Title, rdata.Content, params["postid"])
	result, err := db.Connection.Exec(query)
	if err != nil {
		if *Debug {
			fmt.Println("Post Edit Failed: ", err.Error())
		}
		res.Content = fmt.Sprintf("Post Edit Failed: %s", err.Error())
		Respond(w, result, http.StatusInternalServerError)
		return
	}
	Respond(w, rdata, http.StatusOK)
}

// PostsGetByUserID implements the GET /posts/{userid} endpoint to get the posts for a user
func PostsGetByUserID(w http.ResponseWriter, r *http.Request) {
	var res Response
	params := mux.Vars(r)

	rows, err := db.Connection.Query(fmt.Sprintf("SELECT post_id, user_id, poster_id, title, content, time FROM post WHERE user_id=\"%s\"", params["userid"]))
	if err != nil {
		fmt.Println("Query Error: " + err.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	rdata := make(map[int]Post)
	for rows.Next() {
		var re Post
		if err := rows.Scan(&re.PostID, &re.UserID, &re.PosterID, &re.Title, &re.Content, &re.Date); err != nil {
			res.Content = "Getting Posts of a User Failed!"
			Respond(w, res, http.StatusInternalServerError)
			return
		}
		if *Debug {
			fmt.Printf("%d: %d %d %s %s %s\n", re.PostID, re.UserID, re.PosterID, re.Title, re.Content, re.Date)
		}
		rdata[re.PostID] = re
	}
	if err := rows.Err(); err != nil {
		Respond(w, res, http.StatusInternalServerError)
		return
	}
	Respond(w, rdata, http.StatusOK)
}
