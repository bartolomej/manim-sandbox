# Manim Sandbox

[Manim](https://www.manim.community/) (mathematical animation library) coding sandbox for fast & easy manim scene creation.

> ⚠️ This is just a prototype application.

## Render service

This service takes care of the rendering logic. It wraps manim cli with a http interface.

Render a simple circle scene:
```shell
curl \
  --data '{ "projectUid": "test", "code": "from manim import *\n\nclass CreateCircle(Scene):\n    def construct(self):\n        circle = Circle()\n        circle.set_fill(PINK, opacity=0.5)\n        self.play(Create(circle))" }' \
  --header 'Content-Type: application/json' \
  --request POST http://localhost:3000/render
```

When deploying renderer service to Digital Ocean use [this config](./manim-sandbox.yaml).
