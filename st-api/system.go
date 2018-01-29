/* vim:ts=4:sw=4:noexpandtab:softtabstop=4
 * Christopher Kong
 */

// StarvingToday API server that supports RESTful interface.
// For more documentation, please go to https://swaggerhub.com/apis/chickaloo/StarvingTodayBackend/1.0.0
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
	"strings"
	"time"
)

const contentType = "application/json"

// SendCommand start another command and collect stdout. Kills off that command if it fails
// to finish is a reasonable time (currently fixed a 600s, i.e. 10 minutes).
func SendCommand(a string) (string, error) {

	args := strings.Split(a, " ")
	var err error

	for i := 1; i <= 3; i++ {
		cmd := exec.Command(args[0])
		cmd.Args = args
		var out bytes.Buffer
		cmd.Stdout = &out
		err = cmd.Start()

		if err != nil {
			fmt.Printf("Error: %s\n", err.Error())
		}
		var timer *time.Timer
		timer = time.AfterFunc(600*time.Second, func() {
			// fmt.Printf("Command %s timed out.\n", cmd.Args)
			cmd.Process.Kill()
		})

		err = cmd.Wait()
		timer.Stop()
		if strings.Contains(out.String(), "cli_client ERROR") || strings.Contains(out.String(), "cio daemon") {
			// fmt.Printf("Fail: %s\nRetry: %s\n", cmd.Args, i)
		} else {
			return strings.TrimSpace(out.String()), err
		}

	}
	return "Fail", err
}

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
