package main

import (
	"fmt"
	"os/exec"
)

func main() {
	manimCmd := exec.Command("manim", "--version")
	manimOut, err := manimCmd.Output()
	if err != nil {
		panic(err)
	}
	fmt.Println(string(manimOut))
}
