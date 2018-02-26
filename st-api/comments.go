package main

import (
	"database/sql"
	"fmt"
	"net/http"

	db "./database"
	"github.com/gorilla/mux"
)

// CommentCreate implements the POST /comments endpoint to create a comment
func CommentCreate(w http.ResponseWriter, r *http.Request) {
    var rdata Comment
    var res Response

    if err := Decode(w, r, &rdata); err != nil {
		if *Debug {
			fmt.Println("Error")
		}
		res.Content = "Invalid JSON format recieved!"
		Respond(w, res, http.StatusBadRequest)
		return
	}

    query := fmt.Sprintf("INSERT INTO comment (comment, recipe_id, user_id, poster_id)\nValues (\"%s\", \"%d\", \"%d\", \"%d\")", rdata.Comment, rdata.RecipeID, rdata.UserID, rdata.PosterID)
    result, err := db.Connection.Exec(query)
    if err != nil {
        if *Debug {
            fmt.Println("Comment Creation Failed: ", err.Error())
        }
        res.Content = fmt.Sprintf("Comment Creation Failed: %s", err.Error())
		Respond(w, result, http.StatusInternalServerError)
		return
    }

	Respond(w, rdata, http.StatusOK)
}

// CommentGetByID implements the GET /comments/comment/{commentid} endpoint to get a comment
func CommentGetByID(w http.ResponseWriter, r *http.Request) {
	var rdata Comment
	var res Response
	params := mux.Vars(r)

	err := db.Connection.QueryRow(fmt.Sprintf("SELECT comment_id, date, comment, recipe_id, user_id, poster_id FROM comment WHERE comment_id=\"%s\"", params["commentid"])).Scan(&rdata.CommentID, &rdata.Date, &rdata.Comment, &rdata.RecipeID, &rdata.UserID, &rdata.PosterID)
	switch {
	case err == sql.ErrNoRows:
		res.Content = fmt.Sprintf("Comment not found. Error: %s", err.Error())
		Respond(w, res, http.StatusNotFound)
		return
	case err != nil:
		res.Content = fmt.Sprintf("Comment retrieval failed: %s", err.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	default:
		res.Content = "Comment retrieval successful!"
	}

	Respond(w, rdata, http.StatusOK)
}

// CommentDelete implements the DELETE /comments/{commentid} endpoint to delete a comment
func CommentDelete(w http.ResponseWriter, r *http.Request) {
	var res Response

	params := mux.Vars(r)

	query := fmt.Sprintf("DELETE FROM comment WHERE comment_id=%s", params["commentid"])
	result, err := db.Connection.Exec(query)
	if err != nil {
		if *Debug {
			fmt.Println("Comment Not Found: ", err.Error())
		}
		res.Content = fmt.Sprintf("Comment Not Found: %s", err.Error())
		Respond(w, res, http.StatusNotFound)
		return
	}

	_, cerr := result.RowsAffected()
	if cerr != nil {
		if *Debug {
			fmt.Println("Comment Deletion failed: ", cerr.Error())
		}
		res.Content = fmt.Sprintf("Comment Deletion failed: %s", cerr.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	}
	Respond(w, res, http.StatusOK)
}

// CommentsGetByRecipdID implements the GET /comments/recipe/{recipdid} endpoint to get the comments for a recipe
func CommentsGetByRecipeID(w http.ResponseWriter, r *http.Request) {
	var res Response
	var rdata Comments
	params := mux.Vars(r)

	rows, err := db.Connection.Query(fmt.Sprintf("SELECT comment_id, date, comment, recipe_id, user_id, poster_id FROM comment WHERE recipe_id=\"%s\"", params["recipeid"]))
	if err != nil {
		fmt.Println("Query Error: " + err.Error())
		Respond(w, res, http.StatusInternalServerError)
		return
	}

	defer rows.Close()
	rdata.CommentsList = make(map[int]Comment)
	for rows.Next() {
		var re Comment
		if err := rows.Scan(&re.CommentID, &re.Date, &re.Comment, &re.RecipeID, &re.UserID, &re.PosterID); err != nil {
			res.Content = "Comment Population Failed!"
			Respond(w, res, http.StatusInternalServerError)
			return
		}
		if *Debug {
			fmt.Printf("%d: %d %s %d %d %d\n", re.CommentID, re.Date, re.Comment, re.RecipeID, re.UserID, re.PosterID)
		}
		rdata.CommentsList[re.CommentID] = re
	}
	if err := rows.Err(); err != nil {
		Respond(w, res, http.StatusInternalServerError)
		return
	}

	Respond(w, rdata, http.StatusOK)
}
