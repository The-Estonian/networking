FROM golang:latest
WORKDIR /root
COPY go.mod .
RUN go mod download
COPY . .
RUN go build -o ./output .
EXPOSE 8080
CMD ["./output"]