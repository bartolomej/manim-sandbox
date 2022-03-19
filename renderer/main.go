package main

import (
	"bytes"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"log"
	"os"
	"os/exec"
)

type ManimArgs struct {
	Code string `json:"code"`
}

func main() {
	execManim("init")

	app := fiber.New()

	app.Static("/media", "/manim/media")

	app.Post("/render", func(c *fiber.Ctx) error {
		args := new(ManimArgs)

		if err := c.BodyParser(args); err != nil {
			return err
		}
		writeCode(args.Code)
		out := execManim("render", "-o", "out", "main.py")
		return c.SendString(out)
	})

	app.Listen(":3000")
}

func writeCode(value string) {
	// Read Write Mode
	file, err := os.OpenFile("main.py", os.O_RDWR, 0644)

	if err != nil {
		log.Fatalf("failed opening file: %s", err)
	}
	defer file.Close()
	err = file.Truncate(0)
	_, err = file.Seek(0, 0)
	_, err = file.WriteAt([]byte(value), 0) // Write at 0 beginning
	if err != nil {
		log.Fatalf("failed writing to file: %s\n", err)
	}
}

func execManim(arg ...string) string {
	fmt.Printf("Executing manim command: %s\n", arg)
	cmd := exec.Command("manim", arg...)
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	err := cmd.Run()
	if err != nil {
		return stderr.String()
	}
	return stdout.String()
}
