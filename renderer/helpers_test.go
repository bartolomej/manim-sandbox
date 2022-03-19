package main

import (
	"testing"
)

func TestGetOutFileDir(t *testing.T) {
	fileDir := GetOutFileDir(`Manim Community v0.15.1

[03/19/22 09:10:19] INFO     Animation 0 : Partial      scene_file_writer.py:500
                             movie file written in '/ma                         
                             nim/media/videos/main/480p                         
                             30/partial_movie_files/Cre                         
                             ateCircle/2974088251_19922                         
                             04193_223132457.mp4'                               
                    INFO     Combining to Movie file.   scene_file_writer.py:594
                    INFO                                scene_file_writer.py:715
                             File ready at '/manim/medi                         
                             a/videos/main/480p30/out.m                         
                             p4'                                                
                                                                                
                    INFO     Rendered CreateCircle                  scene.py:240
                             Played 1 animations`)
	if fileDir != "/media/media/videos/main/480p30/out.mp4" {
		t.Fatalf(`Output file invalid: '%s'`, fileDir)
	}
}
