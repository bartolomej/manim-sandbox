FROM golang:1.18 as builder

WORKDIR /usr/src/app

COPY go.mod ./
RUN go mod download && go mod verify

COPY . .
RUN go build -v -o /usr/local/bin/app ./...

FROM manimcommunity/manim:stable

COPY --from=builder /usr/local/bin/app /usr/local/bin/app

RUN manim --version
RUN echo $PATH

CMD ["app"]