package main

import (
	"bytes"
	"errors"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"log"
	"os"
	"os/exec"
	"regexp"
)

type ManimArgs struct {
	Code       string `json:"code"`
	ProjectUid string `json:"projectUid"`
}

const ManimRoot = "/manim"
const MediaPrefix = "/media"

func main() {
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
	}))

	app.Static(MediaPrefix, ManimRoot)

	app.Post("/render", func(c *fiber.Ctx) error {
		args := new(ManimArgs)

		if err := c.BodyParser(args); err != nil {
			return err
		}
		if !isProjectInit(args.ProjectUid) {
			err := initProject(args.ProjectUid)
			if err != nil {
				return err
			}
		}

		err := writeCode(args.ProjectUid, args.Code)
		if err != nil {
			return nil
		}

		stdout, _ := execManim(args.ProjectUid, "render", "-o", "out", "main.py")
		outFile := GetOutFileDir(stdout)
		return c.JSON(fiber.Map{
			"out": outFile,
			"log": stdout,
		})
	})

	app.Listen(":3000")
}

func writeCode(projectUid string, value string) error {
	// Read Write Mode
	file, err := os.OpenFile(projectUid+"/main.py", os.O_RDWR, 0644)
	if err != nil {
		log.Fatalf("failed opening file: %s", err)
	}
	defer file.Close()
	// replace contents of file
	err = file.Truncate(0)
	_, err = file.Seek(0, 0)
	_, err = file.WriteAt([]byte(value), 0) // Write at 0 beginning
	if err != nil {
		log.Fatalf("failed writing to file: %s\n", err)
		return err
	}
	return nil
}

func isProjectInit(uid string) bool {
	// check if project directory exists
	if _, err := os.Stat(uid); errors.Is(err, os.ErrNotExist) {
		return false
	}
	// check if manim config inside project directory exists
	if _, err := os.Stat(uid + "/manim.cfg"); errors.Is(err, os.ErrNotExist) {
		return false
	}
	return true
}

func initProject(uid string) error {
	err := os.Mkdir(uid, 0755)
	if err != nil {
		log.Fatalf("Failed to init project dir: %s", err)
		return err
	}
	_, err = execManim(uid, "init")
	if err != nil {
		log.Fatalf("Failed to init manim: %s", err)
		return err
	}
	return nil
}

func execManim(projectUid string, arg ...string) (string, error) {
	fmt.Printf("Executing manim command: %s\n", arg)
	cmd := exec.Command("manim", arg...)
	cmd.Dir = projectUid // set working directory
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	err := cmd.Run()
	if err != nil {
		return stderr.String(), nil
	}
	return stdout.String(), err
}

func GetOutFileDir(value string) string {
	// remove line breaks and whitespace
	r, _ := regexp.Compile("[ \n\t]")
	trimmed := r.ReplaceAllString(value, "")
	// find a string containing output file path
	r, _ = regexp.Compile("Filereadyat'.+'")
	line := r.FindString(trimmed)
	// extract file path from matched string
	r, _ = regexp.Compile("Filereadyat|'|" + ManimRoot)
	// prefix with static folder dir
	return MediaPrefix + r.ReplaceAllString(line, "")
}
