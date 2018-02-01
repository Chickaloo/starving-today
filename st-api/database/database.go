/* vim:ts=4:sw=4:noexpandtab:softtabstop=4
 * Christopher Kong
 */

// Package database contains the database connection for the rest of the API.
// For more documentation, please go to https://swaggerhub.com/apis/chickaloo/StarvingTodayBackend/1.0.0
package database

import (
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
)

// Connection is the database to be used by the main package
var Connection *sql.DB
